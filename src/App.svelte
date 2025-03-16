<script lang="ts">
  import { onMount } from 'svelte';
  import './app.css';
  
  // Import components
  import Header from './components/Header.svelte';
  import Canvas from './components/Canvas.svelte';
  import InfoPanel from './components/InfoPanel.svelte';
  import Toolbar from './components/Toolbar.svelte';
  import IntroModal from './components/IntroModal.svelte';
  
  // Import stores
  import { gameStore } from './stores/gameStore';
  
  let showIntro = true;
  
  function closeIntro() {
    showIntro = false;
  }
  
  onMount(() => {
    // Initialize any animations or libraries here
  });
</script>

<div class="app">
  <Header />
  
  <main>
    <Toolbar />
    <Canvas />
    <InfoPanel />
  </main>
  
  {#if showIntro}
    <IntroModal on:close={closeIntro} />
  {/if}
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }
</style>