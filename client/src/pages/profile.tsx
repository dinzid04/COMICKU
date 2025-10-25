import React from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/seo';
import { Loader2, AlertCircle, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Akses Ditolak</h2>
        <p className="text-muted-foreground">Kamu harus login untuk melihat halaman profil.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <SEO title="Profil Saya" description="Kelola informasi profil dan preferensi kamu." />
      <div className="flex flex-col items-center">
        <Avatar className="h-24 w-24 mb-4">
          <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
          <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
        </Avatar>
        <h1 className="text-3xl font-bold mb-2">{user.displayName || 'Pengguna'}</h1>
        <p className="text-muted-foreground mb-8">{user.email}</p>
        <Button onClick={logout} variant="destructive" className="gap-2">
          <LogOut className="h-4 w-4" />
          <span>Keluar</span>
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
