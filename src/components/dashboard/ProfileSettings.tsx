import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ProfileSettings = () => {
  const { user, refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || '',
    displayMode: (user as any)?.displayMode || 'default'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDisplayModeChange = (value: string) => {
    setFormData({ ...formData, displayMode: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.auth.updateProfile(formData);
      await refreshUser();
      toast.success('Profile updated successfully');
      // Ideally trigger a user reload here
    } catch (error: any) {
      console.error('Profile update failed:', error);
      toast.error(error.response?.data?.error || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="bg-card/60 border border-primary/20">
        <CardHeader>
          <CardTitle className="text-foreground">Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="bg-card border-primary/20 text-foreground"
                placeholder="Your Name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="displayMode" className="text-muted-foreground">Profile Header Style</Label>
              <Select value={formData.displayMode} onValueChange={handleDisplayModeChange}>
                <SelectTrigger className="bg-card border-primary/20 text-foreground">
                  <SelectValue placeholder="Select display style" />
                </SelectTrigger>
                <SelectContent className="bg-card border-primary/20 text-foreground">
                  <SelectItem value="default">Standard (Avatar + Name)</SelectItem>
                  <SelectItem value="text_only">Public Username Only (No Avatar)</SelectItem>
                  <SelectItem value="avatar_only">Profile Picture Only (No Name)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Choose what to display prominently at the top of your public page.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio" className="text-muted-foreground">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="bg-card border-primary/20 text-foreground"
                placeholder="Tell us about yourself"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatarUrl" className="text-muted-foreground">Avatar URL</Label>
              <Input
                id="avatarUrl"
                name="avatarUrl"
                value={formData.avatarUrl}
                onChange={handleChange}
                className="bg-card border-primary/20 text-foreground"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-[#5DD62C] text-black hover:bg-[#4bc11f]"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
