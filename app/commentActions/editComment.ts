"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function EditCommentAction(
  commentId: string,
  content: string
) {
  const token = (await getMyToken()) as string;

  const body = { content };

  try {
    const response = await axios.put(
      `https://linked-posts.routemisr.com/comments/${commentId}`,
      body,
      {
        headers: { token },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error in Editing comment"
    );
  }
}
