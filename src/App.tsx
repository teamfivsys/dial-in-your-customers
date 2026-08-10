import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import CityPage from "./pages/CityPage";
import CategoryPage from "./pages/CategoryPage";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Directory from "./pages/Directory";
import BusinessDirectoryLocation from "./pages/BusinessDirectoryLocation";
import Categories from "./pages/Categories";
import CategoryHub from "./pages/CategoryHub";
import BusinessPage from "./pages/BusinessPage";

const queryClient = new QueryClient();

const App = () => (
  <ErrorBoundary>
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/business-directory-:location" element={<BusinessDirectoryLocation />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/categories/:category" element={<CategoryHub />} />
              <Route path="/businesses/:slug" element={<BusinessPage />} />
              <Route path="/:city/:category" element={<CategoryPage />} />
              <Route path="/:city" element={<CityPage />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
