import { writable } from 'svelte/store';

export interface Scenario {
  id: string;
  title: string;
  description: string;
  level: number;
  objectives: {
    id: string;
    description: string;
    completed: boolean;
  }[];
  hints: string[];
  solution?: string;
}

export interface GameState {
  currentScenarioId: string | null;
  scenarios: Record<string, Scenario>;
  completedScenarioIds: string[];
  showExplanations: boolean;
  currentTutorialStep: number;
  maxTutorialStep: number;
}

const initialScenarios: Record<string, Scenario> = {
  'intro': {
    id: 'intro',
    title: 'Introduction to Events',
    description: 'Learn the basics of events and event emitters.',
    level: 1,
    objectives: [
      { id: 'obj1', description: 'Create a click event', completed: false },
      { id: 'obj2', description: 'Connect an emitter to a handler', completed: false },
      { id: 'obj3', description: 'Trigger the event', completed: false }
    ],
    hints: [
      'Click on the User Input emitter to create an event',
      'Drag a connection from the emitter to a handler',
      'Click the "Emit Event" button to trigger the event'
    ]
  },
  'queues': {
    id: 'queues',
    title: 'Event Queues',
    description: 'Learn how event queues work in event-driven systems.',
    level: 2,
    objectives: [
      { id: 'obj1', description: 'Create an event queue', completed: false },
      { id: 'obj2', description: 'Connect emitters to the queue', completed: false },
      { id: 'obj3', description: 'Connect the queue to handlers', completed: false },
      { id: 'obj4', description: 'Observe events flowing through the queue', completed: false }
    ],
    hints: [
      'Use the toolbox to add a new queue component',
      'Connect multiple emitters to the queue',
      'Connect the queue to multiple handlers',
      'Emit events and watch them flow through the queue'
    ]
  },
  'async': {
    id: 'async',
    title: 'Asynchronous Processing',
    description: 'Understand how asynchronous event processing works.',
    level: 3,
    objectives: [
      { id: 'obj1', description: 'Create handlers with different processing times', completed: false },
      { id: 'obj2', description: 'Emit multiple events in sequence', completed: false },
      { id: 'obj3', description: 'Observe the non-blocking nature of event processing', completed: false }
    ],
    hints: [
      'Create handlers with short and long processing times',
      'Connect both handlers to the same event type',
      'Emit several events in quick succession',
      'Notice how events are processed asynchronously'
    ]
  },
  'complex': {
    id: 'complex',
    title: 'Complex Event Flows',
    description: 'Build a complex event-driven system with multiple components.',
    level: 4,
    objectives: [
      { id: 'obj1', description: 'Create a system with at least 3 emitters', completed: false },
      { id: 'obj2', description: 'Add multiple queues with different purposes', completed: false },
      { id: 'obj3', description: 'Implement a chain of handlers', completed: false },
      { id: 'obj4', description: 'Create an event that triggers a cascade of other events', completed: false }
    ],
    hints: [
      'Create specialized emitters for different types of events',
      'Use separate queues for different categories of events',
      'Create handlers that emit new events when they finish processing',
      'Design a workflow where one event triggers a chain reaction'
    ]
  }
};

const initialState: GameState = {
  currentScenarioId: 'intro',
  scenarios: initialScenarios,
  completedScenarioIds: [],
  showExplanations: true,
  currentTutorialStep: 0,
  maxTutorialStep: 5
};

function createGameStore() {
  const { subscribe, update, set } = writable<GameState>(initialState);
  
  return {
    subscribe,
    
    // Select a scenario
    selectScenario: (scenarioId: string) => {
      update(state => {
        if (state.scenarios[scenarioId]) {
          state.currentScenarioId = scenarioId;
        }
        return state;
      });
    },
    
    // Mark an objective as completed
    completeObjective: (scenarioId: string, objectiveId: string) => {
      update(state => {
        const scenario = state.scenarios[scenarioId];
        if (scenario) {
          const objective = scenario.objectives.find(obj => obj.id === objectiveId);
          if (objective) {
            objective.completed = true;
            
            // Check if all objectives are completed
            const allCompleted = scenario.objectives.every(obj => obj.completed);
            if (allCompleted && !state.completedScenarioIds.includes(scenarioId)) {
              state.completedScenarioIds.push(scenarioId);
            }
          }
        }
        return state;
      });
    },
    
    // Toggle explanations visibility
    toggleExplanations: () => {
      update(state => {
        state.showExplanations = !state.showExplanations;
        return state;
      });
    },
    
    // Advance tutorial step
    nextTutorialStep: () => {
      update(state => {
        if (state.currentTutorialStep < state.maxTutorialStep) {
          state.currentTutorialStep++;
        }
        return state;
      });
    },
    
    // Go back a tutorial step
    prevTutorialStep: () => {
      update(state => {
        if (state.currentTutorialStep > 0) {
          state.currentTutorialStep--;
        }
        return state;
      });
    },
    
    // Reset the game
    reset: () => {
      set(initialState);
    }
  };
}

export const gameStore = createGameStore();