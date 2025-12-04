"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileSheet from "../ProfileSheet/ProfileSheet";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <header>
      <nav className="w-full md:w-[80%] mx-auto flex justify-between items-center bg-white/35 py-2 px-5 rounded-3xl backdrop-blur-sm mt-5 shadow-2xl">
        <Link href="/">
          <Image
            src="/images/Logo1.png"
            alt="logo"
            className="w-[100px] md:w-[120px]"
            width={50}
            height={50}
          />
        </Link>
        <div className="flex gap-5 items-center">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-cyan-500 p-3 bg-white rounded-2xl transition"
                : "text-white"
            }
          >
            <i className="fas fa-house text-2xl"></i>
            <span className="ms-2">Home</span>
          </Link>
          <Link
            href="/myPosts"
            className={
              pathname === "/myPosts"
                ? "text-cyan-500 p-3 bg-white rounded-2xl transition"
                : "text-white"
            }
          >
            <i className="fas fa-passport  text-2xl"></i>
            <span className=" ms-2">My Posts</span>
          </Link>
        </div>
        <ProfileSheet />
      </nav>
    </header>
  );
};

export default NavBar;
