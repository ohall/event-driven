<script lang="ts">
  import { gameStore } from '../stores/gameStore';
</script>

<header>
  <div class="logo">
    <div class="logo-icon">🔄</div>
    <h1>Event-Driven Architecture Explorer</h1>
  </div>
  
  <nav>
    <button on:click={() => gameStore.reset()}>Reset</button>
    <button class="secondary" on:click={() => gameStore.toggleExplanations()}>
      {$gameStore.showExplanations ? 'Hide Explanations' : 'Show Explanations'}
    </button>
    <div class="scenario-selector">
      <span>Scenario:</span>
      <select 
        value={$gameStore.currentScenarioId} 
        on:change={(e) => gameStore.selectScenario(e.target.value)}
      >
        {#each Object.values($gameStore.scenarios) as scenario}
          <option value={scenario.id}>
            {scenario.title} (Level {scenario.level})
            {$gameStore.completedScenarioIds.includes(scenario.id) ? '✓' : ''}
          </option>
        {/each}
      </select>
    </div>
  </nav>
</header>

<style>
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--spacing-md) var(--spacing-lg);
    background-color: var(--background-light);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .logo {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .logo-icon {
    font-size: 2rem;
    animation: float 4s infinite ease-in-out;
  }
  
  h1 {
    margin: 0;
    font-size: 1.5rem;
    color: var(--text);
  }
  
  nav {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  
  .scenario-selector {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
  }
  
  select {
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    background-color: var(--background);
    color: var(--text);
    border: 1px solid rgba(255, 255, 255, 0.2);
    font-size: 0.875rem;
  }
</style>