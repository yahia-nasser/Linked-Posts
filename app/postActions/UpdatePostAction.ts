"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function UpdatePostAction(formData: FormData, id: string) {
  const token = (await getMyToken()) as string;

  try {
    const response = await axios.put(
      `https://linked-posts.routemisr.com/posts/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      }
    );

    return response.data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error updating post"
    );
  }
}
