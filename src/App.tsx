import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
const NotFound = lazy(() => import("./pages/NotFound"));
const CityPage = lazy(() => import("./pages/CityPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Directory = lazy(() => import("./pages/Directory"));
const BusinessDirectoryLocation = lazy(() => import("./pages/BusinessDirectoryLocation"));
const Categories = lazy(() => import("./pages/Categories"));
const CategoryHub = lazy(() => import("./pages/CategoryHub"));
const BusinessPage = lazy(() => import("./pages/BusinessPage"));

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
            <Suspense fallback={<div role="status">Loading…</div>}>
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
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </HelmetProvider>
  </ErrorBoundary>
);

export default App;
