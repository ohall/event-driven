<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { pannable } from '../lib/pannable';
  import { eventStore } from '../stores/eventStore';
  import type { EventEmitter } from '../stores/eventStore';
  
  // Props
  export let emitter: EventEmitter;
  
  // Local state
  let isDragging = false;
  let selectedEventType = emitter.types.length > 0 ? emitter.types[0] : '';
  let eventPayload = '{}';
  let showEmitForm = false;
  
  // Event dispatcher
  const dispatch = createEventDispatcher();
  
  // Handle node dragging
  function handlePanStart() {
    isDragging = true;
  }
  
  function handlePanMove(event: CustomEvent<{ dx: number; dy: number }>) {
    if (!isDragging) return;
    
    const { dx, dy } = event.detail;
    eventStore.updatePosition(emitter.id, {
      x: emitter.position.x + dx,
      y: emitter.position.y + dy
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
  
  function toggleEmitForm() {
    showEmitForm = !showEmitForm;
  }
  
  function emitEvent() {
    try {
      const payload = JSON.parse(eventPayload);
      eventStore.emitEvent(emitter.id, selectedEventType, payload);
      showEmitForm = false;
    } catch (error) {
      alert('Invalid JSON payload');
    }
  }
</script>

<div 
  class="event-node emitter-node" 
  style="
    left: {emitter.position.x}px; 
    top: {emitter.position.y}px;
    background-color: {emitter.color};
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
  aria-label="Event emitter: {emitter.name}"
>
  <div class="node-header">
    <div class="node-icon">📤</div>
    <div class="node-title">{emitter.name}</div>
  </div>
  
  <div class="node-content">
    <div class="event-types">
      <span class="label">Event Types:</span>
      <div class="tags">
        {#each emitter.types as type}
          <span class="tag">{type}</span>
        {/each}
      </div>
    </div>
    
    {#if showEmitForm}
      <div class="emit-form">
        <select bind:value={selectedEventType}>
          {#each emitter.types as type}
            <option value={type}>{type}</option>
          {/each}
        </select>
        
        <textarea 
          placeholder="Event payload (JSON)" 
          bind:value={eventPayload}
          rows="3"
        ></textarea>
        
        <div class="form-actions">
          <button class="emit-button" on:click={emitEvent}>Emit Event</button>
          <button class="cancel-button" on:click={toggleEmitForm}>Cancel</button>
        </div>
      </div>
    {:else}
      <button class="emit-button" on:click={toggleEmitForm}>
        Create Event
      </button>
    {/if}
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
  
  .emit-button {
    background-color: rgba(0, 0, 0, 0.3);
    color: var(--text);
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
    transition: all var(--transition-fast) ease-in-out;
  }
  
  .emit-button:hover {
    background-color: rgba(0, 0, 0, 0.4);
    transform: translateY(-1px);
  }
  
  .emit-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
    margin-top: var(--spacing-xs);
  }
  
  select, textarea {
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: var(--spacing-xs);
    border-radius: var(--radius-sm);
    font-size: 0.8rem;
  }
  
  .form-actions {
    display: flex;
    gap: var(--spacing-xs);
  }
  
  .cancel-button {
    background-color: rgba(0, 0, 0, 0.2);
    color: var(--text);
    border: none;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 0.8rem;
  }
</style>