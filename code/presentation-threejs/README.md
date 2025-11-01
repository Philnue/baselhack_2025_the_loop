# The Loop - BaselHack 2025 Presentation

A Three.js-based interactive presentation for The Loop project demo.

## Features

- **5 Presentation Slides:**
  1. Title - Project introduction
  2. Problem - Challenges we're solving
  3. Solution - Our approach
  4. Live Demo - Interactive features showcase
  5. Team - Team members
  6. Architecture - Technical details

- **Interactive 3D Visualizations:** Each slide features custom Three.js scenes
- **Keyboard Navigation:** Use arrow keys to navigate between slides
- **Responsive Design:** Adapts to different screen sizes
- **Smooth Transitions:** Animated scene transitions

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open your browser at `http://localhost:3001`

## Navigation

- **Next Slide:** Click "Next →" button or press `→` arrow key
- **Previous Slide:** Click "← Previous" button or press `←` arrow key

## Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
presentation-treejs/
├── src/
│   ├── main.ts                 # Entry point
│   ├── PresentationController.ts  # Main presentation logic
│   ├── slides.ts              # Slide definitions and 3D scenes
│   └── types.ts               # TypeScript type definitions
├── index.html                 # HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Customization

To modify slides, edit `src/slides.ts`. Each slide can have:
- Title and subtitle text
- Content bullet points
- Custom 3D scene setup
- Animation updates
- Cleanup logic

## Technologies

- **Three.js** - 3D graphics library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

