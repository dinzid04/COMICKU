import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/hooks/authProvider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BottomNavbar } from "@/components/bottom-navbar";

// Pages
import Home from "@/pages/home";
import SearchPage from "@/pages/search";
import GenresPage from "@/pages/genres";
import GenreDetail from "@/pages/genre-detail";
import ManhwaDetail from "@/pages/manhwa-detail";
import ChapterReader from "@/pages/chapter-reader";
import History from "@/pages/history";
import Favorites from "@/pages/favorites";
import Login from "@/pages/login";
import SignUp from "@/pages/signup";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/search/:query" component={SearchPage} />
      <Route path="/genres" component={GenresPage} />
      <Route path="/genre/:id" component={GenreDetail} />
      <Route path="/manhwa/:id" component={ManhwaDetail} />
      <Route path="/chapter/:id" component={ChapterReader} />
      <Route path="/history" component={History} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/login" component={Login} />
      <Route path="/signup" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="manhwaku-theme">
        <AuthProvider>
          <TooltipProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1 pb-16 md:pb-0">
                <Router />
              </main>
              <Footer />
              <BottomNavbar />
            </div>
            <Toaster />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
