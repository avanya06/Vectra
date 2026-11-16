import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import { useAuth } from '@/context/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

import { Copy, ExternalLink, QrCode, LogOut, LayoutGrid, BarChart3, Settings, Download } from 'lucide-react';
import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import LinkManager from '@/components/dashboard/LinkManager';
import AnalyticsDashboard from '@/components/dashboard/AnalyticsDashboard';
import ProfileSettings from '@/components/dashboard/ProfileSettings';
import { api } from '@/services/api';

import { LinkItem } from '@/types';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [searchParams] = useSearchParams();
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'links');
  const [shortUrl, setShortUrl] = useState('');
  const [isShortening, setIsShortening] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap.from(containerRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: "power3.out"
    });
  }, { scope: containerRef });


  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab && ['links', 'analytics', 'settings'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const fetchLinks = async () => {
    try {
      const response = await api.links.getMyLinks();
      setLinks(response.data);
    } catch (error) {
      console.error('Failed to fetch links for analytics');
    }
  };

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchLinks();
    }
  }, [activeTab]);

  const profileUrl = `${window.location.origin}/u/${user?.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success('Profile URL copied to clipboard!');
  };

  const handleShorten = async () => {
    setIsShortening(true);
    try {
      const res = await api.shorten.create(profileUrl);
      setShortUrl(res.data.shortUrl);
      toast.success('Short link created!');
    } catch (err) {
      toast.error('Failed to create short link');
    } finally {
      setIsShortening(false);
    }
  };

  const downloadQRCode = () => {
    const svg = document.querySelector("#qr-code-wrapper svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      // Set canvas size (upscale for better quality)
      canvas.width = 1000;
      canvas.height = 1000;
      
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // Draw image scaled to canvas
        ctx.drawImage(img, 0, 0, 1000, 1000);
      }
      
      URL.revokeObjectURL(url);
      
      const pngUrl = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `${user?.username || 'smart-hub'}-qr.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded!');
    };
    
    img.src = url;
  };


  return (
    <div className="relative min-h-screen bg-transparent overflow-x-hidden">
      <Starfield />
      <Navbar />
      
      <main ref={containerRef} className="relative z-10 container mx-auto px-4 md:px-6 pt-24 pb-12">
        
        <div className="glass-card p-6 rounded-2xl border border-primary/20 mb-8 bg-card/60 backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#5DD62C]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5DD62C] to-[#337418] flex items-center justify-center text-3xl font-bold text-[#0F0F0F] shadow-[0_0_20px_rgba(93,214,44,0.3)]">
                {user?.username?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-foreground tracking-tight">
                  {user?.username}'s Hub
                </h1>
                <a 
                  href={`/u/${user?.username}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-sm text-primary hover:text-primary/80 flex items-center gap-1 transition-colors mt-1 font-medium"
                >
                  {profileUrl} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
               <Button variant="outline" className="gap-2 border-primary/30 text-foreground hover:bg-[#5DD62C]/10 hover:text-primary hover:border-primary/50 transition-all duration-300" onClick={copyToClipboard}>
                 <Copy className="w-4 h-4" /> Copy Link
               </Button>
               
               <Dialog>
                 <DialogTrigger asChild>
                   <Button variant="outline" className="gap-2 border-primary/30 text-foreground hover:bg-[#5DD62C]/10 hover:text-primary hover:border-primary/50 transition-all duration-300">
                     <QrCode className="w-4 h-4" /> QR Code
                   </Button>
                 </DialogTrigger>
                 <DialogContent className="sm:max-w-md flex flex-col items-center justify-center p-8 bg-card border border-primary/30 text-foreground">
                   <DialogHeader>
                     <DialogTitle className="mb-4 text-center text-xl font-bold text-primary">Your Smart Hub QR</DialogTitle>
                   </DialogHeader>
                   <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(93,214,44,0.2)]" id="qr-code-wrapper">
                     <QRCode value={shortUrl || profileUrl} size={200} />
                   </div>
                   
                   <div className="w-full mt-4 space-y-3">
                     <Button 
                        variant="outline"
                        className="w-full border-primary/30 text-primary hover:bg-[#5DD62C]/10"
                        onClick={downloadQRCode}
                      >
                        <Download className="w-4 h-4 mr-2" /> Download QR
                      </Button>

                     {!shortUrl ? (
                       <Button 
                         onClick={handleShorten} 
                         disabled={isShortening}
                         className="w-full bg-[#5DD62C] text-black hover:bg-[#4bc11f]"
                       >
                         {isShortening ? 'Shortening...' : 'Generate Short Link'}
                       </Button>
                     ) : (
                       <div className="flex gap-2">
                         <Input value={shortUrl} readOnly className="bg-card border-primary/30 text-foreground" />
                         <Button 
                           variant="outline"
                           className="border-primary/30 text-primary hover:bg-[#5DD62C]/10"
                           onClick={() => {
                             navigator.clipboard.writeText(shortUrl);
                             toast.success('Short URL copied!');
                           }}
                         >
                           <Copy className="w-4 h-4" />
                         </Button>
                       </div>
                     )}
                     
                     <p className="text-xs text-center text-muted-foreground">
                       Scan to visit {user?.username}'s hub
                     </p>
                   </div>
                 </DialogContent>
               </Dialog>

               <Button variant="destructive" className="gap-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20" onClick={logout}>
                 <LogOut className="w-4 h-4" /> Logout
               </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} className="space-y-6" onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-3 bg-card border border-border/5 p-1 rounded-xl">
            <TabsTrigger value="links" className="gap-2 data-[state=active]:bg-[#5DD62C] data-[state=active]:text-[#0F0F0F] text-muted-foreground rounded-lg transition-all font-medium">
              <LayoutGrid className="w-4 h-4" /> Links
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-[#5DD62C] data-[state=active]:text-[#0F0F0F] text-muted-foreground rounded-lg transition-all font-medium">
              <BarChart3 className="w-4 h-4" /> Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2 data-[state=active]:bg-[#5DD62C] data-[state=active]:text-[#0F0F0F] text-muted-foreground rounded-lg transition-all font-medium">
              <Settings className="w-4 h-4" /> Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="links" className="glass-card p-6 rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md min-h-[500px] shadow-[0_0_50px_-12px_rgba(93,214,44,0.1)]">
             <LinkManager />
          </TabsContent>

          <TabsContent value="analytics" className="glass-card p-6 rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md min-h-[500px] shadow-[0_0_50px_-12px_rgba(93,214,44,0.1)]">
             <AnalyticsDashboard links={links} />
          </TabsContent>

          <TabsContent value="settings" className="glass-card p-6 rounded-xl border border-primary/20 bg-card/40 backdrop-blur-md min-h-[500px]">
             <ProfileSettings />
          </TabsContent>

        </Tabs>

      </main>
    </div>
  );
};

export default Dashboard;
