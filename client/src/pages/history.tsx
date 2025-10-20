import { SEO } from "@/components/seo";
import { useHistory } from "@/hooks/useHistory";
import { ManhwaCard } from "@/components/manhwa-card";

export default function History() {
  const { history } = useHistory();

  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      <SEO
        title="History"
        description="Your reading history."
      />
      <h1 className="font-display text-4xl font-bold mb-8">Reading History</h1>
      {history.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {history.map((manhwa) => (
            <ManhwaCard key={manhwa.id} {...manhwa} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground">
          <p>Your reading history will appear here.</p>
        </div>
      )}
    </div>
  );
}
