
import { useState } from 'react';
import { SolarSystem } from '@/components/SolarSystem';
import { ControlPanel } from '@/components/ControlPanel';

const Index = () => {
  const [planetSpeeds, setPlanetSpeeds] = useState<{ [key: string]: number }>({});
  const [isPaused, setIsPaused] = useState(false);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const handleSpeedChange = (planet: string, speed: number) => {
    setPlanetSpeeds(prev => ({
      ...prev,
      [planet]: speed
    }));
  };

  const handleTogglePause = () => {
    setIsPaused(!isPaused);
  };

  const handlePlanetHover = (planetName: string | null) => {
    setHoveredPlanet(planetName);
  };

  return (
    <div className="min-h-screen bg-background starfield">
      <div className="absolute inset-0">
        <SolarSystem 
          planetSpeeds={planetSpeeds}
          isPaused={isPaused}
          onPlanetHover={handlePlanetHover}
        />
      </div>
      
      <ControlPanel
        planetSpeeds={planetSpeeds}
        onSpeedChange={handleSpeedChange}
        isPaused={isPaused}
        onTogglePause={handleTogglePause}
        hoveredPlanet={hoveredPlanet}
      />

      {/* Title overlay */}
      <div className="fixed top-4 right-4 z-30">
        <div className="text-right">
          <h1 className="text-3xl font-bold text-primary cosmic-glow">
            Solar System
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Interactive 3D Simulation
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
