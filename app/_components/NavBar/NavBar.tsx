"use client";
import Image from "next/image";
import Link from "next/link";
import ProfileSheet from "../ProfileSheet/ProfileSheet";
import { usePathname } from "next/navigation";

const NavBar = () => {
  const pathname = usePathname();
  return (
    <header>
      <nav className="w-full md:w-[80%] mx-auto flex justify-between items-center bg-white/35 py-2 px-1 md:px-5 rounded-3xl backdrop-blur-sm mt-5 shadow-2xl">
        <Link href="/">
          <Image
            src="/images/Logo1.png"
            alt="logo"
            className="w-20 md:w-[120px]"
            width={50}
            height={50}
          />
        </Link>
        <div className="flex gap-2 md:gap-5 items-center">
          <Link
            href="/"
            className={
              pathname === "/"
                ? "text-cyan-500 bg-white py-2 px-1 rounded-2xl transition flex items-center flex-col justify-center md:px-4"
                : "text-white py-2 px-1 rounded-2xl transition flex items-center flex-col justify-center md:px-4"
            }
          >
            <i className="fas fa-house md:text-2xl"></i>
            <span className="ms-2 text-sm md:text-xl">Home</span>
          </Link>
          <Link
            href="/myPosts"
            className={
              pathname === "/myPosts"
                ? "text-cyan-500 p-3 bg-white rounded-2xl transition py-2 px-1 flex items-center flex-col justify-center md:px-4"
                : "text-white py-2 px-1 rounded-2xl transition flex items-center flex-col justify-center md:px-4"
            }
          >
            <i className="fas fa-passport  md:text-2xl"></i>
            <span className=" ms-2 text-sm md:text-xl">My Posts</span>
          </Link>
        </div>
        <ProfileSheet />
      </nav>
    </header>
  );
};

export default NavBar;
