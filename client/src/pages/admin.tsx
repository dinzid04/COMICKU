import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/hooks/authProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { saveDashboardSettings, getDashboardSettings } from '@/lib/api';

const AdminDashboard: React.FC = () => {
  const { isAdmin, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [imageUrl, setImageUrl] = useState('');
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Redirect if not admin and auth loading is complete
    if (!loading && !isAdmin) {
      setLocation('/');
    }

    // Fetch existing settings when component mounts
    const fetchSettings = async () => {
      const settings = await getDashboardSettings();
      if (settings) {
        setImageUrl(settings.imageUrl);
        setWelcomeMessage(settings.welcomeMessage);
      }
    };

    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin, loading, setLocation]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveDashboardSettings(imageUrl, welcomeMessage);
      alert('Settings saved!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  // Render a loading state or null while checking auth status
  if (loading || !isAdmin) {
    return <div>Loading...</div>; // Or a spinner component
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
                Profile Image URL
              </label>
              <Input
                id="imageUrl"
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.png"
              />
            </div>
            <div>
              <label htmlFor="welcomeMessage" className="block text-sm font-medium mb-1">
                Welcome Message
              </label>
              <Textarea
                id="welcomeMessage"
                value={welcomeMessage}
                onChange={(e) => setWelcomeMessage(e.target.value)}
                placeholder="Welcome to our comic world!"
              />
            </div>
            <Button type="submit">Save Settings</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
