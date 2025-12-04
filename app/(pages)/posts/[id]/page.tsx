"use client";

import { useParams } from "next/navigation";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import getSpecificPost from "@/app/apis/getSpecificPost";
import RemovePostAction from "@/app/postActions/RemovePostAction";
import UpdatePostAction from "@/app/postActions/UpdatePostAction";
import { toast } from "sonner";
import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { UserProfile } from "@/app/types/User.type";
import CommentsSection from "../comments/CommentsSection";
import { Post } from "@/app/types/Posts.type";

export default function PostDetails({ userData }: { userData: UserProfile }) {
  const params = useParams();
  const id = params?.id;

  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updatedBody, setUpdatedBody] = useState<string>("");
  const [updatedImageFile, setUpdatedImageFile] = useState<File | null>(null);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getSpecificPost(id),
    enabled: !!id,
  });

  // Remove Post Mutation
  const { mutate: removeMutation } = useMutation({
    mutationFn: (postId: string) => RemovePostAction(postId),
    onSuccess: () => {
      toast.success("Post removed successfully", { duration: 3000 });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error removing post", { duration: 3000 });
    },
  });

  // Update Post Handler
  const handleEditClick = (post: Post) => {
    setSelectedPost(post);
    setUpdatedBody(post.body || "");
    setUpdatedImageFile(null);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      const formData = new FormData();
      formData.append("body", String(updatedBody || selectedPost.body));
      if (updatedImageFile) formData.append("image", updatedImageFile);

      await UpdatePostAction(formData, selectedPost.id);

      toast.success("Post updated successfully!", { duration: 3000 });
      setSelectedPost(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Error updating post",
        { duration: 3000 }
      );
    }
  };

  if (isLoading) return <p>Loading post...</p>;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="w-full md:w-[60%] mx-auto mt-20 shadow-2xl">
      <Card className="p-4 max-h-full md:max-h-[550px] md:flex md:justify-between md:flex-row-reverse md:flex-nowrap md:gap-4">
        <div className="w-full md:w-[60%] md:border-l-2 border-gray-300 ps-4">
          <CardHeader className="p-0">
            <CardTitle className="p-0 flex gap-2 items-center">
              <Image
                src={
                  post.user.photo ||
                  "https://linked-posts.routemisr.com/uploads/default-avatar.png"
                }
                alt={post.user.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="font-bold uppercase">{post.user.name}</p>
            </CardTitle>

            {post.user._id === userData?.user._id && (
              <CardAction className="p-0">
                <Button onClick={() => handleEditClick(post)}>Edit</Button>
                <Button onClick={() => removeMutation(post.id)}>Remove</Button>
              </CardAction>
            )}

            <div className="flex flex-col gap-3 mt-5">
              <p>{post.body}</p>
              {post.image && (
                <Image
                  src={post.image}
                  alt={post.user.name}
                  width={200}
                  height={200}
                  className="mx-auto rounded my-2 w-full"
                />
              )}
            </div>
          </CardHeader>
        </div>

        <div className="flex flex-col gap-3 border p-3 rounded-2xl md:w-[40%] md:max-h-[450px] overflow-y-hidden">
          <CardDescription>
            <i className="fas fa-comment-dots"></i> {post.comments.length}{" "}
            Comments
          </CardDescription>
          <CommentsSection postId={post.id} />
        </div>
      </Card>

      <Dialog
        open={selectedPost !== null}
        onOpenChange={(isOpen) => !isOpen && setSelectedPost(null)}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/60 z-9998" />
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-9999 bg-white w-[90%] max-w-lg p-6 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>

            <textarea
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUpdatedImageFile(e.target.files?.[0] || null)}
            />

            <DialogFooter>
              <Button onClick={handleUpdatePost}>Save</Button>
              <DialogClose>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </div>
  );
}
