import { SEO } from "@/components/seo";
import { useFavorites } from "@/hooks/useFavorites";
import { ManhwaCard } from "@/components/manhwa-card";

export default function Favorites() {
  const { favorites } = useFavorites();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <SEO
        title="Favorites"
        description="Your favorite manhwa."
      />
      <h1 className="font-display text-4xl font-bold mb-8">Favorites</h1>
      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {favorites.map((manhwa) => (
            <ManhwaCard key={manhwa.id} manhwa={manhwa} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>You haven't added any favorites yet.</p>
        </div>
      )}
    </div>
  );
}
