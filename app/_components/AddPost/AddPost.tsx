"use client";
import addPostAction from "@/app/postActions/addPostAction";
import { AddingPost } from "@/app/types/Posts.type";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const AddPost = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<AddingPost>({
    defaultValues: {
      body: "",
      image: null,
    },
  });

  const handleAddPost = async (values: AddingPost) => {
    const formData = new FormData();
    if (values.body) formData.append("body", values.body);
    if (values.image && values.image.length > 0)
      formData.append("image", values.image[0]);

    return addPostAction(formData);
  };

  const { mutate } = useMutation({
    mutationKey: ["add-post"],
    mutationFn: handleAddPost,
    onSuccess: () => {
      toast.success("Post Added Successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Failed to add post";
      toast.error(message);
    },
  });

  return (
    <form
      className="w-[90%] md:w-[50%] mx-auto mt-3 shadow-2xl bg-white p-3 rounded-2xl"
      onSubmit={handleSubmit((values) => mutate(values))}
    >
      <div className="grid w-full gap-3">
        <Label htmlFor="post">Create Post</Label>

        <Textarea
          placeholder="What do You Have In Mind .."
          id="post"
          className="resize-none"
          {...register("body")}
        />

        <Input
          id="picture"
          type="file"
          accept="image/*"
          className="cursor-pointer"
          {...register("image")}
        />

        <Button className="cursor-pointer w-1/4 mx-auto" type="submit">
          Post <i className="fas fa-share"></i>
        </Button>
      </div>
    </form>
  );
};

export default AddPost;
