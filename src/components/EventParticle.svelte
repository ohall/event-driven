<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import gsap from 'gsap';
  import type { EventData } from '../stores/eventStore';
  import { eventStore } from '../stores/eventStore';
  
  // Props
  export let event: EventData;
  
  // State
  let particleElement: HTMLDivElement;
  let timeline: gsap.core.Timeline;
  
  // Helper to get node position by ID
  function getNodePosition(id: string) {
    // Find the node in one of our stores
    const emitter = $eventStore.emitters.find(e => e.id === id);
    if (emitter) {
      return { x: emitter.position.x + 75, y: emitter.position.y + 25 };
    }
    
    const handler = $eventStore.handlers.find(h => h.id === id);
    if (handler) {
      return { x: handler.position.x + 75, y: handler.position.y + 25 };
    }
    
    const queue = $eventStore.queues.find(q => q.id === id);
    if (queue) {
      return { x: queue.position.x + 75, y: queue.position.y + 25 };
    }
    
    return { x: 0, y: 0 };
  }
  
  // Animate the particle along the event path
  function animateParticle() {
    // Get source position
    const sourcePosition = getNodePosition(event.source);
    
    // Set initial position
    gsap.set(particleElement, {
      x: sourcePosition.x,
      y: sourcePosition.y,
      opacity: 0,
      scale: 0
    });
    
    // Create animation timeline
    timeline = gsap.timeline();
    
    // Fade in and scale up
    timeline.to(particleElement, {
      duration: 0.3,
      opacity: 1,
      scale: 1,
      ease: "back.out(1.7)"
    });
    
    // Find the queue connected to this emitter
    const queueConnection = $eventStore.connections.find(
      conn => conn.from === event.source && conn.type === 'queue'
    );
    
    if (queueConnection) {
      const queuePosition = getNodePosition(queueConnection.to);
      
      // Move to queue
      timeline.to(particleElement, {
        duration: 0.6,
        x: queuePosition.x,
        y: queuePosition.y,
        ease: "power2.inOut"
      });
      
      // Pause in queue (random wait time to simulate processing)
      timeline.to(particleElement, {
        duration: 0.5 + Math.random() * 1.5,
        scale: 0.8,
        backgroundColor: "var(--accent)",
        ease: "none"
      });
      
      // For each target handler, animate to it
      event.targetHandlers.forEach(handlerId => {
        const handlerPosition = getNodePosition(handlerId);
        
        // Move to handler
        timeline.to(particleElement, {
          duration: 0.6,
          x: handlerPosition.x,
          y: handlerPosition.y,
          scale: 1,
          backgroundColor: "var(--secondary)",
          ease: "power2.inOut"
        });
        
        // Pulse at handler
        timeline.to(particleElement, {
          duration: 0.4,
          scale: 1.5,
          ease: "power2.in"
        });
        
        // Fade out
        timeline.to(particleElement, {
          duration: 0.2,
          opacity: 0,
          scale: 0,
          ease: "power2.out"
        });
      });
    } else {
      // No queue, fade out
      timeline.to(particleElement, {
        duration: 0.5,
        opacity: 0,
        scale: 0,
        delay: 0.5,
        ease: "power2.out"
      });
    }
  }
  
  onMount(() => {
    animateParticle();
  });
  
  onDestroy(() => {
    if (timeline) {
      timeline.kill();
    }
  });
</script>

<div 
  class="event-particle" 
  class:pending={event.status === 'pending'} 
  class:processing={event.status === 'processing'} 
  class:completed={event.status === 'completed'} 
  class:failed={event.status === 'failed'} 
  bind:this={particleElement}
>
  <div class="event-tooltip">
    <div class="event-type">{event.type}</div>
    <div class="event-status">{event.status}</div>
  </div>
</div>

<style>
  .event-particle {
    position: absolute;
    width: 12px;
    height: 12px;
    border-radius: var(--radius-round);
    background-color: var(--primary);
    z-index: 5;
    pointer-events: all;
    cursor: pointer;
  }
  
  .event-particle.pending {
    background-color: var(--primary);
  }
  
  .event-particle.processing {
    background-color: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }
  
  .event-particle.completed {
    background-color: var(--success);
  }
  
  .event-particle.failed {
    background-color: var(--danger);
  }
  
  .event-tooltip {
    position: absolute;
    visibility: hidden;
    opacity: 0;
    top: -40px;
    left: 50%;
    transform: translateX(-50%);
    background-color: var(--neutral);
    color: var(--text);
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-md);
    font-size: 0.75rem;
    white-space: nowrap;
    transition: all var(--transition-fast) ease-in-out;
    z-index: 100;
    pointer-events: none;
  }
  
  .event-particle:hover .event-tooltip {
    visibility: visible;
    opacity: 1;
  }
  
  .event-type {
    font-weight: 600;
  }
  
  .event-status {
    font-size: 0.7rem;
    opacity: 0.8;
  }
</style>