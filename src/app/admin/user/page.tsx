"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { GetAllUsers } from "./action";
import { useUserContext } from "@/app/contexts/userContext";
import { motion } from "framer-motion";

export default function AdminUsersPage() {
  const router = useRouter();
  const { statusData } = useUserContext();
  const {
    data: UsersData,
    isLoading,
    isPending,
  } = useQuery({ queryKey: ["USERS"], queryFn: () => GetAllUsers() });

  if (isLoading || isPending)
    return (
      <section className="w-full h-screen p-4 flex flex-col gap-4 animate-pulse">
        <div className="h-5 w-32 bg-neutral-800 rounded" />
        <div className="h-8 w-40 bg-neutral-800 rounded self-end" />
        <div className="h-6 w-64 bg-neutral-800 rounded" />

        <div className="grid grid-flow-col gap-5 justify-start">
          {Array.from({ length: 4 }).map((_, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="w-44 h-40 p-4 bg-neutral-800 flex flex-col items-center justify-between rounded"
            >
              <div className="h-4 w-24 bg-neutral-700 rounded" />
              <div className="h-8 w-32 bg-neutral-700 rounded mt-2" />
              <div className="h-3 w-16 bg-neutral-700 rounded mt-4" />
            </motion.div>
          ))}
        </div>
      </section>
    );

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
      <div></div>

      <div className=" w-full">
        <p className=" text-white text-xl font-semibold">
          {UsersData ? UsersData?.length : 0} Users found :
        </p>
      </div>
      <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-start gap-5 justify-items-center ">
        {UsersData && UsersData.length > 0 ? (
          UsersData.map((user, index) => {
            return (
              <div
                key={user.id || index}
                onClick={() => router.push(`/admin/user/${user.id}`)}
                className=" w-44 h-40 p-4 cursor-pointer bg-neutral-800 flex flex-col items-center justify-center gap-2 text-white "
              >
                <div className=" w-full flex flex-col items-center justify-center ">
                  {statusData?.id == user.id && <p className=" text-xs">Me</p>}

                  <h1 className=" font-bold ">{user.username}</h1>
                  <p className=" line-clamp-2 text-center text-xs">
                    {user.firstName + " " + user.lastName}
                  </p>
                </div>
                <p className=" text-xs">
                  {user.approvedRentals &&
                    user.approvedRentals.length >= 0 &&
                    user.approvedRentals.length}{" "}
                  Books Rented
                </p>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>No Users Are Available...</p>
          </div>
        )}
      </div>
    </section>
  );
}
