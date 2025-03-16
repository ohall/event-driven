<script>
  import { eventStore } from '../stores/eventStore.js';
  
  // Props
  export let connection;
  
  // Derived values
  $: fromNode = getNodePosition(connection.from);
  $: toNode = getNodePosition(connection.to);
  $: color = connection.type === 'queue' ? 'var(--primary)' : 'var(--secondary)';
  
  // Calculate line properties
  $: angle = Math.atan2(toNode.y - fromNode.y, toNode.x - fromNode.x);
  $: length = Math.hypot(toNode.x - fromNode.x, toNode.y - fromNode.y);
  
  function getNodePosition(id: string) {
    // Find the node in one of our stores
    const emitter = $eventStore.emitters.find(e => e.id === id);
    if (emitter) {
      return { x: emitter.position.x + 75, y: emitter.position.y + 25 };
    }
    
    const handler = $eventStore.handlers.find(h => h.id === id);
    if (handler) {
      return { x: handler.position.x + 75, y: handler.position.y + 25 };
    }
    
    const queue = $eventStore.queues.find(q => q.id === id);
    if (queue) {
      return { x: queue.position.x + 75, y: queue.position.y + 25 };
    }
    
    return { x: 0, y: 0 };
  }
</script>

<div 
  class="connection-line" 
  style="
    left: {fromNode.x}px; 
    top: {fromNode.y}px; 
    width: {length}px; 
    transform: rotate({angle}rad);
    background-color: {color};
  "
>
  <div class="connection-arrow" style="background-color: {color};"></div>
</div>

<style>
  .connection-line {
    position: absolute;
    height: 3px;
    transform-origin: 0 0;
    z-index: 1;
    pointer-events: none;
  }
  
  .connection-arrow {
    position: absolute;
    right: 0;
    top: -4px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 5px 0 5px 8px;
    border-color: transparent transparent transparent var(--primary);
  }
</style>