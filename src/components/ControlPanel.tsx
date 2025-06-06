
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Play, Pause } from 'lucide-react';

interface ControlPanelProps {
  planetSpeeds: { [key: string]: number };
  onSpeedChange: (planet: string, speed: number) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  hoveredPlanet: string | null;
}

const planets = [
  { name: 'Mercury', defaultSpeed: 0.02, color: '#8c7853' },
  { name: 'Venus', defaultSpeed: 0.015, color: '#ffa500' },
  { name: 'Earth', defaultSpeed: 0.01, color: '#6b93d6' },
  { name: 'Mars', defaultSpeed: 0.008, color: '#cd5c5c' },
  { name: 'Jupiter', defaultSpeed: 0.005, color: '#d2691e' },
  { name: 'Saturn', defaultSpeed: 0.003, color: '#fad5a5' },
  { name: 'Uranus', defaultSpeed: 0.002, color: '#4fd0e3' },
  { name: 'Neptune', defaultSpeed: 0.001, color: '#4169e1' },
];

export const ControlPanel = ({ 
  planetSpeeds, 
  onSpeedChange, 
  isPaused, 
  onTogglePause,
  hoveredPlanet 
}: ControlPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {/* Hover tooltip */}
      {hoveredPlanet && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-50">
          <div className="bg-card border border-border rounded-lg px-3 py-2 cosmic-glow">
            <p className="text-foreground font-semibold">{hoveredPlanet}</p>
          </div>
        </div>
      )}

      {/* Main control panel */}
      <div className="fixed top-4 left-4 z-40">
        <Card className="w-80 bg-card/90 backdrop-blur-sm border-border cosmic-glow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg text-primary">Solar System Controls</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="ml-2"
              >
                {isExpanded ? 'Collapse' : 'Expand'}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Pause/Resume button */}
            <div className="flex justify-center">
              <Button
                onClick={onTogglePause}
                className="w-full bg-primary hover:bg-primary/80 text-primary-foreground"
                size="lg"
              >
                {isPaused ? (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Resume Animation
                  </>
                ) : (
                  <>
                    <Pause className="w-4 h-4 mr-2" />
                    Pause Animation
                  </>
                )}
              </Button>
            </div>

            {/* Planet speed controls */}
            {isExpanded && (
              <div className="space-y-4 max-h-80 overflow-y-auto">
                <h3 className="text-sm font-semibold text-muted-foreground">Orbital Speeds</h3>
                {planets.map((planet) => {
                  const currentSpeed = planetSpeeds[planet.name] || planet.defaultSpeed;
                  const speedMultiplier = currentSpeed / planet.defaultSpeed;
                  
                  return (
                    <div key={planet.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: planet.color }}
                          />
                          <span className="text-sm font-medium">{planet.name}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {speedMultiplier.toFixed(1)}x
                        </span>
                      </div>
                      
                      <Slider
                        value={[speedMultiplier]}
                        onValueChange={([value]) => 
                          onSpeedChange(planet.name, value * planet.defaultSpeed)
                        }
                        max={5}
                        min={0}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Instructions */}
      <div className="fixed bottom-4 right-4 z-40">
        <Card className="bg-card/90 backdrop-blur-sm border-border">
          <CardContent className="p-4">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>🖱️ Click & drag to rotate view</p>
              <p>🔍 Scroll to zoom in/out</p>
              <p>🪐 Hover over planets for info</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
