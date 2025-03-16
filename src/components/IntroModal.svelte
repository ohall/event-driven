<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import { elasticOut } from 'svelte/easing';
  
  const dispatch = createEventDispatcher();
  
  function close() {
    dispatch('close');
  }
</script>

<div class="modal-overlay" transition:fade={{ duration: 300 }}>
  <div class="modal" transition:fly={{ y: -20, duration: 400, easing: elasticOut }}>
    <button class="close-button" on:click={close}>×</button>
    
    <div class="modal-content">
      <div class="modal-header">
        <div class="logo">
          <div class="logo-icon">🔄</div>
          <h1>Event-Driven Architecture Explorer</h1>
        </div>
        <p class="tagline">Interactive Learning Tool</p>
      </div>
      
      <div class="modal-body">
        <h2>Welcome to the Event-Driven Architecture Explorer!</h2>
        
        <p class="intro-text">
          This interactive tool helps you learn and visualize event-driven architecture concepts through hands-on experimentation and guided scenarios.
        </p>
        
        <div class="features">
          <div class="feature">
            <div class="feature-icon">📤</div>
            <h3>Event Emitters</h3>
            <p>Create components that generate events and trigger system actions.</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">📋</div>
            <h3>Event Queues</h3>
            <p>Observe how events are stored and managed before processing.</p>
          </div>
          
          <div class="feature">
            <div class="feature-icon">🔄</div>
            <h3>Event Handlers</h3>
            <p>Build components that respond to events and perform actions.</p>
          </div>
        </div>
        
        <div class="get-started">
          <h3>How to Get Started:</h3>
          <ol>
            <li>Use the toolbar to add components to the canvas</li>
            <li>Connect components using the Connect button</li>
            <li>Trigger events from emitters and watch them flow through the system</li>
            <li>Complete scenario objectives to learn key concepts</li>
          </ol>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="primary-button" on:click={close}>Start Exploring</button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  .modal {
    background-color: var(--background-light);
    border-radius: var(--radius-lg);
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  }
  
  .close-button {
    position: absolute;
    top: var(--spacing-md);
    right: var(--spacing-md);
    width: 30px;
    height: 30px;
    border-radius: var(--radius-round);
    background-color: var(--background);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    cursor: pointer;
    border: none;
    z-index: 10;
  }
  
  .modal-content {
    padding: var(--spacing-xl);
  }
  
  .modal-header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
  }
  
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-sm);
  }
  
  .logo-icon {
    font-size: 3rem;
    animation: float 4s infinite ease-in-out;
  }
  
  .tagline {
    color: var(--text-dark);
    font-size: 1.25rem;
  }
  
  .intro-text {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
    color: var(--text-dark);
    text-align: center;
  }
  
  .features {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .feature {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    text-align: center;
    transition: transform var(--transition-normal) ease-in-out;
  }
  
  .feature:hover {
    transform: translateY(-5px);
  }
  
  .feature-icon {
    font-size: 2.5rem;
    margin-bottom: var(--spacing-md);
  }
  
  .feature h3 {
    margin-bottom: var(--spacing-sm);
    font-size: 1.2rem;
  }
  
  .feature p {
    color: var(--text-dark);
    font-size: 0.9rem;
  }
  
  .get-started {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }
  
  .get-started h3 {
    margin-bottom: var(--spacing-md);
    color: var(--accent);
  }
  
  .get-started ol {
    padding-left: var(--spacing-xl);
  }
  
  .get-started li {
    margin-bottom: var(--spacing-sm);
    color: var(--text-dark);
  }
  
  .modal-footer {
    display: flex;
    justify-content: center;
  }
  
  .primary-button {
    background-color: var(--primary);
    color: white;
    font-size: 1.2rem;
    padding: var(--spacing-sm) var(--spacing-xl);
    border-radius: var(--radius-md);
    cursor: pointer;
    border: none;
    transition: all var(--transition-fast) ease-in-out;
  }
  
  .primary-button:hover {
    background-color: var(--primary-dark);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
</style>