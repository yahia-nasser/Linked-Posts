"use client";

import { useEffect, useState } from "react";
import getUserData from "@/app/profileActions/getUserData";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import { UserProfile } from "@/app/types/User.type";
const ProfileSheet = () => {
  const [data, setData] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function load() {
      const res: UserProfile = await getUserData();
      setData(res);
    }
    load();
  }, []);

  return (
    <Sheet>
      <SheetTrigger className="profile">
        <Avatar className="cursor-pointer">
          <AvatarImage src={data?.user?.photo} className="cursor-pointer" />
        </Avatar>
      </SheetTrigger>

      <SheetContent className="bg-white/25 rounded backdrop-blur-sm">
        <SheetHeader>
          <SheetTitle className="text-center text-3xl text-white">
            My Profile
          </SheetTitle>

          <Avatar className="cursor-pointer w-50 h-50 mx-auto my-10">
            <AvatarImage src={data?.user?.photo} />
          </Avatar>

          <h3 className="text-xl text-white">
            Name:
            <span className="text-blue-300 "> {data?.user?.name}</span>
          </h3>

          <h3 className="text-xl text-white">
            Email:
            <span className="text-blue-300 "> {data?.user?.email}</span>
          </h3>
        </SheetHeader>
        <div className="flex flex-col justify-center items-center  overflow-y-auto text-white gap-5">
          <Button
            className="cursor-pointer"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            Sign Out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProfileSheet;
