import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookOpen, Moon, Sun, Menu, X, Heart, History, LogOut, LogIn, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTheme } from "@/components/theme-provider";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/firebaseConfig";
import { signOut } from "firebase/auth";

export function Header() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between gap-4 px-4">
          {/* Logo */}
          <Link 
            href="/" 
            data-testid="link-home"
            className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-lg px-3 py-2 transition-all"
          >
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="font-display text-xl font-bold tracking-tight">
              COMIC KU
            </span>
          </Link>

          {/* Desktop Search */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari manhwa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full pl-9 pr-4"
                data-testid="input-search"
              />
            </div>
          </form>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2">
            <Link 
              href="/genres" 
              data-testid="link-genres"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground min-h-8 px-3 py-2 hover-elevate active-elevate-2"
            >
              Genre
            </Link>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.photoURL || undefined} alt={user.nickname || user.displayName || 'User'} />
                      <AvatarFallback>{user.nickname?.charAt(0) || user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.nickname || user.displayName}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/profile">
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span>Profil</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/favorites">
                    <DropdownMenuItem>
                      <Heart className="mr-2 h-4 w-4" />
                      <span>Favorit</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/history">
                    <DropdownMenuItem>
                      <History className="mr-2 h-4 w-4" />
                      <span>Riwayat</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login" data-testid="link-login">
                <Button className="hover-elevate active-elevate-2">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="hover-elevate active-elevate-2"
              data-testid="button-theme-toggle"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden hover-elevate active-elevate-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            data-testid="button-menu-toggle"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-border bg-background p-4 md:hidden">
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Cari manhwa..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full pl-9"
                  data-testid="input-search-mobile"
                />
              </div>
            </form>
            <div className="flex flex-col gap-2">
              <Link
                href="/genres"
                data-testid="link-genres-mobile"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground min-h-8 px-3 py-2 w-full hover-elevate active-elevate-2"
              >
                Genre
              </Link>
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground min-h-8 px-3 py-2 w-full hover-elevate active-elevate-2">
                    <UserIcon className="mr-2 h-5 w-5" /> Profil
                  </Link>
                  <Link href="/favorites" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground min-h-8 px-3 py-2 w-full hover-elevate active-elevate-2">
                    <Heart className="mr-2 h-5 w-5" /> Favorit
                  </Link>
                  <Link href="/history" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring hover:bg-accent hover:text-accent-foreground min-h-8 px-3 py-2 w-full hover-elevate active-elevate-2">
                    <History className="mr-2 h-5 w-5" /> Riwayat
                  </Link>
                </>
              ) : null}
              <Button
                variant="ghost"
                onClick={() => {
                  toggleTheme();
                  setMobileMenuOpen(false);
                }}
                className="justify-start hover-elevate active-elevate-2"
                data-testid="button-theme-toggle-mobile"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="mr-2 h-5 w-5" /> Light Mode
                  </>
                ) : (
                  <>
                    <Moon className="mr-2 h-5 w-5" /> Dark Mode
                  </>
                )}
              </Button>
              {user ? (
                <Button variant="ghost" onClick={handleLogout} className="justify-start hover-elevate active-elevate-2 text-red-500 hover:text-red-600">
                  <LogOut className="mr-2 h-5 w-5" /> Logout
                </Button>
              ) : (
                <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-start gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring bg-primary text-primary-foreground shadow hover:bg-primary/90 min-h-8 px-3 py-2 w-full hover-elevate active-elevate-2">
                  <LogIn className="mr-2 h-5 w-5" /> Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
