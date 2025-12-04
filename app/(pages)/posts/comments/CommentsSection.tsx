"use client";

import useComments from "@/app/hooks/comments/useComments";
import AddComment from "./AddComment";
import CommentItem from "./CommentItem";
import { Comment } from "@/app/types/Posts.type";

export default function CommentsSection({ postId }: { postId: string }) {
  const { data, isLoading, isError } = useComments(postId);

  if (isLoading) return <p>Loading comments...</p>;
  if (isError) return <p>Error loading comments</p>;

  return (
    <div className="mt-4 border rounded-lg p-3 bg-gray-50  md:max-h-[300px] overflow-y-auto">
      <AddComment postId={postId} />

      {data?.comments?.length === 0 ? (
        <p className="text-gray-500 mt-3">No comments yet.</p>
      ) : (
        <div className="md:overflow-y-scroll  md:max-h-[80%]">
          {data.comments.map((c: Comment) => (
            <CommentItem key={c._id} comment={c} postId={postId} />
          ))}
        </div>
      )}
    </div>
  );
}
