"use client";
import {
  Book,
  Category,
  Graph,
  People,
  ProfileCircle,
  Setting,
} from "iconsax-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const AdminNavbar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [navState, setNavState] = useState(false);
  const [hideText, setHideText] = useState(false);

  useEffect(() => {
    if (window.innerWidth > 700) {
      setNavState(true);
      setHideText(false);
    }
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
        width: navState ? 120 : 50,
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={` h-screen z-50 bg-neutral-800  flex flex-col items-center justify-start gap-10 text-white `}
    >
      <div
        onClick={toggleNav}
        className="w-full flex items-center cursor-pointer justify-start pl-3 py-3 hover:bg-neutral-900/90 transition-all ease-linear duration-150 gap-2 font-normal text-sm"
      >
        <Setting size="20" color="#FFFFFF" />
        <motion.p
          initial={{ opacity: 0, x: -25 }}
          animate={{
            opacity: hideText && navState ? 0 : 1,
            x: hideText && navState ? -25 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`${!navState ? "hidden" : "block"} text-xs`} // Ensures consistency in SSR
        >
          Settings
        </motion.p>
      </div>
      <div className="w-full flex flex-col justify-between items-center">
        {[
          {
            icon: (
              <Graph
                size="20"
                color="#FFFFFF"
                variant={pathname === "/admin/statistics" ? "Bold" : undefined}
              />
            ),
            label: "Statistics",
            link: "/admin/statistics",
          },
          {
            icon: (
              <Book
                size="20"
                color="#FFFFFF"
                variant={pathname === "/admin/book" ? "Bold" : undefined}
              />
            ),
            label: "Books",
            link: "/admin/book",
          },
          {
            icon: (
              <Category
                size="20"
                color="#FFFFFF"
                variant={pathname === "/admin/category" ? "Bold" : undefined}
              />
            ),
            label: "Categories",
            link: "/admin/category",
          },
          {
            icon: (
              <People
                size="20"
                color="#FFFFFF"
                variant={pathname === "/admin/user" ? "Bold" : undefined}
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
            className="w-full h-auto justify-start pl-3 py-3 cursor-pointer hover:bg-neutral-900/90 transition-all ease-linear duration-150 flex items-center gap-2 "
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
              className=" text-xs"
            >
              {navState && label}
            </motion.p>
          </div>
        ))}
      </div>
      <div className="flex-grow" />
      <div
        onClick={() => router.push("/profile")}
        className="w-full h-auto cursor-pointer hover:bg-neutral-900/90 transition-all ease-linear duration-150 pl-3 py-3 flex items-center justify-start gap-2"
      >
        <ProfileCircle size="20" color="#FFFFFF" />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: hideText ? 0 : 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className=" text-xs"
        >
          {navState && "Profile"}
        </motion.p>
      </div>
    </motion.section>
  );
};

export default function AdminPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className=" flex bg-neutral-900">
      <AdminNavbar />
      {children}
    </div>
  );
}
