import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronRight, Flame, TrendingUp, Clock } from "lucide-react";
import { api, extractManhwaId } from "@/lib/api";
import { ManhwaSlider } from "@/components/manhwa-slider";
import { db } from "@/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { ManhwaCard, ManhwaCardSkeleton } from "@/components/manhwa-card";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo";

export default function Home() {
  const { data: recommendations, isLoading: loadingRec } = useQuery({
    queryKey: ["/api/manhwa-recommendation"],
    queryFn: api.getManhwaRecommendation,
  });

  const { data: newManhwa, isLoading: loadingNew } = useQuery({
    queryKey: ["/api/manhwa-new"],
    queryFn: api.getManhwaNew,
  });

  const { data: popularManhwa, isLoading: loadingPopular } = useQuery({
    queryKey: ["/api/manhwa-popular"],
    queryFn: api.getManhwaPopular,
  });

  const { data: topManhwa, isLoading: loadingTop } = useQuery({
    queryKey: ["/api/manhwa-top"],
    queryFn: api.getManhwaTop,
  });

  const [settings, setSettings] = useState({
    quote: "",
    author: "",
    imageUrl: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const docRef = doc(db, "dashboard", "settings");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSettings(docSnap.data() as any);
      }
    };
    fetchSettings();
  }, []);

  return (
    <div className="min-h-screen">
      <SEO
        title="Beranda - Baca Manhwa Gratis"
        description="Baca manhwa terbaru, populer, dan top rated gratis online. Nikmati koleksi lengkap manhwa berkualitas tinggi dengan update terbaru setiap hari."
      />

      {/* Welcome Section */}
      <section className="relative h-72 md:h-96 rounded-lg overflow-hidden mb-12">
        <img
          src="https://cdn.nefyu.my.id/030i.jpeg"
          alt="Welcome"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-bold text-foreground">
            Baca Komik Gak Ribet
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Nikmati semua komik dengan nyaman
          </p>
        </div>
      </section>

      {/* Quote Section */}
      {settings.quote && (
        <section className="my-8">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="bg-card text-card-foreground rounded-lg p-4 flex items-center gap-4">
                    <img
                        src={settings.imageUrl || "https://via.placeholder.com/150"}
                        alt={settings.author || "Author"}
                        className="w-16 h-16 rounded-full object-cover flex-shrink-0"
                    />
                    <div>
                        <p className="italic text-foreground">
                            "{settings.quote}"
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            - {settings.author}
                        </p>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* Hero Slider */}
      <section className="mb-12">
        {loadingRec ? (
          <div className="h-[400px] md:h-[500px] rounded-lg bg-muted animate-pulse" />
        ) : recommendations && recommendations.length > 0 ? (
          <ManhwaSlider manhwaList={recommendations} />
        ) : null}
      </section>

      <div className="container mx-auto max-w-7xl px-4 space-y-16">
        {/* Terbaru Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Clock className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold">Terbaru</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingNew
              ? Array.from({ length: 12 }).map((_, i) => <ManhwaCardSkeleton key={i} />)
              : newManhwa?.slice(0, 12).map((manhwa) => (
                  <ManhwaCard
                    key={manhwa.link}
                    id={extractManhwaId(manhwa.link)}
                    title={manhwa.title}
                    image={manhwa.imageSrc || manhwa.imageUrl || ""}
                    chapter={manhwa.chapters?.[0]?.chapterTitle}
                  />
                ))}
          </div>
        </section>

        {/* Populer Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Flame className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold">Populer</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingPopular
              ? Array.from({ length: 12 }).map((_, i) => <ManhwaCardSkeleton key={i} />)
              : popularManhwa?.slice(0, 12).map((manhwa) => (
                  <ManhwaCard
                    key={manhwa.link}
                    id={extractManhwaId(manhwa.link)}
                    title={manhwa.title}
                    image={manhwa.imageSrc || manhwa.imageUrl || ""}
                    rating={manhwa.rating}
                    chapter={manhwa.chapter}
                  />
                ))}
          </div>
        </section>

        {/* Top Rated Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="font-display text-3xl font-bold">Top Rated</h2>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loadingTop
              ? Array.from({ length: 12 }).map((_, i) => <ManhwaCardSkeleton key={i} />)
              : topManhwa?.slice(0, 12).map((manhwa) => (
                  <ManhwaCard
                    key={manhwa.url}
                    id={extractManhwaId(manhwa.url)}
                    title={manhwa.title}
                    image={manhwa.image}
                    rating={manhwa.rating}
                  />
                ))}
          </div>
        </section>
      </div>
    </div>
  );
}
