import { useState, type ReactNode } from "react";
import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import SearchOverlay from "./SearchOverlay";

interface AppShellProps {
  children: ReactNode;
  currentPath?: string;
}

const AppShell = ({ children, currentPath = "/" }: AppShellProps) => {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <SiteHeader onSearchOpen={() => setSearchOpen(true)} currentPath={currentPath} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
};

export default AppShell;
