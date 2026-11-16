import { Link } from 'react-router-dom';
import { Link2, ArrowUpRight } from 'lucide-react';

const Footer = () => (
  <footer className="relative border-t border-border bg-white py-14">
    <div className="container mx-auto px-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12">
        <div className="sm:col-span-2">
          <Link to="/" className="inline-flex items-center gap-2 font-display text-2xl font-bold"><Link2 className="h-6 w-6 text-primary" /> vectra.</Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">Your links, in the right orbit. A thoughtful home for your work, your ideas and your next connection.</p>
        </div>
        <div><h3 className="text-sm font-semibold mb-4">Explore</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <a className="hover:text-primary" href="/#features">Features</a><a className="hover:text-primary" href="/#how-it-works">How it works</a><a className="hover:text-primary" href="/#demo">Live demo</a><a className="hover:text-primary" href="/#analytics">Analytics overview</a>
        </div></div>
        <div><h3 className="text-sm font-semibold mb-4">Your hub</h3><div className="flex flex-col gap-3 text-sm text-muted-foreground">
          <Link className="hover:text-primary" to="/register">Create an account</Link><Link className="hover:text-primary" to="/login">Log in</Link><Link className="hover:text-primary" to="/dashboard">Dashboard</Link><Link className="inline-flex items-center gap-1 hover:text-primary" to="/u/demo_user">Example hub <ArrowUpRight className="h-3 w-3" /></Link>
        </div></div>
      </div>
      <div className="border-t border-border pt-6 flex flex-col sm:flex-row gap-3 justify-between text-xs text-muted-foreground"><span>© {new Date().getFullYear()} Vectra.</span><span>Made for meaningful connections.</span></div>
    </div>
  </footer>
);
export default Footer;
