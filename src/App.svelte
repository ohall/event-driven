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
      { id: 'consumer-1', name: 'Consumer A', type: 'consumer', color: '#e74c3c', position: { x: 550, y: 100 }, group: 'group-1', partition: 0, active: false, processed: 0 },
      { id: 'consumer-2', name: 'Consumer B', type: 'consumer', color: '#e74c3c', position: { x: 550, y: 200 }, group: 'group-1', partition: 1, active: false, processed: 0 },
      { id: 'consumer-3', name: 'Consumer C', type: 'consumer', color: '#9b59b6', position: { x: 550, y: 300 }, group: 'group-2', partition: 0, active: false, processed: 0 }
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
      const newConsumer = {
        id: `consumer-${Date.now()}`,
        name: consumerName,
        type: 'consumer',
        color: consumerGroup === 'group-1' ? '#e74c3c' : '#9b59b6',
        position: { x: 550, y: 100 + (state.consumers.length * 80) % 400 },
        group: consumerGroup,
        partition: state.consumers.filter(c => c.group === consumerGroup).length % 3,
        active: false,
        processed: 0
      };
      
      state.consumers = [...state.consumers, newConsumer];
      consumerName = '';
      return state;
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
        status: 'in-topic',
        position: { ...producer.position }
      };
      
      // Activate producer animation
      producer.active = true;
      setTimeout(() => {
        systemStore.update(s => {
          const p = s.producers.find(p => p.id === producer.id);
          if (p) p.active = false;
          return s;
        });
      }, 500);
      
      // Add to messages
      state.messages = [...state.messages, newMessage];
      
      // Add to topic
      const topic = state.topics[0];
      topic.messages = [...topic.messages, messageId];
      
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
              // Consumer processes this message
              consumer.active = true;
              messages[messageIndex].status = 'processing';
              
              // Complete processing after delay
              setTimeout(() => {
                systemStore.update(s => {
                  const c = s.consumers.find(c => c.id === consumer.id);
                  if (c) {
                    c.active = false;
                    c.processed++;
                  }
                  
                  const msg = s.messages.find(m => m.id === messages[messageIndex].id);
                  if (msg) {
                    msg.status = 'consumed';
                  }
                  
                  return s;
                });
              }, 1000 + Math.random() * 2000);
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
          <line 
            x1={$systemStore.topics[0].position.x + 150} 
            y1={$systemStore.topics[0].position.y + 25 + consumer.partition * 40} 
            x2={consumer.position.x} 
            y2={consumer.position.y + 25} 
            stroke={consumer.group === 'group-1' ? 'rgba(231,76,60,0.3)' : 'rgba(155,89,182,0.3)'} 
            stroke-width="3"
            stroke-dasharray="5,5"
          />
        {/each}
        
        <!-- Draw messages -->
        {#each $systemStore.messages as message}
          {#if message.status === 'in-topic'}
            <!-- Message in the topic -->
            <circle 
              cx={$systemStore.topics[0].position.x + 75} 
              cy={$systemStore.topics[0].position.y + 25 + message.partition * 40} 
              r="6" 
              fill="#f1c40f"
            />
          {:else if message.status === 'processing'}
            <!-- Message being processed - animate from topic to consumer -->
            {@const consumer = $systemStore.consumers.find(c => c.partition === message.partition && c.active)}
            {#if consumer}
              <circle 
                cx={$systemStore.topics[0].position.x + 75 + ((consumer.position.x - $systemStore.topics[0].position.x - 75) * 0.7)} 
                cy={$systemStore.topics[0].position.y + 25 + message.partition * 40 + ((consumer.position.y - $systemStore.topics[0].position.y - 25 - message.partition * 40) * 0.7)} 
                r="6" 
                fill={consumer.color}
              />
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
            <rect width="150" height="50" rx="10" fill={consumer.color} class:active={consumer.active} />
            <text x="75" y="25" text-anchor="middle" fill="white" font-size="14px">{consumer.name}</text>
            <text x="75" y="40" text-anchor="middle" fill="white" font-size="12px">
              Group: {consumer.group}, Part: {consumer.partition}
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
    margin-bottom: 10px;
  }
  
  .tabs {
    display: flex;
    gap: 5px;
    margin-bottom: 15px;
  }
  
  .tabs button {
    background-color: var(--background-light);
    color: var(--text);
    border: none;
    padding: 8px 16px;
    border-radius: 5px 5px 0 0;
    cursor: pointer;
  }
  
  .tabs button.active {
    background-color: var(--primary);
  }
  
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    background-color: var(--background-light);
    border-radius: 5px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .visualization {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  
  .canvas {
    width: 100%;
    height: 100%;
    min-height: 400px;
  }
  
  rect.active {
    filter: brightness(1.2);
    stroke: white;
    stroke-width: 2px;
  }
  
  .controls-panel, .metrics-panel {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow-y: auto;
    height: 100%;
  }
  
  .control-section, .metrics-section {
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
  
  .info-panel {
    margin-top: 20px;
    padding: 15px;
    background-color: var(--background-light);
    border-radius: 5px;
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
  
  .group-metrics {
    margin-top: 15px;
    padding: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  
  h2, h3, h4 {
    margin-top: 0;
    color: var(--accent);
  }
  
  h4 {
    margin-bottom: 10px;
  }
</style>