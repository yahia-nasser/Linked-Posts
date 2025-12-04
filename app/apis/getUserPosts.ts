"use server";

import { getMyToken } from "@/utilites/token";

export default async function getUserPosts(id: string) {
  const token = (await getMyToken()) as string;

  try {
    const response = await fetch(
      `https://linked-posts.routemisr.com/users/${id}/posts`,
      { headers: { token: token } }
    );

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating post"
    );
  }
}
