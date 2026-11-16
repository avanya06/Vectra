import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ArrowUpRight, Link2, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const signOut = () => { logout(); setMenuOpen(false); navigate('/'); };
  const items = [{ href: '/#features', label: 'Features' }, { href: '/#how-it-works', label: 'How it works' }, { href: '/#demo', label: 'Live demo' }];
  return (
    <nav aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 border-b border-border/70 bg-white/95 backdrop-blur-xl">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-4">
        <Link to="/" aria-label="Vectra home" className="flex items-center gap-2.5 text-foreground">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white"><Link2 className="h-6 w-6" /></span>
          <span className="font-display text-2xl font-bold tracking-tight">vectra<span className="text-primary">.</span></span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {items.map(item => <a key={item.href} href={item.href} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">{item.label}</a>)}
        </div>
        <div className="flex items-center gap-5">
          {isAuthenticated ? <>
            <Link to="/dashboard" className="text-sm font-semibold text-primary">Dashboard</Link>
            <button onClick={signOut} className="hidden sm:block text-sm text-muted-foreground hover:text-foreground">Sign out</button>
          </> : <>
            <Link to="/login" className="hidden sm:block text-sm font-semibold hover:text-primary">Log in</Link>
            <Link to="/register" className="flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90">Get started <ArrowUpRight className="h-4 w-4" /></Link>
          </>}
          <button aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-expanded={menuOpen} aria-controls="mobile-navigation" className="md:hidden p-2 rounded-lg hover:bg-secondary" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
        </div>
      </div>
      {menuOpen && <div id="mobile-navigation" className="md:hidden border-t border-border bg-white px-6 py-4 space-y-1">
        {items.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)} className="block py-3 text-sm font-medium">{item.label}</a>)}
        {isAuthenticated ? <button onClick={signOut} className="block py-3 text-sm">Sign out</button> : <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-3 text-sm">Log in</Link>}
      </div>}
    </nav>
  );
};
export default Navbar;
