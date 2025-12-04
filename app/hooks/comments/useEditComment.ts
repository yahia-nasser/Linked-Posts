import { useMutation, useQueryClient } from "@tanstack/react-query";
import EditCommentAction from "@/app/commentActions/editComment";
import { toast } from "sonner";
import { EditCommentInput } from "@/app/types/Posts.type";

export default function useEditComment() {
  const qc = useQueryClient();

  return useMutation<void, Error, EditCommentInput>({
    mutationKey: ["editComment"],
    mutationFn: async ({ commentId, content }: EditCommentInput) => {
      return await EditCommentAction(commentId, content);
    },
    onSuccess: (_, variables) => {
      toast.success("Comment edited successfully!", {
        duration: 3000,
        position: "top-center",
      });

      qc.invalidateQueries({
        queryKey: ["comments", variables.postId],
      });
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Error editing comment";
      toast.error(msg, {
        duration: 3000,
        position: "top-center",
      });
    },
  });
}
