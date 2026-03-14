// src/components/TagContent.tsx
import { useState } from "react";
import PostCard from "@/components/PostCard";
import { paginatePosts, type BlogPostSummary } from "@/lib/blog-data";

interface TagContentProps {
  tag: string;
  allPosts: BlogPostSummary[];
}

const TagContent = ({ tag, allPosts }: TagContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, totalPages, totalPosts } = paginatePosts(allPosts, currentPage);

  return (
    <div className="container py-12 md:py-16 max-w-3xl animate-in-up flex-1">
      <div className="mb-10">
        <span className="tag-chip text-sm px-3 py-1.5 mb-3 inline-block">{tag}</span>
        <h1 className="text-3xl font-heading font-bold text-foreground">{tag}</h1>
        <p className="text-sm text-muted-foreground mt-1">{totalPosts} post{totalPosts !== 1 ? "s" : ""}</p>
      </div>
      {allPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
              <line x1="7" y1="7" x2="7.01" y2="7"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No posts with this tag</p>
          <p className="text-xs text-muted-foreground mt-1">Check back later or browse other tags.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post as any} index={i} />
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

export default TagContent;
