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
const LegacyDirectoryRoute = lazy(() => import("./components/directory/LegacyDirectoryRoute"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Directory = lazy(() => import("./pages/Directory"));
const SubmitBusiness = lazy(() => import("./pages/SubmitBusiness"));
const Admin = lazy(() => import("./pages/Admin"));
const PaymentOffer = lazy(() => import("./pages/PaymentOffer"));
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
              <Route path="/404" element={<NotFound />} />
              <Route path="/directory" element={<Directory />} />
              <Route path="/demo/directory" element={<Directory demo />} />
              <Route path="/demo/businesses/:slug" element={<BusinessPage demo />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/pay/:token" element={<PaymentOffer />} />
              <Route path="/submit-business" element={<SubmitBusiness />} />
              <Route path="/business-directory-kochi" element={<Directory />} />
              <Route path="/business-directory-:location" element={<LegacyDirectoryRoute />} />
              <Route path="/categories" element={<LegacyDirectoryRoute />} />
              <Route path="/categories/:category" element={<LegacyDirectoryRoute />} />
              <Route path="/businesses/:slug" element={<BusinessPage />} />
              <Route path="/:city/:category" element={<LegacyDirectoryRoute />} />
              {/* Single-segment short business profiles: /<short-slug> (e.g. /element-builders).
                  Legacy /:city names are handled inside BusinessPage fallback. */}
              <Route path="/:slug" element={<BusinessPage />} />
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
