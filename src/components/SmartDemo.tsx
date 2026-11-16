import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, Monitor, Sun, Moon, Globe, MapPin, Cpu, Terminal, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { DeviceType, TimeOfDay, Region, LinkItem } from '../types/index';

gsap.registerPlugin(ScrollTrigger);

const SmartDemo = () => {
  const [device, setDevice] = useState<DeviceType>('mobile');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('morning');
  const [region, setRegion] = useState<Region>('india');
  const [activeRules, setActiveRules] = useState<string[]>([]);
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [systemLog, setSystemLog] = useState<string[]>([]);
  
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Simulated AI Thought Process
  useEffect(() => {
    const logs = [
      `[CTX] Device Type: ${device.toUpperCase()}`,
      `[CTX] Time Block: ${timeOfDay.toUpperCase()}`,
      `[CTX] Geo-Location: ${region.toUpperCase()}`,
      `[RULES] Re-calculating link weights...`,
      `[OPT] Context updated; links reordered.`
    ];
    setSystemLog([]);
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setSystemLog(prev => [...prev, logs[i]]);
        i++;
        // Auto-scroll terminal
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [device, timeOfDay, region]);

  useEffect(() => {
    const fetchSmartLinks = async () => {
      setLoading(true);
      
      // Update active rules UI immediately for feedback
      const rules: string[] = [];
      if (device === 'mobile') rules.push('Mobile Priority');
      if (device === 'desktop') rules.push('Desktop Optimized');
      if (timeOfDay === 'night') rules.push('Night Mode Boost');
      if (timeOfDay === 'morning') rules.push('Morning Routine');
      if (region === 'india') rules.push('Region: India');
      if (region === 'global') rules.push('Global Targeting');
      setActiveRules(rules);

      try {
        const response = await api.links.getSmartLinks('demo_user', {
          device,
          timeOfDay,
          region
        });
        
        // The API returns the sorted links directly
        setLinks(response.links);
      } catch (error) {
        console.error('Failed to fetch smart links:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSmartLinks();
  }, [device, timeOfDay, region]);

  useEffect(() => {
    if (!linksRef.current || loading) return;
    
    // Animation when links change
    const linkElements = linksRef.current.querySelectorAll('.link-card');
    gsap.fromTo(linkElements, 
      { y: 20, opacity: 0, scale: 0.95 },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.05,
        ease: 'back.out(1.7)',
        clearProps: 'all',
      }
    );
  }, [links, loading]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(contentRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const ToggleButton = ({ 
    active, 
    onClick, 
    icon: Icon, 
    label 
  }: { 
    active: boolean; 
    onClick: () => void; 
    icon: React.ElementType; 
    label: string;
  }) => (
    <button
      onClick={onClick}
      className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 overflow-hidden ${
        active 
          ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(93,214,44,0.3)]' 
          : 'bg-secondary/30 text-muted-foreground hover:bg-secondary/50 border border-transparent'
      }`}
    >
      <Icon className="w-4 h-4 z-10" />
      <span className="z-10">{label}</span>
      {active && <div className="absolute inset-0 bg-primary/5 animate-pulse" />}
    </button>
  );

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden bg-card">
      {/* Background Tech Grid */}
      <div className="absolute inset-0 grid-background opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
      
      <div ref={contentRef} className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            INTERACTIVE LIVE DEMO
          </div>
          
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight">
            Intelligence in <span className="text-gradient-green">Action</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-lg">
            Experience how the Smart Hub adapts in real-time. Change the context below and watch the rule engine prioritize links.
          </p>
        </div>
        
        {/* Main Demo Grid */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: Controls & Logic */}
          <div className="space-y-8">
            <div className="glass-card p-6 border border-border/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <h3 className="flex items-center gap-2 text-lg font-semibold mb-6">
                <Cpu className="w-5 h-5 text-primary" />
                Context Parameters
              </h3>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Device Type</label>
                  <div className="flex flex-wrap gap-3">
                    <ToggleButton active={device === 'mobile'} onClick={() => setDevice('mobile')} icon={Smartphone} label="Mobile" />
                    <ToggleButton active={device === 'desktop'} onClick={() => setDevice('desktop')} icon={Monitor} label="Desktop" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Time of Day</label>
                  <div className="flex flex-wrap gap-3">
                    <ToggleButton active={timeOfDay === 'morning'} onClick={() => setTimeOfDay('morning')} icon={Sun} label="Morning" />
                    <ToggleButton active={timeOfDay === 'night'} onClick={() => setTimeOfDay('night')} icon={Moon} label="Night" />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">User Region</label>
                  <div className="flex flex-wrap gap-3">
                    <ToggleButton active={region === 'india'} onClick={() => setRegion('india')} icon={MapPin} label="India" />
                    <ToggleButton active={region === 'global'} onClick={() => setRegion('global')} icon={Globe} label="Global" />
                  </div>
                </div>
              </div>
            </div>

            {/* AI Thought Terminal */}
            <div className="bg-card rounded-xl border border-border/10 p-4 font-mono text-sm h-48 flex flex-col shadow-inner">
              <div className="flex items-center gap-2 text-muted-foreground border-b border-border/5 pb-2 mb-2">
                <Terminal className="w-4 h-4" />
                <span className="text-xs">SYSTEM_LOG.log</span>
              </div>
              <div ref={terminalRef} className="flex-1 overflow-y-auto space-y-1 text-primary scrollbar-hide">
                {systemLog.map((log, i) => (
                  <div key={i} className="animate-fade-in">
                    <span className="opacity-50 mr-2">{new Date().toLocaleTimeString().split(' ')[0]}</span>
                    {log}
                  </div>
                ))}
                <div className="animate-pulse">_</div>
              </div>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="relative">
            {/* Dynamic Device Frame */}
            <div className={`relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-900 border-[14px] shadow-xl transition-all duration-700 ease-in-out ${
              device === 'mobile' 
                ? 'h-[600px] w-[300px] rounded-[2.5rem]' 
                : 'h-[400px] w-full max-w-[640px] rounded-[1rem] mt-12'
            }`}>
              {/* Phone Notch & Buttons - Fade out on Desktop */}
              <div className={`w-[148px] h-[18px] bg-gray-800 top-0 rounded-b-[1rem] left-1/2 -translate-x-1/2 absolute z-20 transition-opacity duration-300 ${device === 'mobile' ? 'opacity-100' : 'opacity-0'}`}></div>
              <div className={`h-[32px] w-[3px] bg-gray-800 absolute -start-[17px] top-[72px] rounded-s-lg transition-opacity duration-300 ${device === 'mobile' ? 'opacity-100' : 'opacity-0'}`}></div>
              <div className={`h-[46px] w-[3px] bg-gray-800 absolute -start-[17px] top-[124px] rounded-s-lg transition-opacity duration-300 ${device === 'mobile' ? 'opacity-100' : 'opacity-0'}`}></div>
              <div className={`h-[64px] w-[3px] bg-gray-800 absolute -end-[17px] top-[142px] rounded-e-lg transition-opacity duration-300 ${device === 'mobile' ? 'opacity-100' : 'opacity-0'}`}></div>
              
              {/* Monitor Stand - Visible only on Desktop */}
              <div className={`absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-16 bg-gray-800 transition-all duration-500 delay-300 ${device === 'desktop' ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`} style={{ zIndex: -1 }}>
                 <div className="w-full h-full relative">
                   <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-4 bg-gray-900 rounded-full shadow-xl"></div>
                 </div>
              </div>

              <div className={`overflow-hidden w-full h-full bg-card relative transition-all duration-500 ${device === 'mobile' ? 'rounded-[2rem]' : 'rounded-[0.5rem]'}`}>
                {/* Content inside phone */}
                <div className="h-full overflow-y-auto scrollbar-hide p-6 pt-12">
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-br from-primary via-primary/50 to-transparent p-[2px]">
                      <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                        <img src="/vectra-logo.png" alt="Profile" className="w-12 h-12 object-contain" />
                      </div>
                    </div>
                    <h3 className="font-bold text-foreground text-lg">@VectraUser</h3>
                    <p className="text-xs text-muted-foreground">Smart Link Hub Demo</p>
                  </div>

                  <div ref={linksRef} className="space-y-3 pb-8">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-3">
                         <Sparkles className="w-6 h-6 text-primary animate-spin" />
                         <span className="text-xs text-primary/70 animate-pulse">Optimizing Links...</span>
                      </div>
                    ) : (
                      links.map((link, index) => (
                        <div
                          key={link._id}
                          className="link-card group relative flex items-center gap-3 p-3 bg-white/5 hover:bg-white/10 border border-border/5 hover:border-primary/50 rounded-xl transition-all duration-300 cursor-pointer backdrop-blur-sm"
                        >
                          <span className="text-xl shrink-0">{link.icon}</span>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                              {link.title}
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate">{link.url}</div>
                          </div>
                          {index === 0 && (
                            <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(93,214,44,0.5)] animate-bounce">
                              TOP
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                  
                  <div className="mt-4 text-center">
                     <p className="text-[10px] text-muted-foreground">Powered by Vectra rules</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating Badge */}
            <div className="absolute top-1/2 -right-4 lg:-right-12 bg-card/80 backdrop-blur-md border border-border/10 p-4 rounded-xl shadow-2xl transform -translate-y-1/2 hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-sm font-bold text-foreground">Live Optimization</span>
              </div>
              <div className="space-y-1">
                {activeRules.map((rule, idx) => (
                  <div key={idx} className="text-xs text-muted-foreground flex items-center gap-2">
                    <ArrowRight className="w-3 h-3 text-primary" />
                    {rule}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SmartDemo;
