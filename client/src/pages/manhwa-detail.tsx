import { useQuery } from "@tanstack/react-query";
import { useRoute, Link, useLocation } from "wouter";
import { Star, Calendar, User, Book, Tag, ExternalLink, Loader2, AlertCircle, Heart } from "lucide-react";
import { api, extractChapterId } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo";
import React, { useEffect } from "react";
import { useFavorites } from "@/hooks/useFavorites";
import { useHistory } from "@/hooks/useHistory";

export default function ManhwaDetail() {
  const [, params] = useRoute("/manhwa/:id");
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const fallbackImage = searchParams.get("image");

  const manhwaId = params?.id || "";

  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/manhwa-detail", manhwaId],
    queryFn: () => api.getManhwaDetail(manhwaId),
    enabled: !!manhwaId,
  });

  const imageUrl = data?.imageSrc || fallbackImage;

  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (data) {
      const manhwaListItem = {
        id: manhwaId,
        title: data.title,
        imageSrc: imageUrl || "",
        type: data.type,
      };
      addToHistory(manhwaListItem);
    }
  }, [data, manhwaId, addToHistory, imageUrl]);

  const handleFavoriteToggle = () => {
    if (!data) return;
    const manhwaListItem = {
      id: manhwaId,
      title: data.title,
      imageSrc: imageUrl || "",
      type: data.type,
    };
    if (isFavorite(manhwaId)) {
      removeFavorite(manhwaId);
    } else {
      addFavorite(manhwaListItem);
    }
  };

  const sortedChapters = React.useMemo(() => {
    if (!data?.chapters) return [];

    const getChapterNumber = (chapterNum: string): number => {
      const match = chapterNum.match(/(\d+(\.\d+)?)/);
      return match ? parseFloat(match[1]) : 0;
    };

    return [...data.chapters].sort((a, b) => {
      const numA = getChapterNumber(a.chapterNum);
      const numB = getChapterNumber(b.chapterNum);
      return numB - numA;
    });
  }, [data?.chapters]);

  const firstChapter = sortedChapters.length > 0 ? sortedChapters[sortedChapters.length - 1] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto max-w-7xl px-4 py-20 text-center">
        <AlertCircle className="h-16 w-16 mx-auto text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Manhwa Tidak Ditemukan</h2>
        <p className="text-muted-foreground mb-6">Manhwa yang kamu cari tidak tersedia</p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 min-h-9 px-4 py-2"
        >
          Kembali ke Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SEO
        title={data.title}
        description={data.synopsis.slice(0, 160) + "..."}
        image={imageUrl || ""}
      />
      {/* Hero Section with Cover */}
      <div className="bg-gradient-to-b from-card to-background border-b border-border">
        <div className="container mx-auto max-w-7xl px-4 py-12">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover Image */}
            <div className="flex-shrink-0">
              <div className="w-64 mx-auto md:mx-0">
                <img
                  src={imageUrl || ""}
                  alt={data.title}
                  className="w-full rounded-lg shadow-xl"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/300x450/1a1a2e/7c3aed?text=${encodeURIComponent(data.title.slice(0, 20))}`;
                  }}
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                {data.title}
              </h1>

              {data.alternative && (
                <p className="text-muted-foreground mb-4">{data.alternative}</p>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                {data.rating && (
                  <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-lg">
                    <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                    <span className="font-semibold">{data.rating}</span>
                  </div>
                )}
                <Badge variant={data.status === "Ongoing" ? "default" : "secondary"}>
                  {data.status}
                </Badge>
                <Badge variant="outline">{data.type}</Badge>
              </div>

              {/* Additional Info */}
              <div className="space-y-2 mb-6 text-sm">
                {data.author && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>Author: <span className="text-foreground font-medium">{data.author}</span></span>
                  </div>
                )}
                {data.released && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Released: <span className="text-foreground font-medium">{data.released}</span></span>
                  </div>
                )}
              </div>

              {/* Genres */}
              {data.genres && data.genres.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-semibold">Genres:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {data.genres.map((genre) => (
                      <Badge key={genre.genreName} variant="secondary">
                        {genre.genreName}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Synopsis */}
              <div className="mb-6">
                <h2 className="font-semibold mb-3">Synopsis</h2>
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {data.synopsis}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                {firstChapter?.chapterLink && (
                  <Link
                    href={`/chapter/${extractChapterId(firstChapter.chapterLink)}`}
                    className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 min-h-10 px-8"
                    data-testid="button-read-first"
                  >
                    <Book className="h-5 w-5" />
                    Baca Chapter Pertama
                  </Link>
                )}
                <Button
                  variant="outline"
                  onClick={handleFavoriteToggle}
                  className="gap-2"
                  data-testid="button-favorite"
                >
                  <Heart className={`h-5 w-5 ${isFavorite(manhwaId) ? "fill-red-500 text-red-500" : ""}`} />
                  {isFavorite(manhwaId) ? "Favorited" : "Favorite"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter List */}
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <h2 className="font-display text-2xl font-bold mb-6">Daftar Chapter</h2>
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          {sortedChapters.length > 0 ? (
            <div className="divide-y divide-border">
              {sortedChapters.map((chapter) => {
                const chapterId = extractChapterId(chapter.chapterLink);
                return (
                  <Link
                    key={chapterId}
                    href={`/chapter/${chapterId}`}
                    className="flex items-center justify-between p-4 hover-elevate active-elevate-2 transition-all"
                    data-testid={`link-chapter-${chapterId}`}
                  >
                    <div>
                      <h3 className="font-semibold">{chapter.chapterNum}</h3>
                      <p className="text-sm text-muted-foreground">{chapter.chapterDate}</p>
                    </div>
                    <ExternalLink className="h-5 w-5 text-muted-foreground" />
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              Tidak ada chapter tersedia
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
