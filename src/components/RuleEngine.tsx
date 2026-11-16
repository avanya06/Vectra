import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Clock, Smartphone, MapPin, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const rules = [
  {
    icon: Clock,
    title: 'Time Rule',
    description: 'Adjust link priority based on time of day. Boost engagement during peak hours.',
    example: 'Show "Order Food" at dinner time',
  },
  {
    icon: Smartphone,
    title: 'Device Rule',
    description: 'Optimize link order for mobile vs desktop visitors automatically.',
    example: 'Prioritize app downloads on mobile',
  },
  {
    icon: MapPin,
    title: 'Location Rule',
    description: 'Serve region-specific links based on visitor geography.',
    example: 'Show local store for India visitors',
  },
  {
    icon: TrendingUp,
    title: 'Performance Rule',
    description: 'Auto-promote high-performing links to maximize conversions.',
    example: 'Best CTR link moves to top',
  },
];

const RuleEngine = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          y: 40,
          opacity: 0,
          duration: 0.6,
          delay: index * 0.1,
          ease: 'power3.out',
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleCardHover = (index: number) => {
    setActiveCard(index);
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleCardLeave = (index: number) => {
    setActiveCard(null);
    const card = cardsRef.current[index];
    if (card) {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Subtle background accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      
      <div className="relative container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Rule <span className="text-gradient-green">Engine</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Powerful conditions that make your links adapt intelligently to any context.
          </p>
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {rules.map((rule, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              onMouseEnter={() => handleCardHover(index)}
              onMouseLeave={() => handleCardLeave(index)}
              className={`group relative glass-card p-8 cursor-pointer transition-all duration-300 ${
                activeCard === index ? 'border-primary/40' : ''
              }`}
            >
              {/* Active Pulse Indicator */}
              <div className={`absolute top-4 right-4 flex items-center gap-2 transition-opacity duration-300 ${
                activeCard === index ? 'opacity-100' : 'opacity-0'
              }`}>
                <span className="text-xs text-primary font-medium">Active</span>
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              </div>

              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl mb-6 flex items-center justify-center transition-all duration-300 ${
                activeCard === index 
                  ? 'bg-primary/20 shadow-[0_0_30px_hsl(150_100%_50%_/_0.3)]' 
                  : 'bg-secondary'
              }`}>
                <rule.icon className={`w-7 h-7 transition-colors duration-300 ${
                  activeCard === index ? 'text-primary' : 'text-muted-foreground'
                }`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-3">{rule.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                {rule.description}
              </p>

              {/* Example Tag */}
              <div className="inline-flex items-center px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-lg">
                <span className="text-xs text-primary font-medium">
                  Ex: {rule.example}
                </span>
              </div>

              {/* Hover Glow Effect */}
              <div className={`absolute inset-0 rounded-xl transition-opacity duration-500 pointer-events-none ${
                activeCard === index ? 'opacity-100' : 'opacity-0'
              }`} style={{
                background: 'radial-gradient(400px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(150 100% 50% / 0.06), transparent 40%)',
              }} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RuleEngine;
