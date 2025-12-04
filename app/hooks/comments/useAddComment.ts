import { useMutation, useQueryClient } from "@tanstack/react-query";
import AddCommentAction from "@/app/commentActions/createComment";
import { toast } from "sonner";

export default function useAddComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      return AddCommentAction(postId, content);
    },

    onSuccess: (_, variables) => {
      toast.success("Comment added successfully!", {
        duration: 3000,
        position: "top-center",
      });

      qc.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
  });
}
