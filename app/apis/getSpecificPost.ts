"use server";

import { getMyToken } from "@/utilites/token";
import { ParamValue } from "next/dist/server/request/params";

export default async function getSpecificPost(
  id: string | undefined | ParamValue
) {
  const token = (await getMyToken()) as string;

  try {
    const response = await fetch(
      `https://linked-posts.routemisr.com/posts/${id}`,
      { headers: { token: token } }
    );

    const data = await response.json();
    return data.post;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating post"
    );
  }
}
