"use client";
import useDeleteComment from "@/app/hooks/comments/useDeleteComment";
import useEditComment from "@/app/hooks/comments/useEditComment";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { UserProfile } from "@/app/types/User.type";
import getUserData from "@/app/profileActions/getUserData";
import { Comment } from "@/app/types/Posts.type";

export default function CommentItem({
  comment,
  postId,
}: {
  comment: Comment;
  postId: string;
}) {
  const [userData, setUserData] = useState<UserProfile | null>(null);
  useEffect(() => {
    async function load() {
      const res: UserProfile = await getUserData();
      setUserData(res);
    }
    load();
  }, []);
  const deleteMutation = useDeleteComment();
  const editMutation = useEditComment();

  const [editing, setEditing] = useState(false);
  const [newText, setNewText] = useState<string>(comment.content ?? "");

  const handleSave = () => {
    editMutation.mutate(
      { postId, commentId: comment._id, content: newText },
      { onSuccess: () => setEditing(false) }
    );
  };

  return (
    <div className="bg-blue-500/20 p-3 rounded-xl flex flex-col justify-center mb-3 gap-2 items-start">
      {!editing ? (
        <div className="flex justify-between w-full">
          <div>
            <div className="flex gap-2 items-center">
              <Image
                src={"/images/avatar.png"}
                alt={comment.commentCreator.name}
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="font-bold uppercase">
                {comment.commentCreator.name}
              </p>
            </div>
            <p className="ms-10 mt-1">{comment.content}</p>
          </div>
          <div>
            {userData?.user._id === comment.commentCreator._id ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="profile">
                  <i className="fas fa-align-justify cursor-pointer"></i>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Button
                      className="w-full cursor-pointer"
                      onClick={() => setEditing(true)}
                    >
                      Edit
                    </Button>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Button
                      className="w-full cursor-pointer"
                      variant="destructive"
                      onClick={() =>
                        deleteMutation.mutate({
                          postId,
                          commentId: comment._id,
                        })
                      }
                      disabled={deleteMutation.isPending}
                    >
                      Delete
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <input
          className="border p-1 rounded w-full"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
        />
      )}

      <div className="flex gap-2 mt-2">
        {!editing ? (
          <></>
        ) : (
          <>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={editMutation.isPending}
              className="cursor-pointer"
            >
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditing(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
