import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useEffect } from "react";
import { getInitialTheme, setTheme } from "@/lib/theme";
import Index from "./pages/Index";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";
import TagsIndex from "./pages/TagsIndex";
import TagPage from "./pages/TagPage";
import Contact from "./pages/Contact";
import About from "./pages/About";
import RSSPage from "./pages/RSSPage";
import ArchivePage from "./pages/ArchivePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    setTheme(getInitialTheme());
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/tags" element={<TagsIndex />} />
            <Route path="/tags/:tag" element={<TagPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/rss" element={<RSSPage />} />
            <Route path="/archive/:year/:month" element={<ArchivePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
