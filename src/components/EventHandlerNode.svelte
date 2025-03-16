<script>
  import { createEventDispatcher } from 'svelte';
  import { pannable } from '../lib/pannable';
  import { eventStore } from '../stores/eventStore.js';
    
  // Props
  export let handler: EventHandler;
  
  // Local state
  let isDragging = false;
  let isProcessing = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle node dragging
  function handlePanStart() {
    isDragging = true;
  }
  
  function handlePanMove(event: CustomEvent<{ dx: number; dy: number }>) {
    if (!isDragging) return;
    
    const { dx, dy } = event.detail;
    eventStore.updatePosition(handler.id, {
      x: handler.position.x + dx,
      y: handler.position.y + dy
    });
  }
  
  function handlePanEnd() {
    isDragging = false;
  }
  
  function handleClick() {
    if (!isDragging) {
      dispatch('select');
    }
  }
</script>

<div 
  class="event-node handler-node" 
  class:processing={isProcessing}
  style="
    left: {handler.position.x}px; 
    top: {handler.position.y}px;
    background-color: {handler.color};
  "
  use:pannable={{
    onPanStart: handlePanStart,
    onPanMove: handlePanMove,
    onPanEnd: handlePanEnd
  }}
  on:click={handleClick}
  on:keydown={(e) => e.key === 'Enter' && handleClick()}
  role="button"
  tabindex="0"
  aria-label="Event handler: {handler.name}"
>
  <div class="node-header">
    <div class="node-icon">🔄</div>
    <div class="node-title">{handler.name}</div>
  </div>
  
  <div class="node-content">
    <div class="event-types">
      <span class="label">Listens to:</span>
      <div class="tags">
        {#each handler.subscribedTypes as type}
          <span class="tag">{type}</span>
        {/each}
      </div>
    </div>
    
    <div class="processing-info">
      <span class="label">Processing Time:</span>
      <span class="value">{handler.processingTime}ms</span>
    </div>
    
    <div class="status">
      {#if isProcessing}
        <div class="processing-indicator">Processing...</div>
      {:else}
        <div class="idle-indicator">Idle</div>
      {/if}
    </div>
  </div>
</div>

<style>
  .event-node {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    user-select: none;
  }
  
  .node-header {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-sm);
  }
  
  .node-icon {
    font-size: 1.25rem;
  }
  
  .node-title {
    font-weight: 600;
    font-size: 1rem;
  }
  
  .node-content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .event-types {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .label {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .tags {
    display: flex;
    gap: var(--spacing-xs);
    flex-wrap: wrap;
  }
  
  .tag {
    background-color: rgba(0, 0, 0, 0.2);
    padding: 2px 6px;
    border-radius: var(--radius-sm);
    font-size: 0.75rem;
  }
  
  .processing-info {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  .value {
    font-weight: 600;
    font-size: 0.85rem;
  }
  
  .status {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    margin-top: var(--spacing-xs);
  }
  
  .processing-indicator, .idle-indicator {
    font-size: 0.75rem;
    padding: 2px 6px;
    border-radius: var(--radius-sm);
  }
  
  .processing-indicator {
    background-color: var(--accent);
    color: var(--neutral);
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .idle-indicator {
    background-color: rgba(0, 0, 0, 0.2);
  }
  
  .processing {
    box-shadow: 0 0 20px rgba(255, 228, 108, 0.4);
  }
</style>