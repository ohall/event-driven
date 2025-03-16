<script>
  import { onMount } from 'svelte';
  
  let canvas;
  
  onMount(() => {
    const ctx = canvas.getContext('2d');
    
    // Draw a simple event-driven architecture diagram
    function draw() {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Set canvas dimensions
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      
      // Draw emitter
      ctx.fillStyle = '#2980b9';
      ctx.beginPath();
      ctx.roundRect(100, 150, 150, 80, 10);
      ctx.fill();
      
      // Draw emitter text
      ctx.fillStyle = 'white';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Event Emitter', 175, 180);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('(User Input)', 175, 200);
      
      // Draw queue
      ctx.fillStyle = '#f1c40f';
      ctx.beginPath();
      ctx.roundRect(350, 150, 150, 80, 10);
      ctx.fill();
      
      // Draw queue text
      ctx.fillStyle = '#34495e';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Event Queue', 425, 180);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('(4 events)', 425, 200);
      
      // Draw handler
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.roundRect(600, 150, 150, 80, 10);
      ctx.fill();
      
      // Draw handler text
      ctx.fillStyle = 'white';
      ctx.font = '16px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Event Handler', 675, 180);
      ctx.font = '14px Inter, sans-serif';
      ctx.fillText('(UI Update)', 675, 200);
      
      // Draw arrows
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 3;
      
      // Emitter to Queue
      ctx.beginPath();
      ctx.moveTo(250, 190);
      ctx.lineTo(350, 190);
      drawArrow(ctx, 350, 190, 10);
      ctx.stroke();
      
      // Queue to Handler
      ctx.beginPath();
      ctx.moveTo(500, 190);
      ctx.lineTo(600, 190);
      drawArrow(ctx, 600, 190, 10);
      ctx.stroke();
      
      // Draw event particle
      const time = Date.now() / 1000;
      const position = time % 6; // 0-6 range
      
      if (position < 3) {
        // Event traveling from emitter to queue
        const x = 250 + position * 33.3;
        ctx.fillStyle = '#2980b9';
        ctx.beginPath();
        ctx.arc(x, 190, 8, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Event traveling from queue to handler
        const x = 500 + (position - 3) * 33.3;
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(x, 190, 8, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Request next frame
      requestAnimationFrame(draw);
    }
    
    // Helper function to draw arrow
    function drawArrow(ctx, x, y, size) {
      ctx.lineTo(x - size, y - size);
      ctx.moveTo(x, y);
      ctx.lineTo(x - size, y + size);
    }
    
    // Start animation
    draw();
  });
</script>

<div class="canvas-container">
  <canvas bind:this={canvas} class="canvas">
    Your browser does not support the canvas element.
  </canvas>
  
  <div class="info-panel">
    <h2>Event-Driven Architecture</h2>
    <p>
      In this model, components communicate through events:
    </p>
    <ul>
      <li><strong>Event Emitters</strong> produce events when something happens</li>
      <li><strong>Event Queues</strong> store and forward events</li>
      <li><strong>Event Handlers</strong> subscribe to and process specific events</li>
    </ul>
    <p>
      This decoupled architecture allows for scalable, responsive systems.
    </p>
  </div>
</div>

<style>
  .canvas-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    background-color: var(--background);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }
  
  .canvas {
    flex: 1;
    width: 100%;
    height: 100%;
  }
  
  .info-panel {
    background-color: var(--background-light);
    padding: var(--spacing-lg);
    color: var(--text);
  }
  
  h2 {
    color: var(--primary);
    margin-top: 0;
    font-size: 1.5rem;
  }
  
  ul {
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.5rem;
  }
  
  strong {
    color: var(--accent);
  }
</style>