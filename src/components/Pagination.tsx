import { Link, useLocation } from "react-router-dom";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function buildPageUrl(search: string, page: number): string {
  const params = new URLSearchParams(search);
  if (page === 1) {
    params.delete("page");
  } else {
    params.set("page", String(page));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

function pageRange(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [1];
  if (current > 3) pages.push("...");
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    pages.push(i);
  }
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const { search } = useLocation();
  if (totalPages <= 1) return null;

  const pages = pageRange(currentPage, totalPages);
  const prevUrl = buildPageUrl(search, currentPage - 1);
  const nextUrl = buildPageUrl(search, currentPage + 1);

  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-center gap-1.5 mt-10 flex-wrap"
    >
      {/* Previous */}
      {currentPage > 1 ? (
        <Link
          to={prevUrl}
          className="pagination-btn"
          aria-label="Previous page"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Prev
        </Link>
      ) : (
        <span className="pagination-btn pagination-btn--disabled" aria-disabled="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Prev
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground text-sm select-none">
            …
          </span>
        ) : (
          <Link
            key={p}
            to={buildPageUrl(search, p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={`pagination-num ${p === currentPage ? "pagination-num--active" : ""}`}
          >
            {p}
          </Link>
        )
      )}

      {/* Next */}
      {currentPage < totalPages ? (
        <Link
          to={nextUrl}
          className="pagination-btn"
          aria-label="Next page"
        >
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </Link>
      ) : (
        <span className="pagination-btn pagination-btn--disabled" aria-disabled="true">
          Next
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </span>
      )}
    </nav>
  );
};

export default Pagination;
