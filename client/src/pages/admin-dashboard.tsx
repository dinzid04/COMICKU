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

// Skema baru untuk validasi form quote
const quoteSectionSchema = z.object({
  quote: z.string().min(1, "Kutipan tidak boleh kosong"),
  author: z.string().min(1, "Nama author tidak boleh kosong"),
  authorImageUrl: z.string().url("URL gambar author tidak valid"),
});

type QuoteSectionFormData = z.infer<typeof quoteSectionSchema>;

const AdminDashboard = () => {
  const { user, loading, isAdmin: isGlobalAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [, navigate] = useLocation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuoteSectionFormData>({
    resolver: zodResolver(quoteSectionSchema),
  });

  useEffect(() => {
    // Jika loading auth selesai dan user bukan admin, tendang ke homepage
    if (!loading && !isGlobalAdmin) {
      navigate("/");
      return;
    }

    // Jika user admin, ambil data quote untuk ditampilkan di form
    if (isGlobalAdmin) {
      const fetchQuoteData = async () => {
        try {
          const settingsDocRef = doc(db, "dashboard", "settings");
          const docSnap = await getDoc(settingsDocRef);
          if (docSnap.exists() && docSnap.data()?.quoteSection) {
            reset(docSnap.data().quoteSection); // Set nilai default form
          }
        } catch (error) {
          console.error("Error fetching quote data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuoteData();
    } else if (!loading) {
        setIsLoading(false);
    }
  }, [user, loading, isGlobalAdmin, navigate, reset]);

  const onSubmit = async (data: QuoteSectionFormData) => {
    try {
      const settingsDocRef = doc(db, "dashboard", "settings");
      // Gunakan setDoc dengan merge:true untuk hanya memperbarui field quoteSection
      await setDoc(settingsDocRef, { quoteSection: data }, { merge: true });
      alert("Bagian kutipan berhasil diperbarui!");
    } catch (error) {
      console.error("Error updating quote section:", error);
      alert("Gagal memperbarui kutipan.");
    }
  };

  if (loading || isLoading) {
    return <div className="container mx-auto p-4">Memuat dasbor...</div>;
  }

  if (!isGlobalAdmin) {
    return null; // Pengguna akan diarahkan oleh useEffect
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <h2 className="text-lg font-semibold mb-6">Atur Bagian Kutipan</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
        <div>
          <Label htmlFor="quote">Kutipan (Quote)</Label>
          <Input id="quote" {...register("quote")} />
          {errors.quote && <p className="text-red-500 text-sm mt-1">{errors.quote.message}</p>}
        </div>
        <div>
          <Label htmlFor="author">Author</Label>
          <Input id="author" {...register("author")} />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author.message}</p>}
        </div>
        <div>
          <Label htmlFor="authorImageUrl">URL Gambar Author</Label>
          <Input id="authorImageUrl" {...register("authorImageUrl")} />
          {errors.authorImageUrl && <p className="text-red-500 text-sm mt-1">{errors.authorImageUrl.message}</p>}
        </div>
        <Button type="submit">Simpan Perubahan</Button>
      </form>
    </div>
  );
};

export default AdminDashboard;
