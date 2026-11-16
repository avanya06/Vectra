import { ArrowRight, ArrowUpRight, Github, Globe, Link2, Smartphone, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => (
  <section className="relative overflow-hidden pt-32 pb-20 lg:pt-44 lg:pb-28">
    <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
      <div className="relative z-10 max-w-xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold tracking-wider text-primary uppercase">
          <span className="h-2 w-2 rounded-full bg-primary" /> A little context. A smarter connection.
        </div>
        <h1 className="mt-7 font-display text-6xl sm:text-7xl xl:text-8xl font-bold leading-[1.04] tracking-[-0.06em]">
          Every link.<br /><span className="text-primary">Right on time.</span>
        </h1>
        <p className="mt-7 text-lg sm:text-xl leading-relaxed text-muted-foreground max-w-lg">
          One beautiful home for everything you share. Let your links adapt to your audience’s device, location and time of day.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <Link to="/register" className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 font-semibold text-primary-foreground shadow-lg shadow-primary/10 transition hover:-translate-y-0.5 hover:bg-primary/90">
            Create your hub <ArrowRight className="h-4 w-4" />
          </Link>
          <a href="#demo" className="inline-flex items-center gap-3 rounded-full border border-border bg-white px-7 py-4 font-semibold text-foreground transition hover:border-primary/40">
            Try the live demo <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
        <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-2"><Link2 className="h-4 w-4 text-primary" /> One shareable link</span>
          <span className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /> Rules that work for you</span>
        </div>
      </div>
      <div className="relative flex justify-center items-center py-8 lg:py-4 min-w-0">
        <div aria-hidden="true" className="absolute w-[90%] aspect-square rounded-full border border-primary/10 bg-[#edf5e6]" />
        <div aria-hidden="true" className="absolute w-[110%] aspect-square rounded-full border border-dashed border-primary/15" />
        <div className="relative w-full max-w-[340px] rounded-[2.5rem] border-[7px] border-white bg-[#f7faf4] p-6 shadow-[0_24px_70px_-20px_rgba(24,68,40,0.22)] lg:rotate-[-4deg]">
          <div className="mx-auto h-1 w-16 rounded-full bg-border mb-7" />
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-display font-bold text-white">V</div>
          <h2 className="mt-4 text-center text-2xl font-bold">Your world, linked.</h2>
          <p className="mt-1 text-center text-sm text-muted-foreground">@vectra · creator & curious human</p>
          <div className="mt-6 space-y-3">
            {[{ icon: Globe, name: 'My creative corner', detail: 'Portfolio & selected work' }, { icon: Github, name: 'Things I’m building', detail: 'Projects, experiments & ideas' }, { icon: Smartphone, name: 'Let’s stay connected', detail: 'Find me where you are' }].map(({ icon: Icon, name, detail }) => (
              <a key={name} href="/u/demo_user" className="flex items-center gap-3 rounded-2xl border border-border/70 bg-white p-4 transition hover:border-primary/40 hover:shadow-sm">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold">{name}</span><span className="block text-[11px] text-muted-foreground mt-1">{detail}</span></span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground shrink-0" />
              </a>
            ))}
          </div>
          <div className="mt-6 text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Made for your next connection</div>
        </div>
        <div className="absolute -bottom-3 right-0 lg:-right-3 rounded-2xl border border-primary/15 bg-white p-4 shadow-xl shadow-primary/5 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6f2db] text-primary"><Sparkles className="h-5 w-5" /></span>
          <span><span className="block text-sm font-semibold">The right link comes first</span><span className="block text-xs text-muted-foreground mt-1">Context-aware, by design</span></span>
        </div>
      </div>
    </div>
  </section>
);
export default Hero;
