import { Link, useRoute } from "wouter";
import { Home, Tv } from "lucide-react";

export function BottomNavbar() {
  const [isActive] = useRoute("/");

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-border bg-background/80 backdrop-blur-xl md:hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-around px-4">
          <Link
            href="/"
            className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
              isActive ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Home className="h-6 w-6" />
            <span className="text-xs">Beranda</span>
          </Link>
          <a
            href="animaqu.dinzid.biz.id"
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center gap-1 p-2 rounded-lg text-muted-foreground transition-colors"
          >
            <Tv className="h-6 w-6" />
            <span className="text-xs">Anime</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
