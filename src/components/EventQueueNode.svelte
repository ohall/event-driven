<script>
  import { createEventDispatcher } from 'svelte';
  import { pannable } from '../lib/pannable';
  import { eventStore } from '../stores/eventStore.js';
    
  // Props
  export let queue: EventQueue;
  
  // Local state
  let isDragging = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle node dragging
  function handlePanStart() {
    isDragging = true;
  }
  
  function handlePanMove(event: CustomEvent<{ dx: number; dy: number }>) {
    if (!isDragging) return;
    
    const { dx, dy } = event.detail;
    eventStore.updatePosition(queue.id, {
      x: queue.position.x + dx,
      y: queue.position.y + dy
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
  
  function dequeueEvent(eventId: string) {
    eventStore.dequeueEvent(queue.id, eventId);
  }
  
  // Get events in this queue
  $: queueEvents = queue.events.map(id => $eventStore.events[id]).filter(Boolean);
</script>

<div 
  class="event-node queue-node" 
  style="
    left: {queue.position.x}px; 
    top: {queue.position.y}px;
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
  aria-label="Event queue: {queue.name}"
>
  <div class="node-header">
    <div class="node-icon">📋</div>
    <div class="node-title">{queue.name}</div>
  </div>
  
  <div class="node-content">
    <div class="queue-info">
      <div class="queue-stats">
        <span class="stat">{queue.events.length} / {queue.maxSize}</span>
        <span class="label">events in queue</span>
      </div>
      
      <div class="queue-progress">
        <div 
          class="queue-progress-bar" 
          style="width: {(queue.events.length / queue.maxSize) * 100}%"
        ></div>
      </div>
    </div>
    
    {#if queueEvents.length > 0}
      <div class="event-list">
        <div class="label">Queued Events:</div>
        <ul>
          {#each queueEvents as event}
            <li class="event-item">
              <span class="event-type">{event.type}</span>
              <button class="process-button" on:click={() => dequeueEvent(event.id)}>
                Process
              </button>
            </li>
          {/each}
        </ul>
      </div>
    {:else}
      <div class="empty-queue">Queue is empty</div>
    {/if}
  </div>
</div>

<style>
  .event-node {
    min-width: 200px;
    display: flex;
    flex-direction: column;
    user-select: none;
    background-color: var(--accent);
    color: var(--neutral);
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
  
  .queue-info {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }
  
  .queue-stats {
    display: flex;
    align-items: baseline;
    gap: var(--spacing-xs);
  }
  
  .stat {
    font-weight: 600;
    font-size: 1rem;
  }
  
  .label {
    font-size: 0.75rem;
    opacity: 0.8;
  }
  
  .queue-progress {
    width: 100%;
    height: 8px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: var(--radius-sm);
    overflow: hidden;
  }
  
  .queue-progress-bar {
    height: 100%;
    background-color: var(--neutral);
    transition: width var(--transition-normal) ease-in-out;
  }
  
  .event-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }
  
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    max-height: 100px;
    overflow-y: auto;
  }
  
  .event-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.1);
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
  }
  
  .event-type {
    font-weight: 500;
    font-size: 0.8rem;
  }
  
  .process-button {
    background-color: var(--neutral);
    color: var(--text);
    border: none;
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 0.7rem;
    cursor: pointer;
  }
  
  .empty-queue {
    text-align: center;
    font-size: 0.8rem;
    opacity: 0.6;
    padding: var(--spacing-sm);
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: var(--radius-sm);
  }
</style>