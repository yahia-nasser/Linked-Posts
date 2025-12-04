import getComments from "@/app/commentActions/getAllComments";
import { useQuery } from "@tanstack/react-query";

export default function useComments(postId: string) {
  return useQuery({
    queryKey: ["comments", postId],
    queryFn: () => getComments(postId),
  });
}
