<script>
  import { onMount } from 'svelte';
  import './app.css';
  import { writable } from 'svelte/store';
  
  // System state store
  const systemStore = writable({
    producers: [
      { id: 'producer-1', name: 'Producer 1', type: 'producer', color: '#2980b9', position: { x: 50, y: 100 }, active: false }
    ],
    topics: [
      { id: 'topic-1', name: 'Events Topic', type: 'topic', color: '#f1c40f', position: { x: 300, y: 200 }, messages: [], partitions: 3 }
    ],
    consumers: [
      // Group 1 (red) - organized by partition
      { id: 'consumer-1', name: 'Consumer A', type: 'consumer', color: '#e74c3c', position: { x: 550, y: 100 }, group: 'group-1', partition: 0, active: false, processed: 0 },
      { id: 'consumer-2', name: 'Consumer B', type: 'consumer', color: '#e74c3c', position: { x: 750, y: 100 }, group: 'group-1', partition: 1, active: false, processed: 0 },
      // Group 2 (purple) - organized by partition
      { id: 'consumer-3', name: 'Consumer C', type: 'consumer', color: '#9b59b6', position: { x: 550, y: 350 }, group: 'group-2', partition: 0, active: false, processed: 0 }
    ],
    messages: [],
    nextMessageId: 1
  });
  
  // UI state
  let selectedTab = 'visualization';
  let producerName = '';
  let consumerName = '';
  let consumerGroup = 'group-1';
  let messageContent = 'New event data';
  let selectedProducerId = 'producer-1';
  
  // Add a new producer
  function addProducer() {
    if (!producerName.trim()) return;
    
    systemStore.update(state => {
      const newProducer = {
        id: `producer-${Date.now()}`,
        name: producerName,
        type: 'producer',
        color: '#2980b9',
        position: { x: 50, y: 100 + (state.producers.length * 100) % 300 },
        active: false
      };
      
      state.producers = [...state.producers, newProducer];
      producerName = '';
      return state;
    });
  }
  
  // Add a new consumer
  function addConsumer() {
    if (!consumerName.trim()) return;
    
    systemStore.update(state => {
      // Get current consumers in this group by partition
      const partitionConsumers = {};
      const groupConsumers = state.consumers.filter(c => c.group === consumerGroup);
      
      // Count how many consumers are in each partition for this group
      groupConsumers.forEach(c => {
        if (!partitionConsumers[c.partition]) {
          partitionConsumers[c.partition] = [];
        }
        partitionConsumers[c.partition].push(c);
      });
      
      // Assign to least populated partition
      let partitionCounts = [0, 1, 2].map(p => (partitionConsumers[p] || []).length);
      let partition = partitionCounts.indexOf(Math.min(...partitionCounts));
      
      // Create new consumer
      const newConsumer = {
        id: `consumer-${Date.now()}`,
        name: consumerName,
        type: 'consumer',
        color: consumerGroup === 'group-1' ? '#e74c3c' : '#9b59b6',
        group: consumerGroup,
        partition: partition,
        active: false,
        processed: 0
      };
      
      // Add to list of consumers
      const newConsumers = [...state.consumers, newConsumer];
      
      // Position ALL consumers to avoid overlap
      const consumerWidth = 140; // Width of consumer element
      const consumerHeight = 45; // Height of consumer element
      const spacingX = 200; // Width of consumer + padding
      const spacingY = 100; // Height of consumer + padding (increased significantly)
      
      // Group and partition all consumers for positioning
      const consumersByGroup = {
        'group-1': [0, 1, 2].map(p => newConsumers.filter(c => c.group === 'group-1' && c.partition === p)),
        'group-2': [0, 1, 2].map(p => newConsumers.filter(c => c.group === 'group-2' && c.partition === p))
      };
      
      // Position each consumer
      newConsumers.forEach(consumer => {
        const groupIndex = consumer.group === 'group-1' ? 0 : 1;
        const partitionConsumers = consumersByGroup[consumer.group][consumer.partition];
        const consumerIndex = partitionConsumers.indexOf(consumer);
        
        // Base position for this partition
        const baseX = 550 + (consumer.partition * spacingX);
        const baseY = 100 + (groupIndex * 250); // Group 1 at y=100, Group 2 at y=350 (much larger spacing)
        
        // Position with offset based on index within partition
        consumer.position = {
          x: baseX,
          y: baseY + (consumerIndex * spacingY)
        };
      });
      
      // Update state
      consumerName = '';
      return {
        ...state,
        consumers: newConsumers
      };
    });
  }
  
  // Produce a message
  function produceMessage() {
    systemStore.update(state => {
      const producer = state.producers.find(p => p.id === selectedProducerId);
      if (!producer) return state;
      
      // Create new message
      const messageId = `msg-${state.nextMessageId++}`;
      const partition = Math.floor(Math.random() * 3); // Random partition 0-2
      
      const newMessage = {
        id: messageId,
        producer: producer.id,
        content: messageContent,
        timestamp: Date.now(),
        partition: partition,
        status: 'producing', // Start with producing status for animation
        animationProgress: 0,
        pulse: 0
      };
      
      // Activate producer animation
      producer.active = true;
      
      // Add to messages
      state.messages = [...state.messages, newMessage];
      
      // Animate the message moving from producer to topic
      let progress = 0;
      const animationDuration = 800; // ms
      const startTime = Date.now();
      
      const animationInterval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / animationDuration, 1);
        
        systemStore.update(s => {
          const msg = s.messages.find(m => m.id === messageId);
          if (msg) {
            msg.animationProgress = progress;
            // Add a pulsing effect
            msg.pulse = Math.sin(elapsed / 100) * 1.5;
          }
          return s;
        });
        
        // When animation completes
        if (progress >= 1) {
          clearInterval(animationInterval);
          
          // Update the message to be in the topic
          systemStore.update(s => {
            const p = s.producers.find(p => p.id === producer.id);
            if (p) p.active = false;
            
            const msg = s.messages.find(m => m.id === messageId);
            if (msg) {
              msg.status = 'in-topic';
            }
            
            const topic = s.topics[0];
            topic.messages = [...topic.messages, messageId];
            
            return s;
          });
        }
      }, 16); // ~60fps update
      
      return state;
    });
  }
  
  // Process messages
  function processMessages() {
    const intervalId = setInterval(() => {
      systemStore.update(state => {
        const topic = state.topics[0];
        const messages = [...state.messages];
        
        // For each consumer, find a message in their partition
        state.consumers.forEach(consumer => {
          if (!consumer.active) {
            const messageIndex = messages.findIndex(m => 
              m.status === 'in-topic' && 
              m.partition === consumer.partition
            );
            
            if (messageIndex !== -1) {
              // Create a copy of the message for this consumer group
              const message = messages[messageIndex];
              
              // Consumer processes this message
              const messageId = message.id;
              const consumerGroupInstanceId = `${messageId}-${consumer.group}`;
              
              // Mark consumer as active
              consumer.active = true;
              
              // Create a processing/animation state for this consumer
              const processingMessage = {
                id: consumerGroupInstanceId,
                originalId: messageId,
                producer: message.producer,
                content: message.content,
                timestamp: message.timestamp,
                partition: message.partition,
                status: 'processing',
                group: consumer.group,
                consumerId: consumer.id,
                animationProgress: 0,
                pulse: 0
              };
              
              // Add to messages list
              messages.push(processingMessage);
              
              // Start animation
              let progress = 0;
              const animationDuration = 1500; // ms
              const startTime = Date.now();
              
              const animationInterval = setInterval(() => {
                const elapsed = Date.now() - startTime;
                progress = Math.min(elapsed / animationDuration, 1);
                
                systemStore.update(s => {
                  const msg = s.messages.find(m => m.id === consumerGroupInstanceId);
                  if (msg) {
                    msg.animationProgress = progress;
                    msg.pulse = Math.sin(elapsed / 100) * 1.5;
                  }
                  return s;
                });
                
                // When animation completes
                if (progress >= 1) {
                  clearInterval(animationInterval);
                  
                  // After a short delay, complete the processing
                  setTimeout(() => {
                    systemStore.update(s => {
                      // Find this consumer
                      const c = s.consumers.find(c => c.id === consumer.id);
                      if (c) {
                        c.active = false;
                        c.processed++;
                      }
                      
                      // Find the processing message instance
                      const processingMsg = s.messages.find(m => m.id === consumerGroupInstanceId);
                      if (processingMsg) {
                        processingMsg.status = 'consumed';
                      }
                      
                      // Track which groups have processed this message
                      const originalMessage = s.messages.find(m => m.id === messageId);
                      if (originalMessage) {
                        // Initialize processed groups if not yet set
                        if (!originalMessage.processedGroups) {
                          originalMessage.processedGroups = [];
                        }
                        
                        // Add this group to processed groups if not already there
                        if (!originalMessage.processedGroups.includes(consumer.group)) {
                          originalMessage.processedGroups.push(consumer.group);
                        }
                        
                        // Check if all consumer groups have processed this message
                        const allGroups = [...new Set(s.consumers.map(c => c.group))];
                        const allProcessed = allGroups.every(group => 
                          originalMessage.processedGroups.includes(group)
                        );
                        
                        // If all groups have processed, mark as fully consumed
                        if (allProcessed) {
                          originalMessage.status = 'consumed';
                        }
                      }
                      
                      return s;
                    });
                  }, 500); // Short processing time after animation
                }
              }, 16); // ~60fps update
            }
          }
        });
        
        return {
          ...state,
          messages
        };
      });
    }, 1000);
    
    return () => clearInterval(intervalId);
  }
  
  onMount(() => {
    // Start message processing
    const cleanup = processMessages();
    
    return () => {
      cleanup();
    };
  });
</script>

<div class="app">
  <h1>Event-Driven Messaging System</h1>
  
  <div class="container">
    <!-- Left side: Controls -->
    <div class="control-panel">
      <div class="control-section">
        <h2>Add Producer</h2>
        <div class="form-group">
          <label for="producer-name">Producer Name:</label>
          <input type="text" id="producer-name" bind:value={producerName} placeholder="Enter producer name">
          <button on:click={addProducer}>Add Producer</button>
        </div>
      </div>
      
      <div class="control-section">
        <h2>Add Consumer</h2>
        <div class="form-group">
          <label for="consumer-name">Consumer Name:</label>
          <input type="text" id="consumer-name" bind:value={consumerName} placeholder="Enter consumer name">
          
          <label for="consumer-group">Consumer Group:</label>
          <select id="consumer-group" bind:value={consumerGroup}>
            <option value="group-1">Group 1 (Red)</option>
            <option value="group-2">Group 2 (Purple)</option>
          </select>
          
          <button on:click={addConsumer}>Add Consumer</button>
        </div>
      </div>
      
      <div class="control-section">
        <h2>Produce Message</h2>
        <div class="form-group">
          <label for="producer-select">Select Producer:</label>
          <select id="producer-select" bind:value={selectedProducerId}>
            {#each $systemStore.producers as producer}
              <option value={producer.id}>{producer.name}</option>
            {/each}
          </select>
          
          <label for="message-content">Message Content:</label>
          <input type="text" id="message-content" bind:value={messageContent} placeholder="Enter message content">
          
          <button on:click={produceMessage}>Send Message</button>
        </div>
      </div>
      
      <!-- Simple metrics -->
      <div class="control-section">
        <h2>Message Stats</h2>
        <div class="metrics-summary">
          <div class="metric-item">
            <span>Messages in Topic:</span>
            <span class="metric-value">{$systemStore.messages.filter(m => m.status === 'in-topic').length}</span>
          </div>
          <div class="metric-item">
            <span>Messages Processed:</span>
            <span class="metric-value">{$systemStore.messages.filter(m => m.status === 'consumed').length}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Right side: Visualization -->
    <div class="visualization">
      <svg class="canvas" width="100%" height="100%">
        <!-- Draw connections -->
        {#each $systemStore.producers as producer}
          <line 
            x1={producer.position.x + 75} 
            y1={producer.position.y + 25} 
            x2={$systemStore.topics[0].position.x} 
            y2={$systemStore.topics[0].position.y + 25} 
            stroke="rgba(255,255,255,0.3)" 
            stroke-width="3"
            stroke-dasharray="5,5"
          />
        {/each}
        
        {#each $systemStore.consumers as consumer}
          <path 
            d={`M${$systemStore.topics[0].position.x + 150} ${$systemStore.topics[0].position.y + 25 + consumer.partition * 40} 
                C${$systemStore.topics[0].position.x + 250} ${$systemStore.topics[0].position.y + 25 + consumer.partition * 40},
                ${consumer.position.x - 100} ${consumer.position.y + 25},
                ${consumer.position.x} ${consumer.position.y + 25}`}
            stroke={consumer.group === 'group-1' ? 'rgba(231,76,60,0.4)' : 'rgba(155,89,182,0.4)'} 
            stroke-width="2"
            stroke-dasharray="5,5"
            fill="none"
          />
        {/each}
        
        <!-- Draw messages -->
        {#each $systemStore.messages as message}
          {#if message.status === 'producing'}
            <!-- Message being produced - animate from producer to topic -->
            {@const producer = $systemStore.producers.find(p => p.id === message.producer)}
            {#if producer && message.animationProgress !== undefined}
              <!-- Calculate position along the path -->
              {@const startX = producer.position.x + 75}
              {@const startY = producer.position.y + 25}
              {@const endX = $systemStore.topics[0].position.x}
              {@const endY = $systemStore.topics[0].position.y + 25}
              {@const progress = message.animationProgress || 0}
              {@const posX = startX + (endX - startX) * progress}
              {@const posY = startY + (endY - startY) * progress}
              
              <circle 
                cx={posX}
                cy={posY}
                r={6 + (message.pulse || 0)}
                fill="#2980b9"
              />
            {/if}
          {:else if message.status === 'in-topic'}
            <!-- Message in the topic -->
            <circle 
              cx={$systemStore.topics[0].position.x + 75} 
              cy={$systemStore.topics[0].position.y + 25 + message.partition * 40} 
              r="6" 
              fill="#f1c40f"
            />
          {:else if message.status === 'processing'}
            <!-- Message being processed - calculate position along curved path -->
            {@const consumer = $systemStore.consumers.find(c => c.id === message.consumerId)}
            {#if consumer && message.animationProgress !== undefined}
              <!-- Calculate position along the curved Bezier path -->
              {@const startX = $systemStore.topics[0].position.x + 150}
              {@const startY = $systemStore.topics[0].position.y + 25 + message.partition * 40}
              {@const cp1x = $systemStore.topics[0].position.x + 250}
              {@const cp1y = $systemStore.topics[0].position.y + 25 + message.partition * 40}
              {@const cp2x = consumer.position.x - 100}
              {@const cp2y = consumer.position.y + 25}
              {@const endX = consumer.position.x}
              {@const endY = consumer.position.y + 25}
              {@const progress = message.animationProgress || 0}
              
              <!-- Cubic Bezier position calculation -->
              {@const t = progress}
              {@const mt = 1 - t}
              {@const posX = mt*mt*mt*startX + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*endX}
              {@const posY = mt*mt*mt*startY + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY}
              
              <circle 
                cx={posX}
                cy={posY}
                r={6 + (message.pulse || 0)}
                fill={consumer.color}
              />
              
              <!-- Highlight active consumer -->
              {#if progress > 0.7}
                <rect 
                  x={consumer.position.x}
                  y={consumer.position.y}
                  width="140"
                  height="45"
                  rx="8"
                  fill="none" 
                  stroke="white"
                  stroke-width="3"
                  opacity={0.5 + Math.sin(Date.now() / 200) * 0.3}
                />
              {/if}
            {/if}
          {/if}
        {/each}
        
        <!-- Draw producers -->
        {#each $systemStore.producers as producer}
          <g transform={`translate(${producer.position.x}, ${producer.position.y})`}>
            <rect width="150" height="50" rx="10" fill={producer.color} class:active={producer.active} />
            <text x="75" y="30" text-anchor="middle" fill="white" font-size="14px">{producer.name}</text>
          </g>
        {/each}
        
        <!-- Draw topic with partitions -->
        <g transform={`translate(${$systemStore.topics[0].position.x}, ${$systemStore.topics[0].position.y})`}>
          <rect width="150" height="150" rx="10" fill={$systemStore.topics[0].color} />
          <text x="75" y="30" text-anchor="middle" fill="#333" font-size="16px" font-weight="bold">{$systemStore.topics[0].name}</text>
          
          <!-- Partitions -->
          <rect x="10" y="45" width="130" height="30" rx="5" fill="rgba(0,0,0,0.1)" />
          <text x="20" y="65" fill="#333" font-size="12px">Partition 0</text>
          <text x="120" y="65" text-anchor="end" fill="#333" font-size="12px">
            {$systemStore.messages.filter(m => m.status === 'in-topic' && m.partition === 0).length}
          </text>
          
          <rect x="10" y="85" width="130" height="30" rx="5" fill="rgba(0,0,0,0.1)" />
          <text x="20" y="105" fill="#333" font-size="12px">Partition 1</text>
          <text x="120" y="105" text-anchor="end" fill="#333" font-size="12px">
            {$systemStore.messages.filter(m => m.status === 'in-topic' && m.partition === 1).length}
          </text>
          
          <rect x="10" y="125" width="130" height="30" rx="5" fill="rgba(0,0,0,0.1)" />
          <text x="20" y="145" fill="#333" font-size="12px">Partition 2</text>
          <text x="120" y="145" text-anchor="end" fill="#333" font-size="12px">
            {$systemStore.messages.filter(m => m.status === 'in-topic' && m.partition === 2).length}
          </text>
        </g>
        
        <!-- Draw consumers -->
        {#each $systemStore.consumers as consumer}
          <g transform={`translate(${consumer.position.x}, ${consumer.position.y})`}>
            <rect width="140" height="45" rx="8" fill={consumer.color} class:active={consumer.active} />
            <text x="70" y="20" text-anchor="middle" fill="white" font-size="13px">{consumer.name}</text>
            <text x="70" y="36" text-anchor="middle" fill="white" font-size="11px">
              Group: {consumer.group.split('-')[1]}, Part: {consumer.partition}
            </text>
          </g>
        {/each}
      </svg>
    </div>
  </div>
  
  <div class="info-panel">
    <h3>About Consumer Groups</h3>
    <p>
      In event-driven systems like Kafka, <strong>consumer groups</strong> allow messages to be processed in parallel while ensuring each message is only processed once per group.
    </p>
    <ul>
      <li><strong>Group 1 (Red)</strong>: Consumers in the same group each read from different partitions</li>
      <li><strong>Group 2 (Purple)</strong>: A separate consumer group that reads the same messages independently</li>
    </ul>
    <p>
      This enables both parallel processing and multiple processing paths for the same data stream.
    </p>
  </div>
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
    margin-bottom: 15px;
  }
  
  .container {
    display: flex;
    flex: 1;
    gap: 20px;
    height: 70vh;
    min-height: 500px;
  }
  
  /* Controls panel */
  .control-panel {
    width: 300px;
    min-width: 280px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    overflow-y: auto;
    background-color: var(--background-light);
    border-radius: 5px;
    padding: 15px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .control-section {
    background-color: var(--background);
    padding: 15px;
    border-radius: 5px;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }
  
  input, select {
    padding: 8px;
    border-radius: 4px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    background-color: rgba(255, 255, 255, 0.1);
    color: var(--text);
  }
  
  button {
    background-color: var(--primary);
    color: white;
    border: none;
    padding: 8px 15px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    transition: background-color 0.2s;
  }
  
  button:hover {
    background-color: var(--primary-dark);
  }
  
  /* Visualization */
  .visualization {
    flex: 1;
    position: relative;
    overflow: hidden;
    background-color: var(--background-light);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .canvas {
    width: 100%;
    height: 100%;
  }
  
  rect.active {
    filter: brightness(1.2);
    stroke: white;
    stroke-width: 2px;
  }
  
  /* Info panel */
  .info-panel {
    margin-top: 20px;
    padding: 15px;
    background-color: var(--background-light);
    border-radius: 5px;
  }
  
  /* Metrics */
  .metrics-summary {
    margin-top: 5px;
  }
  
  .metric-item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  .metric-value {
    font-weight: bold;
    color: var(--accent);
  }
  
  h2, h3, h4 {
    margin-top: 0;
    color: var(--accent);
    margin-bottom: 10px;
  }

  /* Responsive adjustment for smaller screens */
  @media (max-width: 800px) {
    .container {
      flex-direction: column;
      height: auto;
    }
    
    .control-panel {
      width: 100%;
      order: 2;
    }
    
    .visualization {
      min-height: 400px;
      order: 1;
    }
  }
</style>