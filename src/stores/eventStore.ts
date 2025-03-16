import { writable, derived } from 'svelte/store';
import type { Writable } from 'svelte/store';

export interface EventData {
  id: string;
  type: string;
  payload: Record<string, any>;
  timestamp: number;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  source: string;
  targetHandlers: string[];
}

export interface EventEmitter {
  id: string;
  name: string;
  types: string[];
  position: { x: number; y: number };
  color: string;
}

export interface EventHandler {
  id: string;
  name: string;
  subscribedTypes: string[];
  position: { x: number; y: number };
  color: string;
  processingTime: number; // in ms
}

export interface EventQueue {
  id: string;
  name: string;
  position: { x: number; y: number };
  events: string[];
  maxSize: number;
}

interface EventState {
  events: Record<string, EventData>;
  emitters: Record<string, EventEmitter>;
  handlers: Record<string, EventHandler>;
  queues: Record<string, EventQueue>;
  connections: { from: string; to: string; type: string }[];
  activeEventIds: string[];
}

// Initialize with empty state
const initialState: EventState = {
  events: {},
  emitters: {},
  handlers: {},
  queues: {},
  connections: [],
  activeEventIds: []
};

// Create the writable store
const eventStoreWritable: Writable<EventState> = writable(initialState);

// Generate a unique ID for elements
const generateId = (prefix: string): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

// Create derived stores for convenience
export const events = derived(eventStoreWritable, $state => Object.values($state.events));
export const emitters = derived(eventStoreWritable, $state => Object.values($state.emitters));
export const handlers = derived(eventStoreWritable, $state => Object.values($state.handlers));
export const queues = derived(eventStoreWritable, $state => Object.values($state.queues));
export const connections = derived(eventStoreWritable, $state => $state.connections);
export const activeEvents = derived(eventStoreWritable, $state => 
  $state.activeEventIds.map(id => $state.events[id])
);

// Event store actions
export const eventStore = {
  subscribe: eventStoreWritable.subscribe,
  
  // Add a new event emitter
  addEmitter: (name: string, types: string[], position: { x: number; y: number }, color: string) => {
    eventStoreWritable.update(state => {
      const id = generateId('emitter');
      state.emitters[id] = { id, name, types, position, color };
      return state;
    });
  },
  
  // Add a new event handler
  addHandler: (name: string, subscribedTypes: string[], position: { x: number; y: number }, color: string, processingTime: number) => {
    eventStoreWritable.update(state => {
      const id = generateId('handler');
      state.handlers[id] = { id, name, subscribedTypes, position, color, processingTime };
      return state;
    });
  },
  
  // Add a new event queue
  addQueue: (name: string, position: { x: number; y: number }, maxSize: number) => {
    eventStoreWritable.update(state => {
      const id = generateId('queue');
      state.queues[id] = { id, name, position, events: [], maxSize };
      return state;
    });
  },
  
  // Create a connection between components
  connect: (fromId: string, toId: string, type: string) => {
    eventStoreWritable.update(state => {
      state.connections.push({ from: fromId, to: toId, type });
      return state;
    });
  },
  
  // Emit a new event
  emitEvent: (emitterId: string, type: string, payload: Record<string, any>) => {
    eventStoreWritable.update(state => {
      const emitter = state.emitters[emitterId];
      if (!emitter || !emitter.types.includes(type)) return state;
      
      const eventId = generateId('event');
      const newEvent: EventData = {
        id: eventId,
        type,
        payload,
        timestamp: Date.now(),
        status: 'pending',
        source: emitterId,
        targetHandlers: []
      };
      
      // Find handlers that are subscribed to this event type
      const targetHandlers = Object.values(state.handlers)
        .filter(handler => handler.subscribedTypes.includes(type))
        .map(handler => handler.id);
      
      newEvent.targetHandlers = targetHandlers;
      state.events[eventId] = newEvent;
      state.activeEventIds.push(eventId);
      
      // Find a queue connected to this emitter
      const queueConnection = state.connections.find(
        conn => conn.from === emitterId && conn.type === 'queue'
      );
      
      if (queueConnection) {
        const queueId = queueConnection.to;
        if (state.queues[queueId] && state.queues[queueId].events.length < state.queues[queueId].maxSize) {
          state.queues[queueId].events.push(eventId);
        }
      }
      
      return state;
    });
  },
  
  // Process an event in a handler
  processEvent: (eventId: string, handlerId: string) => {
    eventStoreWritable.update(state => {
      const event = state.events[eventId];
      const handler = state.handlers[handlerId];
      
      if (!event || !handler) return state;
      if (!event.targetHandlers.includes(handlerId)) return state;
      
      event.status = 'processing';
      
      // Simulating async processing with a timeout outside of the store
      setTimeout(() => {
        eventStoreWritable.update(innerState => {
          const innerEvent = innerState.events[eventId];
          if (innerEvent) {
            innerEvent.status = 'completed';
            // Remove from active events after completion
            innerState.activeEventIds = innerState.activeEventIds.filter(id => id !== eventId);
          }
          return innerState;
        });
      }, handler.processingTime);
      
      return state;
    });
  },
  
  // Remove an event from a queue and send to handler
  dequeueEvent: (queueId: string, eventId: string) => {
    eventStoreWritable.update(state => {
      const queue = state.queues[queueId];
      if (!queue || !queue.events.includes(eventId)) return state;
      
      // Remove from queue
      queue.events = queue.events.filter(id => id !== eventId);
      
      // Find a handler connection
      const handlerConnections = state.connections.filter(
        conn => conn.from === queueId && state.handlers[conn.to]
      );
      
      if (handlerConnections.length > 0) {
        // Send to first connected handler
        const handlerId = handlerConnections[0].to;
        if (state.events[eventId]) {
          this.processEvent(eventId, handlerId);
        }
      }
      
      return state;
    });
  },
  
  // Update component position (for drag and drop)
  updatePosition: (id: string, position: { x: number; y: number }) => {
    eventStoreWritable.update(state => {
      if (state.emitters[id]) {
        state.emitters[id].position = position;
      } else if (state.handlers[id]) {
        state.handlers[id].position = position;
      } else if (state.queues[id]) {
        state.queues[id].position = position;
      }
      return state;
    });
  },
  
  // Reset the store to initial state
  reset: () => {
    eventStoreWritable.set(initialState);
  }
};

// Initialize with some demo elements
eventStore.addEmitter('User Input', ['click', 'input', 'submit'], { x: 100, y: 200 }, '#FF6B6B');
eventStore.addEmitter('System Timer', ['tick', 'timeout'], { x: 100, y: 400 }, '#4ECDC4');
eventStore.addQueue('Event Queue', { x: 300, y: 300 }, 10);
eventStore.addHandler('UI Handler', ['click', 'input'], { x: 500, y: 200 }, '#FFE66D', 1000);
eventStore.addHandler('Data Handler', ['submit', 'timeout'], { x: 500, y: 400 }, '#1A535C', 2000);

// Create some connections
eventStore.connect('emitter-1', 'queue-1', 'queue');
eventStore.connect('emitter-2', 'queue-1', 'queue');
eventStore.connect('queue-1', 'handler-1', 'handler');
eventStore.connect('queue-1', 'handler-2', 'handler');