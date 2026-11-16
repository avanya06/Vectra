import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Activity } from 'lucide-react';
import { LinkItem } from '@/types';
import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface AnalyticsDashboardProps {
  links: LinkItem[];
}

const AnalyticsDashboard = ({ links }: AnalyticsDashboardProps) => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useGSAP(() => {
    gsap.from(".analytics-card", {
      y: 20,
      opacity: 0,
      stagger: 0.1,
      duration: 0.6,
      ease: "power2.out"
    });
  }, [loading]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.analytics.getStats();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleExport = () => {
    if (!stats) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Clicks\n"
      + stats.dailyStats.map((d: any) => `${d._id},${d.clicks}`).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "analytics_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading Analytics...</div>;
  }

  const totalClicks = stats?.totalClicks || 0;
  const totalVisits = stats?.totalVisits || 0;
  const topLink = stats?.topPerformer;
  const dailyData = stats?.dailyStats?.map((d: any) => ({ 
    name: d._id.split('-').slice(1).join('/'), // Format MM/DD
    clicks: d.clicks 
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h3 className="text-xl font-display font-bold text-foreground flex items-center gap-2">
             <Activity className="w-5 h-5 text-primary" />
             Performance Overview
           </h3>
           <p className="text-sm text-muted-foreground">Track your link hub's growth and engagement.</p>
        </div>
        <Button onClick={handleExport} variant="outline" className="border-primary/50 text-primary hover:bg-[#5DD62C]/10">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="analytics-card bg-card/60 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-foreground">{totalVisits}</div>
            <p className="text-xs text-primary mt-1">Live Data</p>
          </CardContent>
        </Card>
        
        <Card className="analytics-card bg-card/60 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-primary">{totalClicks}</div>
            <p className="text-xs text-primary mt-1">Live Data</p>
          </CardContent>
        </Card>

        <Card className="analytics-card bg-card/60 border border-primary/20 backdrop-blur-sm hover:border-primary/50 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Performer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate text-foreground">{topLink?.name || 'N/A'}</div>
            <p className="text-xs text-muted-foreground mt-1">{topLink?.clicks || 0} clicks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="analytics-card bg-card/40 border border-primary/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-foreground">Click Trends (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#dbe4dc" />
                <XAxis dataKey="name" stroke="#888" tick={{ fill: '#888' }} />
                <YAxis stroke="#888" tick={{ fill: '#888' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #cbd8cd', color: '#193226' }}
                  itemStyle={{ color: '#193226' }}
                />
                <Line type="monotone" dataKey="clicks" stroke="#5DD62C" strokeWidth={2} dot={{fill: '#5DD62C', r: 4}} activeDot={{ r: 6, fill: '#fff' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;