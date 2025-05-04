"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ArrowRight2 } from "iconsax-react";
import { Loader2 } from "lucide-react";
import toaster from "@/app/components/toaster";
import UserPageManagement from "../../(components)/UserPageManagement";

const UserManagePage: React.FC = () => {
  const { uid: userId } = useParams();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);

  const {
    data: user,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["USER_RENTALS", userId],
    queryFn: async () => await getUserRentalsById(userId),
    enabled: !!userId,
  });

  const { mutate: deleteUserMutation, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      // await deleteUser(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["USERS"],
      });

      toaster("Success", "User permanently deleted successfully");
      router.push("/admin/user");
    },
    onError: (error) => {
      toaster("Error deleting user", error.message || "Something went wrong");
    },
  });

  if (isError || !user) {
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
    <section className="w-full h-screen p-4 flex flex-col gap-4 overflow-y-auto">
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
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/user">Users</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full text-white font-semibold flex justify-between items-center">
        <p className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl capitalize">
          {`${user.firstName} ${user.lastName}'s Page`}
        </p>
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className=" w-auto px-5 h-7 text-xs  flex items-center justify-center  bg-red-900 hover:bg-red-950  rounded-sm transition-colors duration-100 ease-linear font-normal">
              Delete Account
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className=" bg-neutral-900 text-white w-1/2 border-none px-10"
            >
              <DialogHeader>
                <DialogTitle className=" text-2xl">
                  Are you absolutely sure?
                </DialogTitle>
                <DialogDescription className=" text-base">
                  This action cannot be undone. This will permanently delete
                  this Account and remove his data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => deleteUserMutation()}
                    className="w-44 h-8 bg-neutral-800 hover:bg-neutral-700 "
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {isPending ? (
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
              Getting user details...
            </p>
          </div>
        </div>
      ) : (
        <UserPageManagement
          isPending={isPending}
          pendingRentals={user.pendingRentals}
          approvedRentals={user.approvedRentals}
          declinedRentals={user.declinedRentals}
        />
      )}
    </section>
  );
};

export default UserManagePage;
