<script>
  import { onMount } from 'svelte';
  import { eventStore } from '../stores/eventStore';
  import { pannable } from '../lib/pannable';
  import EventEmitterNode from './EventEmitterNode.svelte';
  import EventHandlerNode from './EventHandlerNode.svelte';
  import EventQueueNode from './EventQueueNode.svelte';
  import ConnectionLine from './ConnectionLine.svelte';
  import EventParticle from './EventParticle.svelte';
  
  let canvas;
  let canvasWidth = 0;
  let canvasHeight = 0;
  let isDragging = false;
  let connectMode = false;
  let connectFrom = null;
  let connectType = null;
  let mouseX = 0;
  let mouseY = 0;
  
  function handleMouseMove(event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  function handleNodeSelect(id, type) {
    if (connectMode) {
      if (!connectFrom) {
        connectFrom = id;
        connectType = type;
      } else {
        // Create a connection
        if (connectFrom !== id) {
          let connectionType;
          
          if (connectType === 'emitter' && type === 'queue') {
            connectionType = 'queue';
          } else if (connectType === 'queue' && type === 'handler') {
            connectionType = 'handler';
          } else {
            // Invalid connection
            alert('Invalid connection! Emitters can connect to Queues, and Queues can connect to Handlers.');
            connectFrom = null;
            connectType = null;
            return;
          }
          
          eventStore.connect(connectFrom, id, connectionType);
          
          // Reset connect mode
          connectFrom = null;
          connectType = null;
        }
      }
    }
  }
  
  function startConnectMode() {
    connectMode = true;
    connectFrom = null;
    connectType = null;
  }
  
  function cancelConnectMode() {
    connectMode = false;
    connectFrom = null;
    connectType = null;
  }
  
  onMount(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        canvasWidth = entry.contentRect.width;
        canvasHeight = entry.contentRect.height;
      }
    });
    
    resizeObserver.observe(canvas);
    
    return () => {
      resizeObserver.disconnect();
    };
  });
</script>

<div 
  class="canvas" 
  bind:this={canvas}
  class:connect-mode={connectMode}
  on:mousemove={handleMouseMove}
  role="application"
  aria-label="Event-driven architecture interactive canvas"
>
  <div class="grid-background"></div>
  
  {#if connectMode}
    <div class="connect-mode-overlay">
      <div class="connect-mode-message">
        Click on a component to start a connection, then click on another component to complete the connection.
        <button on:click={cancelConnectMode}>Cancel</button>
      </div>
      
      {#if connectFrom}
        <div 
          class="temp-connection-line"
          style="
            left: {$eventStore.emitters[connectFrom]?.position.x || 
                  $eventStore.handlers[connectFrom]?.position.x || 
                  $eventStore.queues[connectFrom]?.position.x || 0}px; 
            top: {$eventStore.emitters[connectFrom]?.position.y || 
                 $eventStore.handlers[connectFrom]?.position.y || 
                 $eventStore.queues[connectFrom]?.position.y || 0}px;
            width: {Math.hypot(
              mouseX - (
                $eventStore.emitters[connectFrom]?.position.x || 
                $eventStore.handlers[connectFrom]?.position.x || 
                $eventStore.queues[connectFrom]?.position.x || 0
              ), 
              mouseY - (
                $eventStore.emitters[connectFrom]?.position.y || 
                $eventStore.handlers[connectFrom]?.position.y || 
                $eventStore.queues[connectFrom]?.position.y || 0
              )
            )}px;
            transform: rotate(${Math.atan2(
              mouseY - (
                $eventStore.emitters[connectFrom]?.position.y || 
                $eventStore.handlers[connectFrom]?.position.y || 
                $eventStore.queues[connectFrom]?.position.y || 0
              ),
              mouseX - (
                $eventStore.emitters[connectFrom]?.position.x || 
                $eventStore.handlers[connectFrom]?.position.x || 
                $eventStore.queues[connectFrom]?.position.x || 0
              )
            )}rad);
          "
        ></div>
      {/if}
    </div>
  {/if}
  
  <!-- Connection Lines -->
  {#each $eventStore.connections as connection}
    <ConnectionLine {connection} />
  {/each}
  
  <!-- Event Particles (Active Events) -->
  {#each $eventStore.activeEvents as event (event.id)}
    <EventParticle {event} />
  {/each}
  
  <!-- Event Emitters -->
  {#each $eventStore.emitters as emitter (emitter.id)}
    <EventEmitterNode 
      {emitter} 
      on:select={() => handleNodeSelect(emitter.id, 'emitter')}
    />
  {/each}
  
  <!-- Event Queues -->
  {#each $eventStore.queues as queue (queue.id)}
    <EventQueueNode 
      {queue}
      on:select={() => handleNodeSelect(queue.id, 'queue')}
    />
  {/each}
  
  <!-- Event Handlers -->
  {#each $eventStore.handlers as handler (handler.id)}
    <EventHandlerNode 
      {handler}
      on:select={() => handleNodeSelect(handler.id, 'handler')}
    />
  {/each}
  
  <!-- Connect Button -->
  <button class="connect-button" on:click={startConnectMode} disabled={connectMode}>
    Connect Components
  </button>
</div>

<style>
  .canvas {
    flex: 1;
    overflow: hidden;
    position: relative;
    background-color: var(--background);
  }
  
  .connect-mode-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.2);
    pointer-events: none;
    z-index: 50;
  }
  
  .connect-mode-message {
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--background-light);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    pointer-events: all;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  .temp-connection-line {
    position: absolute;
    height: 3px;
    background-color: var(--primary);
    transform-origin: 0 0;
    z-index: 1;
    box-shadow: 0 0 5px rgba(41, 128, 185, 0.5);
  }
  
  .connect-button {
    position: absolute;
    bottom: 20px;
    left: 20px;
    background-color: var(--primary);
    color: var(--text);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-md);
    cursor: pointer;
    z-index: 20;
  }
  
  .connect-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>