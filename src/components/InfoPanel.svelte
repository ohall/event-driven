<script>
  import { gameStore } from '../stores/gameStore';
  import { slide } from 'svelte/transition';
  import { quintOut } from 'svelte/easing';
  
  let minimized = false;
  
  function toggleMinimize() {
    minimized = !minimized;
  }
  
  // Get current scenario
  $: currentScenario = $gameStore.scenarios[$gameStore.currentScenarioId || 'intro'];
</script>

<div class="info-panel" class:minimized>
  <button 
    class="handle" 
    on:click={toggleMinimize}
    on:keydown={(e) => e.key === 'Enter' && toggleMinimize()}
    aria-expanded={!minimized}
    aria-label={minimized ? 'Expand Info Panel' : 'Collapse Info Panel'}
  >
    <span class="handle-icon">{minimized ? '↑' : '↓'}</span>
    <h3>{minimized ? 'Expand Info Panel' : currentScenario.title}</h3>
  </button>
  
  {#if !minimized}
    <div class="panel-content" transition:slide={{ duration: 300, easing: quintOut }}>
      <div class="description">
        <p>{currentScenario.description}</p>
      </div>
      
      <div class="objectives">
        <h4>Objectives:</h4>
        <ul>
          {#each currentScenario.objectives as objective}
            <li class="objective">
              <div class="objective-checkbox" class:completed={objective.completed}>
                {#if objective.completed}✓{/if}
              </div>
              <span>{objective.description}</span>
            </li>
          {/each}
        </ul>
      </div>
      
      {#if $gameStore.showExplanations}
        <div class="concepts">
          <h4>Key Concepts:</h4>
          <dl>
            <dt>Event Emitter</dt>
            <dd>Component that creates and broadcasts events.</dd>
            
            <dt>Event</dt>
            <dd>Message containing data about something that happened in the system.</dd>
            
            <dt>Event Handler</dt>
            <dd>Component that receives and processes events.</dd>
            
            <dt>Event Queue</dt>
            <dd>Buffer that stores events until they can be processed.</dd>
            
            <dt>Asynchronous Processing</dt>
            <dd>Handling events without blocking other operations.</dd>
          </dl>
        </div>
      {/if}
      
      <div class="hints">
        <h4>Hints:</h4>
        <p class="hint">{currentScenario.hints[0]}</p>
        {#if $gameStore.showExplanations}
          {#each currentScenario.hints.slice(1) as hint}
            <p class="hint">{hint}</p>
          {/each}
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .info-panel {
    position: absolute;
    bottom: 0;
    right: 0;
    max-width: 400px;
    width: 25%;
    min-width: 300px;
    background-color: rgba(26, 26, 46, 0.9);
    backdrop-filter: blur(5px);
    border-radius: var(--radius-lg) 0 0 0;
    z-index: 100;
    transition: all var(--transition-normal) ease-in-out;
    box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.2);
  }
  
  .handle {
    display: flex;
    align-items: center;
    padding: var(--spacing-md);
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: none;
    border-top: none;
    border-left: none;
    border-right: none;
    width: 100%;
    text-align: left;
  }
  
  .handle-icon {
    margin-right: var(--spacing-sm);
    font-size: 1.25rem;
  }
  
  .handle h3 {
    margin: 0;
    font-size: 1rem;
  }
  
  .panel-content {
    padding: var(--spacing-md);
    max-height: 60vh;
    overflow-y: auto;
  }
  
  .minimized {
    max-height: 50px;
    overflow: hidden;
    background-color: rgba(26, 26, 46, 0.7);
  }
  
  .description, .objectives, .concepts, .hints {
    margin-bottom: var(--spacing-lg);
  }
  
  h4 {
    font-size: 1rem;
    margin-bottom: var(--spacing-sm);
    color: var(--accent);
  }
  
  .objective {
    display: flex;
    align-items: center;
    margin-bottom: var(--spacing-sm);
  }
  
  .objective-checkbox {
    width: 18px;
    height: 18px;
    border-radius: var(--radius-sm);
    border: 2px solid var(--text-dark);
    margin-right: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    color: var(--background);
    transition: all var(--transition-fast) ease-in-out;
  }
  
  .objective-checkbox.completed {
    background-color: var(--success);
    border-color: var(--success);
  }
  
  dl {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--spacing-xs) var(--spacing-md);
  }
  
  dt {
    font-weight: 600;
    color: var(--primary);
  }
  
  dd {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-dark);
  }
  
  .hint {
    font-size: 0.875rem;
    font-style: italic;
    color: var(--text-dark);
    margin-bottom: var(--spacing-sm);
  }
</style>