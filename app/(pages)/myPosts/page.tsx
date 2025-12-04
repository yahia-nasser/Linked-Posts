"use client";
import { Post } from "@/app/types/Posts.type";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import RemovePostAction from "@/app/postActions/RemovePostAction";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { useEffect, useState } from "react";
import UpdatePostAction from "@/app/postActions/UpdatePostAction";
import { UserProfile } from "@/app/types/User.type";
import getUserData from "@/app/profileActions/getUserData";
import getUserPosts from "@/app/apis/getUserPosts";
import CommentsSection from "../posts/comments/CommentsSection";
import Loading from "@/app/loading";
import Refreshing from "@/app/Refreshing";

const MyPosts = () => {
  const queryClient = useQueryClient();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [updatedBody, setUpdatedBody] = useState<string>("");
  const [updatedImageFile, setUpdatedImageFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function load() {
      const res: UserProfile = await getUserData();
      console.log(res);
      setUserData(res);
    }
    load();
  }, []);

  const getMyPosts = async () => {
    if (!userData?.user?._id) return null;
    return await getUserPosts(userData.user._id);
  };

  const RemovePost = async (id: string) => {
    const response = await RemovePostAction(id);
    return response;
  };

  const { data, isPending, isFetching } = useQuery({
    queryKey: ["MyPosts", userData?.user?._id],
    queryFn: getMyPosts,
    enabled: !!userData?.user?._id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60,
  });

  const { mutate: removeMutation } = useMutation({
    mutationFn: RemovePost,
    mutationKey: ["removePost"],
    onSuccess: () => {
      toast.success("Post Removed Successfully", {
        duration: 3000,
        position: "top-center",
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      console.error("Error removing post");
    },
  });

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

      if (updatedImageFile) {
        formData.append("image", updatedImageFile);
      }

      await UpdatePostAction(formData, selectedPost.id);

      toast.success("Post updated successfully!", {
        duration: 3000,
        position: "top-center",
      });
      setSelectedPost(null);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Error updating post",
        {
          position: "top-center",
          duration: 3000,
        }
      );
    }
  };

  return (
    <section className="w-full md:w-[80%] bg-blue-300/50 mt-10 min-h-screen mx-auto rounded-3xl shadow-3xl p-1 md:p-5">
      {isPending ? (
        <Loading />
      ) : isFetching ? (
        <Refreshing />
      ) : (
        <div>
          {data?.posts?.map((post: Post, idx: string) => {
            return (
              <div
                key={idx}
                className="w-full md:w-[60%] mx-auto mt-10 shadow-2xl"
              >
                <Card className="p-4">
                  <CardHeader className="p-0">
                    <CardTitle className="p-0 flex gap-2 items-center">
                      <Image
                        src={
                          post.user.photo ||
                          "https://linked-posts.routemisr.com/uploads/d8f7523d-a69d-4734-9633-09e2f122c72f-poert1.png"
                        }
                        alt={post.user.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                      <p className="font-bold uppercase">{post.user.name}</p>
                    </CardTitle>
                    {post.user._id === userData?.user._id ? (
                      <CardAction className="p-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="profile">
                            <i className="fas fa-align-justify cursor-pointer "></i>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Button
                                className="cursor-pointer w-full"
                                onClick={() => handleEditClick(post)}
                              >
                                <i className="fas fa-pen"></i> Edit
                              </Button>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Button
                                className="cursor-pointer"
                                onClick={() => {
                                  removeMutation(post.id);
                                }}
                              >
                                <i className="fas fa-trash-can"></i> Remove
                              </Button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardAction>
                    ) : (
                      ""
                    )}
                    <div className="flex flex-col gap-3 mt-5 p-3 border rounded-2xl">
                      <p>{post.body}</p>
                      {post.image ? (
                        <Link href={`/posts/${post.id}`}>
                          <Image
                            src={post.image}
                            alt={post.user.name}
                            width={200}
                            height={200}
                            className="mx-auto rounded my-2 w-full"
                          />
                        </Link>
                      ) : null}
                    </div>
                  </CardHeader>
                  <div className="flex flex-col gap-3 border p-3 rounded-2xl">
                    <CardDescription>
                      <i className="fas fa-comment-dots"></i>{" "}
                      {post.comments.length} Comments
                    </CardDescription>
                    <CommentsSection postId={post.id} />
                  </div>
                </Card>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={selectedPost !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen) setSelectedPost(null);
        }}
      >
        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/60 z-9998" />

          <DialogContent
            className="
        fixed 
        left-1/2 top-1/2
        -translate-x-1/2 -translate-y-1/2
        z-9999
        bg-white w-[90%] max-w-lg p-6 rounded-xl shadow-xl
      "
          >
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>

            <textarea
              value={updatedBody}
              onChange={(e) => setUpdatedBody(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Edit your post"
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
    </section>
  );
};

export default MyPosts;
