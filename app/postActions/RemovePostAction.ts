"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function RemovePostAction(id: string) {
  const token = (await getMyToken()) as string;

  try {
    const response = await axios.delete(
      `https://linked-posts.routemisr.com/posts/${id}`,
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error Removing post"
    );
  }
}
