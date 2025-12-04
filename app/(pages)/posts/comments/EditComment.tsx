import { Comment } from "@/app/types/Posts.type";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@radix-ui/react-dialog";
import { useState } from "react";
import useEditComment from "@/app/hooks/comments/useEditComment";

type Props = {
  comment: Comment;
  postId: string;
};

export default function EditCommentDialog({ comment, postId }: Props) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState<string>(comment.content ?? "");

  const editMutation = useEditComment();

  const handleSave = () => {
    if (!text) return;
    editMutation.mutate({
      postId,
      commentId: comment._id,
      content: text,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>Edit</DialogTrigger>
      <DialogContent>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <Button onClick={handleSave} disabled={editMutation.isPending}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
