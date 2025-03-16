# Event-Driven Architecture Visualizer

A web application for exploring and learning about event-driven architecture through interactive visualization and simulation.

🚀 **[Live Demo](https://ohall.github.io/event-driven/)**

## Features

- **Interactive Canvas**: Drag and drop components to design your event flow
- **Component Types**:
  - Event Emitters: Generate events (e.g., user input, system timers)
  - Event Queues: Buffer and manage event flow
  - Event Handlers: Process specific types of events
- **Real-time Simulation**: Watch events flow through your system
- **Visual Connections**: Create and visualize relationships between components
- **Configurable Properties**: Customize processing times, queue sizes, and event types

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ohall/event-driven.git
cd event-driven
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm run dev
# or
yarn dev
```

4. Access the application:
   - Development: Open your browser and navigate to `http://localhost:5173`
   - Production: Visit [https://ohall.github.io/event-driven/](https://ohall.github.io/event-driven/)

## Usage

1. **Creating Components**:
   - Use the toolbar to add new emitters, queues, and handlers
   - Drag components to position them on the canvas

2. **Making Connections**:
   - Click the "Connect Components" button
   - Click on a source component, then click on a target component
   - Valid connections:
     - Emitters → Queues
     - Queues → Handlers

3. **Configuration**:
   - Event Emitters: Configure event types they can emit
   - Event Queues: Set maximum queue size
   - Event Handlers: Define processing time and subscribed event types

4. **Simulation**:
   - Events flow through the system in real-time
   - Watch as events are queued, processed, and completed
   - Monitor event states and system behavior

## Demo Setup

The application comes with a pre-configured demo that includes:
- User Input Emitter (click, input, submit events)
- System Timer Emitter (tick, timeout events)
- Event Queue with size limit
- UI Handler and Data Handler with different processing times

## Technology Stack

- [Svelte](https://svelte.dev/) - Frontend framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety and developer experience
- [Vite](https://vitejs.dev/) - Build tool and development server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
