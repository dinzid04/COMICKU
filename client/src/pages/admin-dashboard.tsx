import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/firebaseConfig";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

const welcomeMessageSchema = z.object({
  imageUrl: z.string().url("URL gambar tidak valid"),
  title: z.string().min(1, "Judul tidak boleh kosong"),
  subtitle: z.string().min(1, "Subjudul tidak boleh kosong"),
});

type WelcomeMessageFormData = z.infer<typeof welcomeMessageSchema>;

const AdminDashboard = () => {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<WelcomeMessageFormData>({
    resolver: zodResolver(welcomeMessageSchema),
  });

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (loading) return;
      if (!user) {
        navigate("/");
        return;
      }

      try {
        const settingsDocRef = doc(db, "dashboard", "settings");
        const docSnap = await getDoc(settingsDocRef);

        if (docSnap.exists()) {
          const admins = docSnap.data()?.admins || [];
          if (admins.includes(user.uid)) {
            setIsAdmin(true);
            reset(docSnap.data()?.welcomeMessage);
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();
  }, [user, loading, navigate, reset]);

  const onSubmit = async (data: WelcomeMessageFormData) => {
    try {
      const settingsDocRef = doc(db, "dashboard", "settings");
      await setDoc(settingsDocRef, { welcomeMessage: data }, { merge: true });
      alert("Pesan sambutan berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating welcome message:", error);
      alert("Gagal memperbarui pesan sambutan.");
    }
  };

  if (isLoading) {
    return <div>Memeriksa status admin...</div>;
  }

  if (!isAdmin) {
    return null; // or a redirect component
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="imageUrl">URL Gambar</Label>
          <Input id="imageUrl" {...register("imageUrl")} />
          {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
        </div>
        <div>
          <Label htmlFor="title">Judul</Label>
          <Input id="title" {...register("title")} />
          {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
        </div>
        <div>
          <Label htmlFor="subtitle">Subjudul</Label>
          <Input id="subtitle" {...register("subtitle")} />
          {errors.subtitle && <p className="text-red-500 text-sm">{errors.subtitle.message}</p>}
        </div>
        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </div>
  );
};

export default AdminDashboard;
