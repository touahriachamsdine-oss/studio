
'use client';

import * as React from 'react';

const shapes = [
  // Circles
  { type: 'circle', color: 'bg-primary', size: 'w-16 h-16', top: '10%', left: '5%', animation: 'animate-float-1' },
  { type: 'circle', color: 'bg-accent', size: 'w-8 h-8', top: '80%', left: '15%', animation: 'animate-float-2' },
  { type: 'circle', color: 'bg-secondary', size: 'w-24 h-24', top: '30%', left: '90%', animation: 'animate-drift' },
  { type: 'circle', color: 'bg-accent', size: 'w-12 h-12', top: '5%', left: '45%', animation: 'animate-drift' },
  { type: 'circle', color: 'bg-primary/70', size: 'w-6 h-6', top: '60%', left: '95%', animation: 'animate-float-1' },


  // Squares
  { type: 'square', color: 'bg-secondary', size: 'w-12 h-12', top: '20%', left: '70%', animation: 'animate-float-2' },
  { type: 'square', color: 'bg-primary', size: 'w-20 h-20', top: '85%', left: '80%', animation: 'animate-float-1' },
  { type: 'square', color: 'bg-accent/80', size: 'w-10 h-10', top: '75%', left: '30%', animation: 'animate-drift' },
  
  // Triangles
  { type: 'triangle', color: 'border-b-accent', size: 'w-0 h-0', top: '50%', left: '10%', animation: 'animate-drift' },
  { type: 'triangle', color: 'border-b-primary', size: 'w-0 h-0', top: '5%', left: '85%', animation: 'animate-float-1' },
  { type: 'triangle', color: 'border-b-secondary', size: 'w-0 h-0', top: '90%', left: '50%', animation: 'animate-float-2' },

  // Squiggles
  { type: 'squiggle', color: 'border-secondary', size: '', top: '60%', left: '60%', animation: 'animate-float-2' },
  { type: 'squiggle', color: 'border-accent', size: '', top: '90%', left: '5%', animation: 'animate-drift' },
  { type: 'squiggle', color: 'border-primary', size: '', top: '45%', left: '25%', animation: 'animate-float-1' },

  
  // Dots (small circles)
  { type: 'circle', color: 'bg-foreground/50', size: 'w-3 h-3', top: '15%', left: '30%', animation: 'animate-drift' },
  { type: 'circle', color: 'bg-foreground/50', size: 'w-3 h-3', top: '70%', left: '45%', animation: 'animate-float-1' },
  { type: 'circle', color: 'bg-foreground/50', size: 'w-4 h-4', top: '40%', left: '55%', animation: 'animate-float-2' },
  { type: 'circle', color: 'bg-foreground/50', size: 'w-2 h-2', top: '80%', left: '70%', animation: 'animate-drift' },
  { type: 'circle', color: 'bg-foreground/50', size: 'w-3 h-3', top: '25%', left: '15%', animation: 'animate-float-1' },
];

export function MemphisBackground() {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }
  
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      {shapes.map((shape, i) => {
        const style = { top: shape.top, left: shape.left };
        const className = `shape shape-${shape.type} ${shape.color} ${shape.size} ${shape.animation}`;
        
        if (shape.type === 'triangle') {
             return <div key={i} className={className} style={{...style, borderBottomColor: `hsl(var(--${shape.color.split('-')[2]}))`}} />;
        }
        if (shape.type === 'squiggle') {
             return <div key={i} className={className} style={{...style, borderColor: `hsl(var(--${shape.color.split('-')[1]}))`}} />;
        }

        return <div key={i} className={className} style={style} />;
      })}
    </div>
  );
}
