"use client";
import { motion } from "framer-motion";
import {
  Setting,
  Book,
  Category,
  Tag,
  People,
  ProfileCircle,
} from "iconsax-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const AdminNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [windowWidth, setWindowWidth] = useState(0);
  const [navState, setNavState] = useState(false);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    if (windowWidth > 700) {
      setNavState(true);
      setHideText(false);
    } else {
      setNavState(false);
      setHideText(true);
    }
  }, [windowWidth]);

  useEffect(() => {
    const updateWidth = () => setWindowWidth(window.innerWidth);
    updateWidth();

    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const toggleNav = () => {
    if (navState) {
      setHideText(true);
      setTimeout(() => setNavState(false), 300);
    } else {
      setNavState(true);
      setHideText(false);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: -50 }}
      animate={{
        opacity: 1,
        x: 0,
        width: windowWidth >= 768 ? (navState ? 150 : 65) : navState ? 150 : 65,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen z-50 bg-neutral-800 flex flex-col items-center justify-between gap-10 text-white py-4"
    >
      <div
        onClick={toggleNav}
        className="w-full flex items-center cursor-pointer justify-center md:justify-start pl-0 md:pl-3 py-3 hover:bg-neutral-900/90 transition-all ease-linear duration-150 gap-2 font-normal text-sm"
      >
        <Setting size="24" color="#FFFFFF" />
        <motion.p
          initial={{ opacity: 0, x: -25 }}
          animate={{
            opacity: hideText && navState ? 0 : 1,
            x: hideText && navState ? -25 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-sm font-semibold hidden md:block"
        >
          Settings
        </motion.p>
      </div>
      <div className="w-full flex flex-col items-center gap-1 mt-5">
        {[
          {
            icon: (
              <Book
                size="24"
                color="#FFFFFF"
                variant={
                  pathname.startsWith("/admin/book") ? "Bold" : undefined
                }
              />
            ),
            label: "Books",
            link: "/admin/book",
          },
          {
            icon: (
              <Category
                size="24"
                color="#FFFFFF"
                variant={
                  pathname.startsWith("/admin/category") ? "Bold" : undefined
                }
              />
            ),
            label: "Categories",
            link: "/admin/category",
          },
          {
            icon: (
              <Tag
                size="24"
                color="#FFFFFF"
                variant={
                  pathname.startsWith("/admin/rentals") ? "Bold" : undefined
                }
              />
            ),
            label: "Rentals",
            link: "/admin/rentals",
          },
          {
            icon: (
              <People
                size="24"
                color="#FFFFFF"
                variant={
                  pathname.startsWith("/admin/user") ? "Bold" : undefined
                }
              />
            ),
            label: "Users",
            link: "/admin/user",
          },
        ].map(({ icon, label, link }) => (
          <div
            key={label}
            onClick={() => {
              if (!navState) {
                setNavState(true);
                router.push(link);
              } else router.push(link);
            }}
            className="w-full h-auto justify-center md:justify-start pl-0 md:pl-3 py-3 cursor-pointer hover:bg-neutral-900/90 transition-all ease-linear duration-150 flex items-center gap-2 "
          >
            {icon}
            <motion.p
              initial={{ opacity: 0, x: -25 }}
              animate={{
                opacity: hideText && navState ? 0 : 1,
                x: hideText && navState ? -25 : 0,
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-sm font-semibold hidden md:block"
            >
              {label}
            </motion.p>
          </div>
        ))}
      </div>
      <div className="flex-grow" />
      <div
        onClick={() => router.push("/admin/profile")}
        className="w-full h-auto cursor-pointer hover:bg-neutral-900/90 transition-all ease-linear duration-150 pl-0 md:pl-3 py-3 flex items-center justify-center md:justify-start gap-2"
      >
        <ProfileCircle size="24" color="#FFFFFF" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hideText ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="text-sm font-semibold hidden md:block"
        >
          {navState && "Profile"}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default AdminNavbar;
