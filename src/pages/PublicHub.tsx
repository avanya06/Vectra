import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '@/services/api';
import { LinkItem, DeviceType, TimeOfDay, Region, UserProfile } from '@/types';
import { ExternalLink, Share2, WifiOff } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const PublicHub = () => {
  const { username } = useParams<{ username: string }>();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const isDarkMode = false;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useGSAP(() => {
    if (loading || error) return;

    const tl = gsap.timeline();

    if (avatarRef.current) {
      tl.from(avatarRef.current, {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
    }

    if (nameRef.current) {
      tl.from(nameRef.current.children, {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power2.out",
      }, "-=0.5");
    }

    if (linksRef.current) {
      tl.from(linksRef.current.children, {
        x: -20,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "back.out(1.2)",
      }, "-=0.3");
    }

  }, { scope: containerRef, dependencies: [loading, links] });

  useEffect(() => {
    const fetchLinks = async () => {
      if (!username) return;

      const width = window.innerWidth;
      const device: DeviceType = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
      
      const hour = new Date().getHours();
      let timeOfDay: TimeOfDay = 'morning';
      if (hour >= 12 && hour < 17) timeOfDay = 'afternoon';
      else if (hour >= 17 && hour < 21) timeOfDay = 'evening';
      else if (hour >= 21 || hour < 5) timeOfDay = 'night';

      const region: Region = 'global'; 

      try {
        const response = await api.links.getSmartLinks(username, {
          device,
          timeOfDay,
          region
        });
        setLinks(response.links);
        if (response.profile) {
            setProfile(response.profile);
        }
      } catch (err) {
        setError('User not found or no public links available.');
        toast.error('Failed to load hub');
      } finally {
        setLoading(false);
      }
    };

    fetchLinks();
  }, [username]);

  const handleLinkClick = async (linkId: string) => {
    const width = window.innerWidth;
    const device = width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop';
    
    try {
      await api.analytics.track({
          linkId,
          deviceType: device,
          region: 'global',
          referrer: document.referrer
      });
    } catch (e) {
        console.error('Tracking failed', e);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.displayName || username} | Smart Link Hub`,
          text: `Check out ${profile?.displayName || username}'s links!`,
          url,
        });
      } catch (err) {
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (window.innerWidth < 768) return; 
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    gsap.to(target, {
      x: x * 0.1,
      y: y * 0.1,
      duration: 0.5,
      ease: "power2.out"
    });
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
     gsap.to(e.currentTarget, {
       x: 0, 
       y: 0,
       duration: 0.5,
       ease: "elastic.out(1, 0.3)"
     });
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center font-retro ${isDarkMode ? 'bg-card' : 'bg-gray-100'} text-primary`}>
        <div className="text-2xl animate-pulse">LOADING...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center font-retro ${isDarkMode ? 'bg-card' : 'bg-gray-100'} text-primary gap-4`}>
        <div className="text-6xl font-bold">404</div>
        <div className="text-xl">{error}</div>
        <a href="/" className="mt-4 px-6 py-2 border border-primary rounded hover:bg-[#5DD62C] hover:text-black transition-colors">
          Go Home
        </a>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`min-h-screen ${isDarkMode ? 'bg-card text-foreground' : 'bg-[#F5F5F7] text-gray-900'} font-sans selection:bg-[#5DD62C] selection:text-black overflow-x-hidden relative transition-colors duration-500`}>
      {isOffline && (
        <div className="fixed top-0 left-0 right-0 bg-red-500/90 text-foreground text-xs font-bold text-center py-1 z-50 backdrop-blur-md flex items-center justify-center gap-2">
          <WifiOff className="w-3 h-3" />
          OFFLINE MODE - SHOWING CACHED CONTENT
        </div>
      )}

      <div className="fixed inset-0 pointer-events-none opacity-20"
           style={{ 
             backgroundImage: `linear-gradient(${isDarkMode ? '#333' : '#ddd'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#333' : '#ddd'} 1px, transparent 1px)`, 
             backgroundSize: '30px 30px',
             maskImage: 'radial-gradient(circle at center, black 40%, transparent 100%)'
           }} 
      />
      
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#5DD62C] rounded-full blur-[120px] opacity-20 pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#5DD62C] rounded-full blur-[120px] opacity-30 pointer-events-none" />

      <button 
        aria-label="Share this hub"
        onClick={handleShare}
        className={`fixed top-6 right-6 z-50 p-3 backdrop-blur-md border hover:border-primary text-primary rounded-full transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg group ${isDarkMode ? 'bg-card/80 border-[#333]' : 'bg-white/80 border-gray-200'}`}
      >
        <Share2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
      </button>

      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-16 flex flex-col items-center">
         {profile?.displayMode !== 'text_only' && (
           <div ref={avatarRef} className="relative group mb-8">
             <div className="w-32 h-32 md:w-40 md:h-40 relative drop-shadow-[0_0_25px_rgba(0,0,0,0.9)]">
               <div className="absolute inset-0 border-2 border-primary rounded-full opacity-30 scale-110 group-hover:scale-125 transition-transform duration-700" />
               <div className="absolute inset-0 border border-primary rounded-full opacity-40 scale-125 group-hover:scale-150 transition-transform duration-1000 delay-100" />
               
               <div className={`w-full h-full rounded-2xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(93,214,44,0.2)] group-hover:shadow-[0_0_40px_rgba(93,214,44,0.4)] transition-all duration-500 relative z-10 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
                  {profile?.avatarUrl ? (
                    <img src={profile.avatarUrl} alt={username} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center text-5xl font-retro font-bold text-primary ${isDarkMode ? 'bg-card' : 'bg-gray-100'}`}>
                      {username?.charAt(0).toUpperCase()}
                    </div>
                  )}
               </div>
               
               <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#5DD62C] z-20 pixel-corners" />
               <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#5DD62C] z-20 pixel-corners" />
               <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#5DD62C] z-20 pixel-corners" />
               <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#5DD62C] z-20 pixel-corners" />
             </div>
           </div>
         )}

         {profile?.displayMode !== 'avatar_only' && (
           <div ref={nameRef} className="text-center mb-10 w-full space-y-3">
              <h1 className={`text-4xl md:text-5xl font-display font-bold tracking-tight ${isDarkMode ? 'text-foreground' : 'text-gray-900'}`}>
                <span className="text-primary mr-2 font-retro">@</span>
                {profile?.displayName || username}
              </h1>
              
              {profile?.bio && (
                <p className={`text-base md:text-lg font-sans leading-relaxed max-w-md mx-auto ${isDarkMode ? 'text-foreground/90 text-shadow-pixel' : 'text-muted-foreground'}`}>
                  {profile.bio}
                </p>
              )}
           </div>
         )}

        <div ref={linksRef} className="w-full space-y-4">
          {links.length === 0 && (
            <div className={`w-full text-center text-sm border rounded-xl px-4 py-3 ${isDarkMode ? 'text-foreground/80 bg-white/5 border-border/10' : 'text-muted-foreground bg-gray-100 border-gray-200'}`}>
              No links yet. Add links in your dashboard to see them here.
            </div>
          )}
          {links.map((link, index) => (
             <a 
               key={link._id}
               href={link.url}
               target="_blank"
               rel="noopener noreferrer"
               onClick={() => link._id && handleLinkClick(link._id)}
               onMouseMove={handleMouseMove}
               onMouseLeave={handleMouseLeave}
               className="group relative block w-full"
             >
               <div className="absolute inset-0 bg-gradient-to-r from-[#5DD62C] via-[#337418] to-[#5DD62C] opacity-40 group-hover:opacity-100 transition-opacity duration-300 blur-md rounded-2xl" />
               
               <div className={`relative flex items-center justify-between p-4 md:p-5 border border-primary/70 group-hover:border-primary group-hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden z-10 shadow-[0_0_18px_rgba(93,214,44,0.35)] ${isDarkMode ? 'bg-card/85' : 'bg-white/95'}`}>
                 
                 <div className="flex items-center gap-4 relative z-20">
                   <div className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center border border-primary/60 rounded-lg transition-colors duration-300 ${isDarkMode ? 'bg-card' : 'bg-gray-50'}`}>
                      {link.icon ? (
                        <span className="text-xl">{link.icon}</span>
                      ) : (
                        <span className="font-retro font-bold text-primary text-lg">#{index + 1}</span>
                      )}
                   </div>
                   
                   <div className="flex flex-col text-left">
                     <span className={`text-lg md:text-xl font-display font-bold tracking-wide ${isDarkMode ? 'text-foreground text-shadow-pixel' : 'text-gray-900'}`}>
                       {link.title}
                     </span>
                   </div>
                 </div>
                 
                 <div className={`relative z-20 w-8 h-8 flex items-center justify-center rounded-full border border-primary/60 transition-all duration-300 ${isDarkMode ? 'bg-card' : 'bg-white'}`}>
                    <ExternalLink className="w-4 h-4 text-primary" />
                 </div>
               </div>
             </a>
           ))}
         </div>

         <div className="mt-20 flex flex-col items-center gap-3 opacity-80 hover:opacity-100 transition-opacity duration-500">
           <span className="text-[10px] text-primary font-retro tracking-[0.3em] uppercase animate-pulse">
             Powered By
           </span>
           <div className={`flex items-center gap-3 px-4 py-2 rounded-full border hover:border-primary transition-colors duration-300 hover:scale-105 transform cursor-pointer ${isDarkMode ? 'bg-card border-[#333]' : 'bg-white border-gray-200'}`}>
             <img src="/vectra-logo.png" alt="Vectra" className="w-8 h-8 object-contain" />
             <span className={`font-pixel text-xl tracking-widest drop-shadow-md ${isDarkMode ? 'text-foreground' : 'text-black'}`}>VECTRA</span>
           </div>
         </div>
      </main>
    </div>
  );
};

export default PublicHub;
