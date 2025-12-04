"use client";
import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Post } from "@/app/types/Posts.type";
import { UserProfile } from "@/app/types/User.type";
import getUserData from "@/app/profileActions/getUserData";
import RemovePostAction from "@/app/postActions/RemovePostAction";
import UpdatePostAction from "@/app/postActions/UpdatePostAction";
import useAddComment from "@/app/hooks/comments/useAddComment";
import { toast } from "sonner";

import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogPortal,
  DialogOverlay,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import AddPost from "@/app/_components/AddPost/AddPost";
import Loading from "@/app/loading";
import Refreshing from "@/app/Refreshing";

const Posts = () => {
  const queryClient = useQueryClient();
  const addComment = useAddComment();
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updatedBody, setUpdatedBody] = useState<string>("");
  const [updatedImageFile, setUpdatedImageFile] = useState<File | null>(null);
  const [commentInput, setCommentInput] = useState<{ [key: string]: string }>(
    {}
  );

  // Load user data
  useEffect(() => {
    async function load() {
      const res = await getUserData();
      setUserData(res);
    }
    load();
  }, []);

  // Fetch posts
  const getPosts = async (): Promise<{ posts: Post[] }> => {
    const res = await fetch("/api/posts");
    return res.json();
  };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
    staleTime: 1000 * 30,
  });

  // Remove post mutation
  const { mutate: removeMutation } = useMutation({
    mutationFn: async (id: string) => await RemovePostAction(id),
    onSuccess: () => {
      toast.success("Post removed successfully!");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error removing post");
    },
  });

  // Update post
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

      toast.success("Post updated successfully!");
      setSelectedPost(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Error updating post");
    }
  };

  // Add comment
  const handleAddComment = (postId: string) => {
    const content = commentInput[postId]?.trim();
    if (!content) {
      toast.error("Comment cannot be empty");
      return;
    }

    addComment.mutate({ postId, content });
    setCommentInput((prev) => ({ ...prev, [postId]: "" }));
    queryClient.invalidateQueries({ queryKey: ["comments"] });
  };

  if (isLoading) return <Loading />;
  if (isFetching) return <Refreshing />;

  return (
    <>
      <AddPost />
      {data?.posts?.map((post: Post, idx: number) => (
        <div key={idx} className="w-full md:w-[60%] mx-auto mt-10 shadow-2xl">
          <Card className="p-4">
            <CardHeader className="p-0">
              <CardTitle className="p-0 flex gap-2 items-center">
                <Image
                  src={post.user.photo || "/images/avatar.png"}
                  alt={post.user.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                <p className="font-bold uppercase">{post.user.name}</p>
              </CardTitle>

              {post.user._id === userData?.user._id && (
                <CardAction className="p-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="profile">
                      <i className="fas fa-align-justify cursor-pointer"></i>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Button
                          onClick={() => handleEditClick(post)}
                          className="w-full cursor-pointer"
                        >
                          <i className="fas fa-pen"></i> Edit
                        </Button>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Button
                          onClick={() => removeMutation(post.id)}
                          className="w-full cursor-pointer"
                        >
                          <i className="fas fa-trash-can"></i> Remove
                        </Button>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </CardAction>
              )}

              <div className="flex flex-col gap-3 mt-5 p-3 border rounded-2xl">
                <p>{post.body}</p>
                {post.image && (
                  <Link href={`/posts/${post.id}`}>
                    <Image
                      src={post.image}
                      alt={post.user.name}
                      width={200}
                      height={200}
                      className="mx-auto rounded my-2 w-full"
                    />
                  </Link>
                )}
              </div>
            </CardHeader>

            <div className="flex flex-col gap-3 border p-3 rounded-2xl">
              <CardDescription>
                <Link
                  href={`/posts/${post.id}`}
                  className="hover:underline cursor-pointer"
                >
                  <i className="fas fa-comment-dots"></i> {post.comments.length}{" "}
                  Comments
                </Link>
              </CardDescription>

              <CardContent className="p-0 w-full flex gap-2 items-center">
                <Input
                  type="text"
                  placeholder="Add a comment..."
                  value={commentInput[post.id] || ""}
                  onChange={(e) =>
                    setCommentInput((prev) => ({
                      ...prev,
                      [post.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  onClick={() => handleAddComment(post.id)}
                  variant="outline"
                  className="cursor-pointer"
                >
                  <i className="fas fa-paper-plane"></i>
                </Button>
              </CardContent>

              <CardFooter className="bg-blue-500/20 p-3 rounded-xl flex flex-col justify-center gap-2 items-start">
                {post.comments.length > 0 ? (
                  <div>
                    <div className="flex gap-2 items-center">
                      <Image
                        src="/images/avatar.png"
                        alt={post.comments[0].commentCreator.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="font-bold uppercase">
                        {post.comments[0].commentCreator.name}
                      </p>
                    </div>
                    <p className="ms-10 mt-1">{post.comments[0].content}</p>
                  </div>
                ) : (
                  "No comments"
                )}
              </CardFooter>
            </div>
          </Card>
        </div>
      ))}

      {/* Edit post dialog */}
      <Dialog
        open={selectedPost !== null}
        onOpenChange={(open) => !open && setSelectedPost(null)}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/60 z-50" />
          <DialogContent className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white w-[90%] max-w-lg p-6 rounded-xl shadow-xl">
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>

            <textarea
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              className="w-full p-2 border rounded bg-white"
              placeholder="Edit your post"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setUpdatedImageFile(e.target.files?.[0] || null)}
            />

            <DialogFooter>
              <Button onClick={handleUpdatePost} className="cursor-pointer">
                Save
              </Button>
              <DialogClose>
                <Button variant="outline" className="cursor-pointer">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    </>
  );
};

export default Posts;
