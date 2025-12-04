"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function addPostAction(values: FormData) {
  const token = (await getMyToken()) as string;

  try {
    const response = await axios.post(
      "https://linked-posts.routemisr.com/posts",
      values,
      {
        headers: {
          token: token,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error Adding post"
    );
  }
}
