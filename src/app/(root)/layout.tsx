"use client";

import React, { useEffect, useRef, useState } from "react";
import { HambergerMenu, ProfileCircle } from "iconsax-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserContext } from "../contexts/userContext";
import { BsTwitterX } from "react-icons/bs";
import { FaFacebookSquare } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { usePathname } from "next/navigation";

const MenuOptions = () => {
  const { statusData, isPending } = useUserContext();
  return (
    <section className=" w-full h-full flex flex-col justify-between">
      <Button className="w-full bg-transparent border-b border-black text-black rounded-none">
        Login
      </Button>

      <Link href={"/admin/book"}>
        {!isPending && statusData?.role === "admin" && (
          <Button className=" w-full bg-transparent border-b text-black rounded-none">
            Admin Dashboard
          </Button>
        )}
      </Link>

      <div className=" flex md:hidden lg:hidden xl:hidden 2xl:hidden flex-col ">
        <Link href={"/books"}>
          {
            <Button className=" w-full bg-transparent border-b text-black rounded-none">
              Books
            </Button>
          }
        </Link>

        <Link href={"/admin/book"}>
          {
            <Button className=" w-full bg-transparent border-b text-black rounded-none">
              About
            </Button>
          }
        </Link>

        <Link href={"/admin/book"}>
          {
            <Button className=" w-full bg-transparent border-b text-black rounded-none">
              Categories
            </Button>
          }
        </Link>

        <Link href={"/admin/book"}>
          {
            <Button className=" w-full bg-transparent border-b text-black rounded-none">
              Support
            </Button>
          }
        </Link>
      </div>

      <Button className=" w-full bg-transparent border-b text-black rounded-none">
        Logout
      </Button>
    </section>
  );
};

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setScrolledPastHero(true);
      } else {
        setScrolledPastHero(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={navRef}
      className={`${
        path !== "/"
          ? "bg-neutral-900 static"
          : scrolledPastHero
          ? "bg-neutral-900 fixed"
          : "bg-neutral-900/30 fixed"
      } z-50 w-full h-auto flex justify-between items-center px-6 py-4
      text-white transition-colors ease-linear duration-100`}
    >
      <div className=" w-[30%] flex items-center justify-between">
        <Link href={"/"}>
          <h1 className=" font-serif text-3xl  md:text-2xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold pr-10">
            LIU
          </h1>
        </Link>
        <ul className="hidden text-xs md:flex lg:flex xl:flex 2xl:flex gap-8 font-semibold items-center justify-center">
          <li className=" hover:text-gray-300 transition-colors duration-100">
            <Link href={"/about"}>About</Link>
          </li>
          <li>
            <Link href={"/category"}> Categories</Link>
          </li>
          <li>
            <Link href={"/books"}>Books</Link>
          </li>
          <li>
            <Link href={"/support"}>Support</Link>
          </li>
        </ul>
      </div>

      <div className=" flex gap-10 items-center justify-center">
        <Sheet>
          <SheetTrigger>
            <HambergerMenu size="25" color="#FFFFFF" />
          </SheetTrigger>
          <SheetContent className="w-[200px] sm:w-[440px]">
            <SheetHeader>
              <SheetTitle>Are you absolutely sure?</SheetTitle>
              <MenuOptions />
            </SheetHeader>
          </SheetContent>
        </Sheet>

        <div className="w-8 h-8 hidden md:flex lg:flex xl:flex 2xl:flex rounded-full overflow-hidden items-center justify-center">
          <ProfileCircle size="30" color="#FFFFFF" variant="Bold" />
          {/*<ProfileCircle size="35" color="#FF8A65" /> */}
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <section className="w-full h-[300px] bg-neutral-900 text-white font-sans p-16 mt-10 gap-10 flex flex-col items-center justify-between">
      <div className=" w-full flex items-center justify-between">
        <div className="h-full w-[50%]">
          <div className="h-full w-[50%] flex flex-col items-start justify-center ">
            <h1 className="text-4xl font-serif font-bold">LIU</h1>
            <p className=" text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm w-full">
              We Grow With Our Students, Keep Thriving Keep Paying.
            </p>
          </div>
        </div>
        <div className="h-full w-[50%] flex gap-3 md:gap-10 lg:gap-10 xl:gap-10 2xl:gap-10 font-light items-center justify-end">
          <ul className="text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm flex flex-col gap-2 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4 h-full justify-start items-start ">
            <label className="font-semibold">University</label>
            <li>Blog</li>
            <li>Careers</li>
            <li>Pricing</li>
          </ul>
          <ul className="text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm flex flex-col gap-2 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4 h-full justify-between items-start">
            <label className="font-semibold">Resources</label>
            <li>Blog</li>
            <li>Careers</li>
            <li>Pricing</li>
          </ul>
          <ul className="text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm flex flex-col gap-2 md:gap-4 lg:gap-4 xl:gap-4 2xl:gap-4 h-full justify-between items-start">
            <label className="font-semibold">Legal</label>
            <li>Blog</li>
            <li>Careers</li>
            <li>Pricing</li>
          </ul>
        </div>
        <hr color="#FFFFFF" />
      </div>
      <div className="w-full flex justify-between items-center  text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-sm">
        <p>2025 LIU Inc. All rights reserved</p>
        <div className=" flex gap-2">
          <FaFacebookSquare size={20} />
          <RiInstagramFill size={20} />
          <BsTwitterX size={20} />
        </div>
      </div>
    </section>
  );
};

export default function HomePageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}
