// src/components/CategoryContent.tsx
import { useState } from "react";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";
import { paginatePosts, type BlogPost, type PostCategory } from "@/lib/blog-data";

interface CategoryContentProps {
  cat: PostCategory;
  label: string;
  desc: string;
  allPosts: BlogPost[];
}

const CategoryContent = ({ cat, label, desc, allPosts }: CategoryContentProps) => {
  // Using simple state for pagination instead of search params to keep it purely client-side or we can use Window object
  // A cleaner approach in SSG is strictly generating /category/page/2.astro, 
  // but for quick migration we will keep pagination client-side.
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, totalPages, totalPosts } = paginatePosts(allPosts, currentPage);

  if (!label) {
    return (
      <div className="container py-20 empty-state">
        <div className="empty-state-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/></svg>
        </div>
        <p className="text-foreground font-semibold">Category not found</p>
        <p className="text-sm text-muted-foreground mt-1">This category doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="container py-12 md:py-16 animate-in-up flex-1">
      <div className="mb-10">
        <span className="category-badge mb-3" data-category={cat}>{label}</span>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mt-3">{label}</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">{desc}</p>
        <p className="text-sm text-muted-foreground mt-1">{totalPosts} post{totalPosts !== 1 ? "s" : ""}</p>
      </div>
      {allPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14,2 14,8 20,8"/></svg>
          </div>
          <p className="text-sm font-medium text-foreground">No posts yet</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon — new content is published weekly.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} asAstroLink />
            ))}
          </div>
          
          {totalPages > 1 && (
             <div className="mt-8 flex justify-center gap-2">
               <button 
                 disabled={currentPage === 1}
                 onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                 className="btn-outline px-4 py-2 disabled:opacity-50"
               >
                 Previous
               </button>
               <span className="flex items-center text-sm">
                 Page {currentPage} of {totalPages}
               </span>
               <button 
                 disabled={currentPage === totalPages}
                 onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                 className="btn-outline px-4 py-2 disabled:opacity-50"
               >
                 Next
               </button>
             </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryContent;
