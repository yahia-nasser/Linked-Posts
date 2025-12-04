import { getMyToken } from "@/utilites/token";

export default async function getUserData() {
  const token = await getMyToken();

  try {
    const response = await fetch(
      "https://linked-posts.routemisr.com/users/profile-data",
      {
        headers: {
          token: token ?? "",
        },
      }
    );

    const data = await response.json();

    return data;
  } catch (error: unknown) {
    throw new Error(
      error instanceof Error ? error.message : "Error Getting User Data"
    );
  }
}
