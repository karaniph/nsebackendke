import { useState } from "react";
import PostCard from "@/components/PostCard";
import { paginatePosts, type BlogPostSummary } from "@/lib/blog-data";

interface BlogContentProps {
  allPosts: BlogPostSummary[];
}

const BlogContent = ({ allPosts }: BlogContentProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { posts, totalPages, totalPosts } = paginatePosts(allPosts, currentPage);

  return (
    <div className="container py-12 md:py-16 animate-in-up flex-1">
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Blog</h1>
        <p className="text-muted-foreground mt-2 max-w-lg">
          All posts — market briefs, deep dives, and investor education for the NSE.
        </p>
        <p className="text-sm text-muted-foreground mt-1">{totalPosts} post{totalPosts !== 1 ? "s" : ""}</p>
      </div>

      {allPosts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14,2 14,8 20,8"/>
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground">No posts yet</p>
          <p className="text-xs text-muted-foreground mt-1">Check back soon — new content is published regularly.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
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

export default BlogContent;
