"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function AddCommentAction(post: string, content: string) {
  const token = await getMyToken();

  const body = {
    content: content,
    post: post,
  };

  try {
    const response = await axios.post(
      "https://linked-posts.routemisr.com/comments",
      body,
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error in creating comment"
    );
  }
}
