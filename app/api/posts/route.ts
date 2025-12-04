import { getMyToken } from "@/utilites/token";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await getMyToken()) as string;

  try {
    const response = await fetch(
      "https://linked-posts.routemisr.com/posts?limit=30&page=LAST_PAGE&sort=-createdAt",
      { headers: { token: token } }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: error || "Failed to fetch posts" },
      { status: 500 }
    );
  }
}
