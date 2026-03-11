import { Link } from "react-router-dom";
import { formatDate, type BlogPost } from "@/lib/blog-data";

const PostListItem = ({ post }: { post: BlogPost }) => {
  return (
    <article className="group">
      <Link to={`/blog/${post.slug}`} className="block">
        <time className="text-sm text-muted-foreground">{formatDate(post.date)}</time>
        <h2 className="font-heading font-semibold text-xl mt-1 text-foreground group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
          {post.description}
        </p>
      </Link>
      <div className="flex gap-3 mt-3">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            to={`/tags/${tag}`}
            className="text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
};

export default PostListItem;
