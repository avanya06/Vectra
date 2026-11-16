import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, MousePointerClick, TrendingUp, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Analytics = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState({ visits: 0, ctr: 0, clicks: 0 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dashboard entrance animation
      gsap.from(dashboardRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
          onEnter: () => {
            // Animate counters
            gsap.to({}, {
              duration: 2,
              ease: 'power2.out',
              onUpdate: function() {
                const progress = this.progress();
                setCounts({
                  visits: Math.floor(progress * 847293),
                  ctr: Math.floor(progress * 94) / 10,
                  clicks: Math.floor(progress * 12847),
                });
              },
            });
          },
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  return (
    <section ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Real-Time <span className="text-gradient-green">Analytics</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Comprehensive insights into your link performance. Track everything in one beautiful dashboard.
          </p>
        </div>

        {/* Dashboard Mock */}
        <div 
          ref={dashboardRef}
          className="max-w-5xl mx-auto glass-card p-4 md:p-8 overflow-hidden"
        >
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="font-display font-semibold">Analytics Preview</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Example data
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="p-4 md:p-6 bg-secondary/50 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <BarChart3 className="w-4 h-4" />
                <span className="text-xs">Total Visits</span>
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {formatNumber(counts.visits)}
              </div>
              <div className="text-xs text-primary mt-1">+12.5% this week</div>
            </div>

            <div className="p-4 md:p-6 bg-secondary/50 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <MousePointerClick className="w-4 h-4" />
                <span className="text-xs">Avg CTR</span>
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {counts.ctr.toFixed(1)}%
              </div>
              <div className="text-xs text-primary mt-1">Above industry avg</div>
            </div>

            <div className="p-4 md:p-6 bg-secondary/50 rounded-xl border border-border/50">
              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs">Total Clicks</span>
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-foreground">
                {formatNumber(counts.clicks)}
              </div>
              <div className="text-xs text-primary mt-1">+8.3% today</div>
            </div>

            <div className="p-4 md:p-6 bg-primary/10 rounded-xl border border-primary/30">
              <div className="flex items-center gap-2 text-primary mb-3">
                <Zap className="w-4 h-4" />
                <span className="text-xs">Auto-Promoted</span>
              </div>
              <div className="font-display text-2xl md:text-3xl font-bold text-primary">
                Active
              </div>
              <div className="text-xs text-muted-foreground mt-1">3 links optimized</div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-secondary/30 rounded-xl border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <span className="text-sm font-medium">Click Performance</span>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Clicks
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/40" /> Views
                </span>
              </div>
            </div>
            
            {/* Minimal Chart Visualization */}
            <div className="relative h-40 flex items-end justify-between gap-2">
              {[65, 45, 78, 52, 88, 62, 95, 71, 83, 58, 92, 76].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col gap-1">
                  <div 
                    className="bg-primary/60 rounded-t transition-all duration-500"
                    style={{ height: `${height}%` }}
                  />
                  <div 
                    className="bg-primary/20 rounded-t"
                    style={{ height: `${height * 0.3}%` }}
                  />
                </div>
              ))}
            </div>
            
            {/* X-axis labels */}
            <div className="flex justify-between mt-4 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          {/* Top Performing Link */}
          <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium">Top Performer</div>
                <div className="text-xs text-muted-foreground">Instagram Profile</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-display text-lg font-bold text-primary">2,847</div>
              <div className="text-xs text-muted-foreground">clicks today</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Analytics;
