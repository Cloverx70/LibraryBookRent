"use client";

import { useEffect, useState } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight2, SearchNormal1 } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  formatDateWithYear,
  formUrlQuery,
  removeKeysFromQuery,
} from "../(admin_utils)/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import UserCard from "../(components)/UserCard";
import { useUserContext } from "@/app/contexts/userContext";
import { Skeleton } from "@/components/ui/skeleton";

interface IUser {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  studentMajor: string;
  phoneNumber: string;
  isAccountLocked: boolean;
  role: "client" | "admin";
  createdAt: Date;
}

export default function UsersPage() {
  const { statusData } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const query = searchParams.get("search-query") || "";

  const {
    data: users,
    isPending,
    isRefetching,
    refetch,
    isError,
  } = useQuery({
    queryKey: ["USERS", query],
    queryFn: async () => await getAllUsers(query),
    refetchOnWindowFocus: false,
  });

  const [search, setSearch] = useState<string>(query || "");

  useEffect(() => {
    const delayDebounceFN = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "search-query",
          value: search,
        });

        router.push(newUrl);
      } else {
        if (pathname.includes("/admin/user") && query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["search-query"],
          });

          router.push(newUrl);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFN);
  }, [pathname, query, router, search, searchParams]);

  useEffect(() => {
    if (!query) {
      refetch();
    }
  }, [query, refetch]);

  if (isError) {
    return (
      <div className="w-full h-[90vh] flex flex-col items-center justify-center bg-neutral-900 text-white px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold mb-4">😵‍💫</h1>
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm text-neutral-300 mb-6">
            {`We couldn’t load the data. It might be a network issue or an
            internal error.`}
          </p>
          <button
            onClick={() => refetch()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-all rounded-md text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="w-full h-screen p-4 flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-white font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-white font-semibold text-2xl flex justify-between items-center">
        <h1>Users</h1>
      </div>
      <div className="w-full flex items-center justify-between text-white">
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative">
            <SearchNormal1
              className="absolute top-[9px] left-4"
              size="17"
              color="#FFFFFF"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for a user"
              autoComplete="off"
              className="h-9 w-full bg-transparent border border-neutral-800 focus:border-neutral-100 rounded-3xl pl-14 text-sm font-normal outline-none transition-all hover:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "linear" }}
        key={"usersMap"}
        className="w-full overflow-y-auto flex flex-col gap-4"
      >
        {isPending ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="w-full relative rounded-md flex flex-col items-center justify-center gap-y-4 p-4 border border-neutral-700"
              >
                <Skeleton className="z-30 absolute right-2.5 top-2.5 rounded-2xl bg-neutral-700 size-8" />
                <div className="flex flex-col items-center justify-center gap-y-3">
                  <div className="size-11 flex-shrink-0">
                    <Skeleton className="w-full h-full rounded-full bg-neutral-700" />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-y-1">
                    <Skeleton className="w-28 h-4 rounded-md bg-neutral-700" />
                    <Skeleton className="w-36 h-4 rounded-md bg-neutral-700" />
                  </div>
                </div>
                <div className="w-full h-px bg-white/10" />
                <div className="w-full flex flex-col items-center gap-1">
                  <Skeleton className="w-24 h-4 rounded-md bg-neutral-700" />
                  <Skeleton className="w-32 h-4 rounded-md bg-neutral-700" />
                </div>
              </div>
            ))}
          </div>
        ) : isRefetching ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 text-white">
              <svg
                className="animate-spin h-10 w-10 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <p className="text-sm text-neutral-300 animate-pulse">
                Loading users...
              </p>
            </div>
          </div>
        ) : users && users.length > 0 ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {users.map((user: IUser) => (
              <UserCard
                key={user.id}
                userId={user.id}
                loggedInUserId={statusData?.id}
                username={user.username}
                userFullName={`${user.firstName} ${user.lastName}`}
                userEmail={user.email}
                studentMajor={user.studentMajor}
                isAccountLocked={user.isAccountLocked}
                phoneNumber={user.phoneNumber}
                role={user.role}
                joinInDate={formatDateWithYear(new Date(user.createdAt))}
              />
            ))}
          </div>
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>No Users Are Available...</p>
          </div>
        )}
      </motion.div>
    </section>
  );
}
