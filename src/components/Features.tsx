import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  ListOrdered, 
  Link2, 
  Eye, 
  BarChart2, 
  Rocket, 
  QrCode, 
  Moon 
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    icon: ListOrdered,
    title: 'Intelligent Link Ordering',
    description: 'AI-powered prioritization that adapts to user behavior and context.',
  },
  {
    icon: Link2,
    title: 'One Public Smart URL',
    description: 'A single link that serves personalized content to every visitor.',
  },
  {
    icon: Eye,
    title: 'Rule-Based Visibility',
    description: 'Show or hide links based on time, device, location, or performance.',
  },
  {
    icon: BarChart2,
    title: 'Click Analytics',
    description: 'Deep insights into who clicks what, when, and from where.',
  },
  {
    icon: Rocket,
    title: 'Auto-Promotion Engine',
    description: 'Top performers automatically rise to maximize conversions.',
  },
  {
    icon: QrCode,
    title: 'QR Code Generator',
    description: 'Generate branded QR codes for offline-to-online tracking.',
  },
  {
    icon: Moon,
    title: 'A brighter link experience',
    description: 'A clear light theme with readable cards and consistent controls.',
  },
];

const Features = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Filter out null refs
      const validCards = cardsRef.current.filter(card => card !== null);
      
      // Set initial state
      gsap.set(validCards, { y: 50, opacity: 0 });

      // Animate cards with a stagger when the section comes into view
      gsap.to(validCards, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%', // Trigger slightly earlier
          toggleActions: 'play none none reverse',
        },
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'all' // Ensure no styles stick after animation
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Powerful <span className="text-gradient-green">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need to create intelligent, adaptive link experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="group p-8 bg-white/5 backdrop-blur-md border border-border/10 hover:border-primary/50 hover:bg-white/10 rounded-2xl transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(93,214,44,0.15)] relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-border/10 group-hover:border-primary/30 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-inner">
                  <feature.icon className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors duration-500" />
                </div>

                <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed group-hover:text-muted-foreground transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
