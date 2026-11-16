import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { LinkItem, Rule } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Edit2, Trash2, GripVertical, BarChart2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import RuleEditor from './RuleEditor';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const LinkManager = () => {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);
  
  const listRef = useRef<HTMLDivElement>(null);

  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [priority, setPriority] = useState(0);
  const [rules, setRules] = useState<Rule[]>([]);

  useGSAP(() => {
    if (links.length > 0) {
      gsap.from(".link-item", {
        y: 20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power2.out",
        clearProps: "all"
      });
    }
  }, { scope: listRef, dependencies: [links] });

  const fetchLinks = async () => {
    try {
      const response = await api.links.getMyLinks();
      const sortedLinks = response.data.sort((a: LinkItem, b: LinkItem) => (b.basePriority || 0) - (a.basePriority || 0));
      setLinks(sortedLinks);
    } catch (error) {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const resetForm = () => {
    setTitle('');
    setUrl('');
    setPriority(0);
    setRules([]);
    setEditingLink(null);
  };

  const openNewLinkDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (link: LinkItem) => {
    setEditingLink(link);
    setTitle(link.title);
    setUrl(link.url);
    setPriority(link.basePriority);
    setRules(link.rules || []);
    setIsDialogOpen(true);
  };

  const handleSave = async () => {
    if (!title || !url) {
      toast.error('Title and URL are required');
      return;
    }

    const payload = {
      title,
      url,
      basePriority: Number(priority),
      rules
    };

    try {
      if (editingLink && editingLink._id) {
        await api.links.updateLink(editingLink._id, payload);
        toast.success('Link updated successfully');
      } else {
        await api.links.createLink(payload);
        toast.success('Link created successfully');
      }
      setIsDialogOpen(false);
      fetchLinks();
    } catch (error) {
      toast.error('Failed to save link');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      try {
        await api.links.deleteLink(id);
        toast.success('Link deleted');
        fetchLinks();
      } catch (error) {
        toast.error('Failed to delete link');
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragItem.current = position;
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, position: number) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = async () => {
    const start = dragItem.current;
    const end = dragOverItem.current;

    if (start !== null && end !== null && start !== end) {
      const newLinks = [...links];
      const draggedLink = newLinks[start];
      
      newLinks.splice(start, 1);
      newLinks.splice(end, 0, draggedLink);
      
      setLinks(newLinks);

      try {
        const updates = newLinks.map((link, i) => ({
            id: link._id,
            priority: 1000 - i * 10
        }));
        
        await Promise.all(updates.map(u => 
            u.id ? api.links.updateLink(u.id, { basePriority: u.priority }) : Promise.resolve()
        ));
        toast.success('Order saved');
      } catch (e) {
        toast.error('Failed to save order');
        fetchLinks();
      }
    }

    dragItem.current = null;
    dragOverItem.current = null;
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading links...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold text-foreground">Your Links</h2>
        <Button onClick={openNewLinkDialog} className="bg-gradient-green text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all">
          <Plus className="w-4 h-4 mr-2" /> Add New Link
        </Button>
      </div>

      <div className="space-y-3" ref={listRef}>
        {links.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/10 rounded-xl bg-card/20 link-item">
            <p className="text-muted-foreground">No links yet. Create your first smart link!</p>
          </div>
        ) : (
          links.map((link, index) => (
            <div 
              key={link._id || index} 
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragEnter={(e) => handleDragEnter(e, index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="link-item group bg-card/50 hover:bg-card border border-border/5 hover:border-primary/30 rounded-xl p-4 transition-all duration-300 flex items-center gap-4 cursor-grab active:cursor-grabbing relative"
            >
              <div className="text-muted-foreground group-hover:text-primary transition-colors cursor-grab">
                <GripVertical className="w-5 h-5" />
              </div>

              <div className="w-10 h-10 rounded-lg bg-secondary/50 flex items-center justify-center text-xl border border-border/5">
                {link.icon || '🔗'}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold truncate text-gray-200">{link.title}</h3>
                  {link.rules && link.rules.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-wider border border-primary/20">
                      Smart
                    </span>
                  )}
                </div>
                <a href={link.url} target="_blank" rel="noreferrer" className="text-sm text-muted-foreground hover:text-primary truncate flex items-center gap-1 transition-colors">
                  {link.url} <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="hidden sm:flex items-center gap-6 px-4 border-l border-border/10">
                <div className="text-center">
                  <div className="text-lg font-mono font-bold text-foreground">{link.analytics?.clicks || 0}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Clicks</div>
                </div>
                <div className="text-center">
                   <div className="w-12 h-1 bg-gray-800 rounded-full overflow-hidden">
                     <div className="h-full bg-primary shadow-[0_0_10px_rgba(93,214,44,0.5)]" style={{ width: `${Math.min(link.basePriority || 0, 100)}%` }} />
                   </div>
                   <div className="text-[10px] text-muted-foreground mt-1">Priority</div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground hover:bg-white/10" onClick={() => openEditDialog(link)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-900/50 hover:text-red-500 hover:bg-red-500/10" onClick={() => handleDelete(link._id!)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#1a1a1a] border-border/10 text-foreground">
          <DialogHeader>
            <DialogTitle className="text-xl font-display">{editingLink ? 'Edit Smart Link' : 'Create New Smart Link'}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label className="text-base">Link Title</Label>
                <Input 
                  placeholder="e.g., My Portfolio" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="bg-card border-border/10 focus:border-primary/50 text-foreground placeholder:text-foreground/40"
                />
              </div>
              <div className="space-y-3">
                <Label className="text-base">Destination URL</Label>
                <Input 
                  placeholder="https://..." 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="bg-card border-border/10 focus:border-primary/50 text-foreground placeholder:text-foreground/40"
                />
              </div>
            </div>

            <div className="space-y-3 bg-card/50 p-4 rounded-xl border border-border/5">
              <div className="flex justify-between items-center">
                <Label className="text-base">Base Priority</Label>
                <span className="text-lg font-mono font-bold text-primary">{priority}</span>
              </div>
              <div className="pt-4 pb-2">
                 <input 
                   type="range" 
                   min="0" 
                   max="100" 
                   className="w-full accent-primary h-2 bg-secondary/50 rounded-lg appearance-none cursor-pointer hover:bg-secondary/70 transition-colors"
                   value={priority}
                   onChange={(e) => setPriority(Number(e.target.value))}
                 />
              </div>
              <p className="text-sm text-muted-foreground">Base visibility score before rules apply.</p>
            </div>

            <div className="border-t border-border pt-4">
              <RuleEditor rules={rules} onChange={setRules} />
            </div>

          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} className="bg-primary text-primary-foreground">
              {editingLink ? 'Save Changes' : 'Create Link'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LinkManager;