# NORTH POLE — The Christmas Mission

A mobile-first, third-person 3D Christmas adventure built with Next.js, React 19, Three.js, React Three Fiber and Rapier. The current build contains a playable North Pole preparation loop and a timed sleigh-delivery mission.

## Current game systems

- Procedural snow-covered North Pole village, cabins, pine forest, aurora and snowfall.
- Third-person Santa exploration with a touch joystick and drag-to-look camera.
- Interactive workshop with Teddy bear, toy train and toy car manufacturing, plus an animated gift conveyor.
- Reindeer stable, sleigh preparation and gift loading.
- Eight animated reindeer, a sleigh with visible cargo presents and momentum-based flight.
- Flight telemetry, altitude controls, crosswinds, wind streaks and a three-minute sunrise countdown.
- Seven rooftop delivery targets, controlled low-altitude/low-speed gift drops, animated presents and completed-house markers.
- Return-to-stable approach and mission result with delivery score.
- Local save data for toy inventory, sleigh cargo and completed delivery progress.
- Distant winter districts, a lit beacon tower, a giant Christmas tree and frozen route scenery.
- Mobile-conscious rendering defaults, capped device pixel ratio and reduced shadow-map resolution.

## Controls

### Touch devices
- Left virtual joystick: move Santa or steer the sleigh.
- Drag across the world: rotate the camera.
- Climb / Descend buttons: adjust sleigh altitude.
- Workshop and stable panels: manufacture toys, load gifts and take off.
- At a delivery house, descend to 3.2 metres or lower and reduce speed to 12 km/h or less before dropping gifts.

### Desktop
The same on-screen controls are available. Use a mouse drag to rotate the camera.

## Mission flow

1. Enter the North Pole and walk to the workshop.
2. Manufacture toys and build the gift inventory.
3. Walk to the reindeer stable and load the sleigh.
4. Take off and steer toward the destination village.
5. Visit the seven rooftop delivery targets before sunrise.
6. Return to the North Pole stable and complete the landing.

## Tech stack

- Next.js 15 / React 19 / TypeScript
- Three.js / React Three Fiber / Drei
- React Three Rapier
- Zustand (available for future game-state expansion)

## Requirements

- Node.js 20.9+
- npm 10+

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Production build

```bash
npm run build
```

A GitHub Actions workflow runs the production build on pushes and pull requests to `main`.

## Device target

The scene is tuned for modern mobile hardware, with iPhone 12 as the primary performance target. A real-device frame-rate, thermal and touch-input test is still required before calling the game fully device-validated.

## Project status

This is an actively developed playable prototype. The core preparation, flight, delivery and return loop is implemented; deployment, real-device QA, audio, persistence and additional mission content remain future release work.
