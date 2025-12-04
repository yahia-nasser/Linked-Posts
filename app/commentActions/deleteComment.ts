"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function RemoveCommentAction(commentId: string) {
  const token = (await getMyToken()) as string;

  try {
    const response = await axios.delete(
      `https://linked-posts.routemisr.com/comments/${commentId}`,
      {
        headers: { token: token },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error in deleting comment"
    );
  }
}
