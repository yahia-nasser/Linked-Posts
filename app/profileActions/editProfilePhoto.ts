"use server";
import { getMyToken } from "@/utilites/token";
import axios from "axios";

export default async function editPhotoAction() {
  const token = (await getMyToken()) as string;

  try {
    const response = await axios.put(
      "https://linked-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: token ?? "",
        },
      }
    );

    return response;
  } catch (error) {
    console.log(error);
  }
}
