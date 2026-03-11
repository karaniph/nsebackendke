import { Link } from "react-router-dom";
import { formatDate, type BlogPost } from "@/lib/blog-data";

const PostListItem = ({ post, index = 0 }: { post: BlogPost; index?: number }) => {
  return (
    <article className={`post-card animate-in-up stagger-${Math.min(index + 1, 5)}`}>
      <Link to={`/blog/${post.slug}`} className="block group">
        <div className="flex items-center gap-3 mb-3">
          <time className="text-xs text-muted-foreground font-mono">{formatDate(post.date)}</time>
          <span className="w-1 h-1 rounded-full bg-border" />
          <span className="text-xs text-muted-foreground">{post.author}</span>
        </div>
        <h2 className="font-heading font-semibold text-xl text-foreground group-hover:text-accent transition-colors duration-200">
          {post.title}
        </h2>
        <p className="text-muted-foreground mt-2.5 text-sm leading-relaxed">
          {post.description}
        </p>
      </Link>
      <div className="flex flex-wrap gap-2 mt-4">
        {post.tags.map((tag) => (
          <Link key={tag} to={`/tags/${tag}`} className="tag-chip">
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
};

export default PostListItem;
