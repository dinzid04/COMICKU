import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SEO } from "@/components/seo";
import { useToast } from "@/hooks/use-toast";

interface Settings {
  quote: string;
  author: string;
  imageUrl: string;
}

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const [settings, setSettings] = useState<Settings>({
    quote: "",
    author: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "dashboard", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as Settings);
      }
    };
    if (isAdmin) {
      fetchSettings();
    }
  }, [isAdmin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings({
      ...settings,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const docRef = doc(db, "dashboard", "settings");
      await setDoc(docRef, settings);
      toast({
        title: "Success",
        description: "Settings saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || !isAdmin) {
    return (
      <div className="container mx-auto max-w-2xl py-12 text-center">
        <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-12">
      <SEO title="Admin Dashboard" description="Manage website settings." />
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="quote">Quote</Label>
          <Textarea
            id="quote"
            placeholder="Enter the quote"
            value={settings.quote}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="author">Author</Label>
          <Input
            id="author"
            type="text"
            placeholder="Enter the author's name"
            value={settings.author}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="text"
            placeholder="Enter the image URL"
            value={settings.imageUrl}
            onChange={handleChange}
            className="mt-1"
          />
        </div>

        <Button type="submit">Save Settings</Button>
      </form>
    </div>
  );
}
