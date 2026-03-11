import { useQuery } from "@tanstack/react-query";
import { fetchLivePosts } from "@/lib/live-blog";

export function useLivePosts() {
  return useQuery({
    queryKey: ["live-blog-posts"],
    queryFn: fetchLivePosts,
    staleTime: 1000 * 60 * 3,
    refetchInterval: 1000 * 60 * 5
  });
}
