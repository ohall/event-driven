<script>
  import { onMount } from 'svelte';
  import './app.css';
  
  // Import components
  import Canvas from './components/Canvas.svelte';
  
  onMount(() => {
    // Initialize any animations or libraries here
  });
</script>

<div class="app">
  <h1>Event-Driven Architecture Explorer</h1>
  <main>
    <Canvas />
  </main>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
    padding: 20px;
  }
  
  h1 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
</style>