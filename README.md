# 3D Solar System 🌌

A web-based interactive 3D solar system simulation that allows users to explore the planets, their orbits, and relative sizes. Built using WebGL / Three.js (or your chosen 3D library), this project aims to visualize our solar system in a dynamic, educational, and immersive way.

## 🚀 Features

- Realistic 3D rendering of the Sun and planets  
- Planetary orbits with correct relative distances/scales (approximate)  
- Rotation and revolution of planets  
- Interactive camera controls (zoom, pan, rotate)  
- Optional: Labels, info panels, and orbital trails  
- Responsive rendering — should work on desktop and modern browsers  

## 🛠 Tech Stack

| Component | Technology / Library |
|-----------|-------------------------|
| Rendering / 3D | Three.js (WebGL) |
| UI & Controls | JavaScript / HTML / CSS |
| Build / Tooling | (Optional) webpack, parcel, or other bundlers |
| Asset management | — (e.g. textures for planets, skybox, etc.) |

## 📂 Project Structure 

3DsolarSystem/
├── assets/
│ ├── textures/ # Images for planet surfaces, sun, etc.
│ └── skybox/ # Background / space environment images
├── src/
│ ├── index.html
│ ├── styles.css
│ ├── main.js # Entry point / app initialization
│ ├── SolarSystem.js # Logic for generating planets, orbits
│ ├── Planet.js # Planet class, properties & methods
│ └── Orbit.js # Orbit path logic
├── README.md
└── package.json (optional)


## 🧩 Usage / Running Locally

1. Clone the repository  
   git clone https://github.com/mrunali-patil23/3DsolarSystem.git
   cd 3DsolarSystem
Install dependencies (if using npm / bundler)

npm install
Run a local development server

npm start
Or open index.html directly (for simpler setups without bundler).

Interact with the simulation:
Use mouse / touch controls to rotate, zoom, and pan
Click / hover planets for info (if implemented)

**🎯 Goals & Use Cases**
Educational tool for astronomy students
Interactive demo for web / graphics portfolios
Basis for future features:
Planetary moons
Real-time data (e.g. position via NASA APIs)
Time-lapse / speed control
Info popups about each planet
