import { useState } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SearchOverlay from "./SearchOverlay";

const BlogLayout = ({ children }: { children: React.ReactNode }) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col noise-bg">
      <SiteHeader onSearchOpen={() => setSearchOpen(true)} />
      <main className="flex-1 w-full max-w-prose mx-auto px-6 pb-8">
        {children}
      </main>
      <SiteFooter />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
};

export default BlogLayout;
