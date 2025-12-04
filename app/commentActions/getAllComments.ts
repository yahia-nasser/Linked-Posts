"use server";
import { getMyToken } from "@/utilites/token";

export default async function getComments(id: string) {
  const token = (await getMyToken()) as string;

  try {
    const response = await fetch(
      `https://linked-posts.routemisr.com/posts/${id}/comments`,
      {
        headers: {
          token: token,
        },
      }
    );
    const data = await response.json();
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error in getting comments"
    );
  }
}
