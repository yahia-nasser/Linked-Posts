import { useMutation, useQueryClient } from "@tanstack/react-query";
import RemoveCommentAction from "@/app/commentActions/deleteComment";
import { toast } from "sonner";

export default function useDeleteComment() {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["deleteComment"],
    mutationFn: async ({
      commentId,
    }: {
      postId: string;
      commentId: string;
    }) => {
      console.log(commentId);
      return RemoveCommentAction(commentId);
    },

    onSuccess: (_, variables) => {
      toast.success("Comment deleted successfully!", {
        duration: 3000,
        position: "top-center",
      });

      qc.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },

    onError: (error: unknown) => {
      toast.error(
        error instanceof Error ? error.message : "Error deleting comment",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    },
  });
}
