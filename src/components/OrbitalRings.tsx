import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const OrbitalRings = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const rings = containerRef.current.querySelectorAll('.orbital');
    
    rings.forEach((ring, index) => {
      gsap.to(ring, {
        rotation: 360,
        duration: 60 + index * 20,
        repeat: -1,
        ease: 'none',
      });
    });
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large outer ring */}
      <div 
        className="orbital absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/10"
        style={{ transformOrigin: 'center center' }}
      />
      
      {/* Medium ring */}
      <div 
        className="orbital absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-primary/5"
        style={{ transformOrigin: 'center center' }}
      />
      
      {/* Inner ring with accent */}
      <div 
        className="orbital absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full"
        style={{ 
          transformOrigin: 'center center',
          background: 'linear-gradient(90deg, transparent 0%, hsl(150 100% 50% / 0.1) 50%, transparent 100%)',
        }}
      />
      
      {/* Decorative dots on rings */}
      <div 
        className="orbital absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px]"
        style={{ transformOrigin: 'center center' }}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/30" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary/20" />
      </div>
    </div>
  );
};

export default OrbitalRings;
