import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import SearchOverlay from "@/components/SearchOverlay";

const fetchLivePostsMock = vi.fn();

vi.mock("@/lib/live-blog", () => ({
  fetchLivePosts: () => fetchLivePostsMock(),
}));

describe("SearchOverlay", () => {
  it("renders closed without fetching posts", () => {
    render(<SearchOverlay isOpen={false} onClose={() => {}} />);

    expect(screen.queryByPlaceholderText("Search posts, tags, topics...")).not.toBeInTheDocument();
    expect(fetchLivePostsMock).not.toHaveBeenCalled();
  });

  it("fetches posts only after opening", async () => {
    fetchLivePostsMock.mockResolvedValueOnce([
      {
        slug: "test-post",
        title: "Test Post",
        description: "Description",
        date: "2026-03-01",
        author: "Author",
        authorRole: "Role",
        tags: ["nse"],
        category: "market-briefs",
        coverImage: "",
        draft: false,
        content: "Content",
      },
    ]);

    render(<SearchOverlay isOpen={true} onClose={() => {}} />);

    expect(screen.getByPlaceholderText("Search posts, tags, topics...")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchLivePostsMock).toHaveBeenCalledTimes(1);
    });
  });
});
