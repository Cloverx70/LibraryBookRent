import React, { useState } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

const UserCard: React.FC<{
  userId: string;
  loggedInUserId: string | undefined;
  username: string;
  userFullName: string;
  userEmail: string;
  studentMajor: string;
  phoneNumber: string;
  isAccountLocked: boolean;
  role: "client" | "admin";
  joinInDate: string;
}> = ({
  userId,
  loggedInUserId,
  username,
  userFullName,
  userEmail,
  studentMajor,
  phoneNumber,
  isAccountLocked,
  role,
  joinInDate,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  type InfoItem = {
    label: string;
    value: string | React.ReactNode;
  };

  const infoItems: (InfoItem | null)[] = [
    { label: "Email", value: userEmail },
    { label: "Username", value: `@${username}` },
    phoneNumber ? { label: "Phone", value: phoneNumber } : null,
    studentMajor
      ? {
          label: "Major",
          value: (
            <span className="inline-block text-xs font-medium text-purple-300 bg-purple-600/10 border border-purple-600/40 px-2 py-0.5 rounded-md">
              {studentMajor}
            </span>
          ),
        }
      : null,
    {
      label: "Status",
      value: (
        <span
          className={cn(
            "inline-block text-xs font-semibold px-2 py-0.5 rounded-md w-fit",
            isAccountLocked
              ? "bg-red-600/20 text-red-300 border border-red-500/30"
              : "bg-green-600/20 text-green-300 border border-green-500/30"
          )}
        >
          {isAccountLocked ? "Locked" : "Active"}
        </span>
      ),
    },
    {
      label: "Role",
      value: (
        <span
          className={cn(
            "inline-block text-xs font-semibold px-2 py-0.5 rounded-md w-fit",
            role === "admin"
              ? "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          )}
        >
          {role === "admin" ? "Administrator" : "Client"}
        </span>
      ),
    },
    {
      label: "Joined",
      value: joinInDate,
    },
  ];

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-full relative overflow-hidden flex flex-col items-center justify-center gap-y-4 rounded-md p-4 bg-white/5 hover:bg-white/15 transition duration-300"
    >
      <div
        className={cn(
          "z-20 absolute inset-0 bg-neutral-500/25 backdrop-blur-[2px] rounded-md flex items-center justify-center transition-all",
          isHovered ? "opacity-100" : "opacity-0"
        )}
      >
        <Link
          href={`/admin/manage/${userId}`}
          className={cn(
            "py-1.5 px-3.5 text-sm font-semibold bg-white/75 text-neutral-800 rounded-sm hover:opacity-85 transition-all",
            {
              "pointer-events-none": !isHovered,
            }
          )}
        >
          Manage
        </Link>
      </div>
      <Dialog onOpenChange={() => setIsHovered(false)}>
        <TooltipProvider delayDuration={0.5}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DialogTrigger asChild>
                <div className="z-30 absolute right-2.5 top-2.5 cursor-pointer hover:opacity-80 transition">
                  <Info size={24} className="text-neutral-300" />
                </div>
              </DialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>More Info</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent
          className="rounded-md max-w-md sm:max-w-lg bg-neutral-800 border-none"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-x-1.5 text-neutral-300 font-semibold">
              {`${userFullName}'s`}
              <p className="text-neutral-50 font-semibold">Details</p>
            </DialogTitle>
          </DialogHeader>
          <div className="w-full h-px bg-neutral-700 mb-4" />
          <div className="flex flex-col gap-2 text-sm text-neutral-200">
            {infoItems
              .filter((item): item is InfoItem => item !== null)
              .map(({ label, value }) => (
                <div
                  key={label}
                  className="flex justify-between items-center gap-2 border-b border-neutral-700/40 pb-1"
                >
                  <span className="text-neutral-400 font-medium">{label}</span>
                  <span className="text-right">{value}</span>
                </div>
              ))}
          </div>
        </DialogContent>
      </Dialog>
      {loggedInUserId == userId && (
        <div className="z-30 absolute -left-5 top-3.5 bg-neutral-50 text-neutral-800 font-semibold text-sm px-8 -rotate-45">
          You
        </div>
      )}
      <div className="flex flex-col items-center justify-center gap-y-3">
        <div className="size-10 flex-shrink-0">
          <div className="w-full h-full flex-shrink-0 flex items-center justify-center rounded-full bg-purple-600 ring-1 ring-purple-600 shadow shadow-white/20">
            <p className="text-white font-semibold text-xl uppercase">
              {userFullName.charAt(0)}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-y-0.5">
          <p className="text-neutral-200 text-sm font-medium line-clamp-1">
            {userFullName}
          </p>
          <p className="text-neutral-400 text-[13px] font-medium line-clamp-1">
            {userEmail}
          </p>
        </div>
      </div>
      <div className="w-full h-px bg-white/10" />
      <div className="w-full flex flex-col items-center gap-1">
        <span className="text-[11px] font-medium text-purple-300 bg-purple-600/10 border border-purple-600/40 px-2 py-0.5 rounded-md">
          {studentMajor}
        </span>
        <div className="text-xs text-neutral-200 font-normal">
          joined in {joinInDate}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
