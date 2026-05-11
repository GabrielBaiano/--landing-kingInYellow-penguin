# The King in Yellow | Penguin Weird Fiction Portfolio

![Project Demonstration](./Animação.webp)

## About the Project
This repository contains a reproduction and refinement of a design project originally developed in partnership with **Livraria da Vila** (São Paulo) and the **Penguin Books** stand for a literary event in 2024.

The core objective was to create an interface that merges the **1980s digital aesthetic** with contemporary **editorial minimalism**. The visual proposal explores the tension between classic cosmic horror literature and retro-technological vibes.

### A Note on its Origin
This project has a unique backstory. It all started with a chance conversation at a book fair about the game **Signalis**, which is famously intertwined with the mythos of *The King in Yellow*. Some time later, the person from that conversation reached out, eventually becoming a client, leading to this amazing collaboration.

### Inspiration
The primary visual reference for this project was the game **"Return of the Obra Dinn"** by Lucas Pope.

We used **Ordered Dithering (Bayer Matrix)** techniques and 1-bit thresholding via GLSL Shaders to render the Crown of Cassilda in real-time. This simulates the look of early phosphorus monitors and traditional etched metal art, but adapted to a vibrant palette inspired by classic Penguin paperback editions.

## Tech Stack
- **React 19** + **TypeScript**
- **Vite** (Build tool)
- **Three.js** / **React Three Fiber** (3D Rendering)
- **GLSL** (Custom Shaders for the Obra Dinn effect)
- **Vanilla CSS** (Responsive layout and editorial typography)

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
