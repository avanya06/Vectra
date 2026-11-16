import { API_URL } from '@/services/api';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '@/components/Navbar';
import Starfield from '@/components/Starfield';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await login({ email, password });
      toast.success('Welcome back to Vectra');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-transparent overflow-hidden flex flex-col">
      <Starfield />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center px-6 pt-32 pb-12 relative z-10">
        <div className="w-full max-w-md space-y-8 glass-card p-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-3xl font-display font-bold tracking-tight">
              Mission Control
            </h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to manage your smart links
            </p>
          </div>

          <div className="mt-8">
            <a
              href={`${API_URL}/auth/google`}
              className="w-full flex justify-center items-center gap-3 py-3 px-4 border border-border rounded-lg bg-secondary/30 hover:bg-secondary/50 text-foreground transition-all group"
            >
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
              <span>Sign in with Google</span>
            </a>
            
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-background text-muted-foreground">Or continue with</span>
              </div>
            </div>
          </div>

          <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="relative block w-full rounded-lg border border-border bg-secondary/50 p-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="relative block w-full rounded-lg border border-border bg-secondary/50 p-4 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-colors"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-medium rounded-lg text-primary-foreground bg-gradient-green hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Authenticating...' : 'Sign in'}
                <div className="absolute inset-0 rounded-lg ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              New to Vectra?{' '}
              <Link to="/register" className="font-medium text-primary hover:text-primary/80 transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
