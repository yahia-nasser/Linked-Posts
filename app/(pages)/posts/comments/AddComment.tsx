"use client";
import { useState } from "react";
import useAddComment from "@/app/hooks/comments/useAddComment";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AddComment({ postId }: { postId: string }) {
  const [text, setText] = useState("");
  const addComment = useAddComment();

  const handleAdd = () => {
    if (!text.trim()) return;

    addComment.mutate({ postId, content: text });
    setText("");
  };

  return (
    <div className="flex gap-2 mb-5">
      <Input
        className="border p-2 rounded w-full"
        placeholder="Write a comment..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button onClick={handleAdd} className="cursor-pointer">
        Send <i className="fas fa-paper-plane"></i>
      </Button>
    </div>
  );
}
