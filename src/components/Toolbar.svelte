<script lang="ts">
  import { eventStore } from '../stores/eventStore';
  import Tooltip from './Tooltip.svelte';
  
  function addEmitter() {
    const name = prompt('Enter name for the emitter:', 'New Emitter');
    if (!name) return;
    
    const types = prompt('Enter event types (comma separated):', 'click,input')?.split(',') || [];
    const position = { x: 100, y: 100 + Math.random() * 200 };
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    
    eventStore.addEmitter(name, types, position, color);
  }
  
  function addHandler() {
    const name = prompt('Enter name for the handler:', 'New Handler');
    if (!name) return;
    
    const types = prompt('Enter subscribed event types (comma separated):', 'click,input')?.split(',') || [];
    const position = { x: 500, y: 100 + Math.random() * 200 };
    const color = `#${Math.floor(Math.random()*16777215).toString(16)}`;
    const processingTime = parseInt(prompt('Enter processing time (in ms):', '1000') || '1000');
    
    eventStore.addHandler(name, types, position, color, processingTime);
  }
  
  function addQueue() {
    const name = prompt('Enter name for the queue:', 'New Queue');
    if (!name) return;
    
    const position = { x: 300, y: 100 + Math.random() * 200 };
    const maxSize = parseInt(prompt('Enter max queue size:', '10') || '10');
    
    eventStore.addQueue(name, position, maxSize);
  }
</script>

<div class="toolbar">
  <div class="tool-group">
    <h3>Components</h3>
    <div class="tools">
      <Tooltip text="Add Event Emitter">
        <button class="tool-button" on:click={addEmitter}>
          <div class="icon emitter-icon">📤</div>
          <span>Emitter</span>
        </button>
      </Tooltip>
      
      <Tooltip text="Add Event Queue">
        <button class="tool-button" on:click={addQueue}>
          <div class="icon queue-icon">📋</div>
          <span>Queue</span>
        </button>
      </Tooltip>
      
      <Tooltip text="Add Event Handler">
        <button class="tool-button" on:click={addHandler}>
          <div class="icon handler-icon">🔄</div>
          <span>Handler</span>
        </button>
      </Tooltip>
    </div>
  </div>
  
  <div class="tool-group">
    <h3>Controls</h3>
    <div class="tools">
      <Tooltip text="Connect Components">
        <button class="tool-button">
          <div class="icon connect-icon">🔗</div>
          <span>Connect</span>
        </button>
      </Tooltip>
      
      <Tooltip text="Clear All">
        <button class="tool-button" on:click={() => eventStore.reset()}>
          <div class="icon clear-icon">🗑️</div>
          <span>Clear</span>
        </button>
      </Tooltip>
    </div>
  </div>
</div>

<style>
  .toolbar {
    display: flex;
    padding: var(--spacing-md);
    background-color: var(--background-light);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    gap: var(--spacing-xl);
  }
  
  .tool-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .tool-group h3 {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-dark);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  
  .tools {
    display: flex;
    gap: var(--spacing-sm);
  }
  
  .tool-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: var(--spacing-sm);
    background-color: var(--background);
    border-radius: var(--radius-md);
    border: 1px solid rgba(255, 255, 255, 0.1);
    cursor: pointer;
    transition: all var(--transition-fast) ease-in-out;
  }
  
  .tool-button:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateY(-2px);
  }
  
  .icon {
    font-size: 1.5rem;
    margin-bottom: var(--spacing-xs);
  }
  
  .tool-button span {
    font-size: 0.75rem;
  }
  
  .emitter-icon {
    color: var(--primary);
  }
  
  .queue-icon {
    color: var(--accent);
  }
  
  .handler-icon {
    color: var(--secondary);
  }
</style>