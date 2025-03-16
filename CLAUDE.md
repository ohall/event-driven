# CLAUDE.md - Developer Guidelines

## Build & Run Commands
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Build production: `npm run build`
- Run specific test: `npm test -- -t "test name"`
- Run all tests: `npm test`
- Lint code: `npm run lint`
- Type check: `npm run check`

## Code Style Guidelines
- **Formatting**: Use Prettier with Svelte plugin
- **Naming**: camelCase for variables/functions, PascalCase for components
- **Imports**: Group imports (Svelte, third-party, local) with blank line between groups
- **Types**: Use TypeScript with Svelte's type definitions
- **Components**: Use .svelte extension, keep components small and focused
- **Reactivity**: Use $: for reactive declarations, stores for global state
- **Events**: Use typed event dispatchers, follow event-driven patterns
- **Testing**: Use Vitest for component/unit testing

## Architecture Notes
This project demonstrates event-driven architecture principles using Svelte.