"use client";

import React from "react";
import { useUserContext } from "@/app/contexts/userContext";
import { formatDateWithYear } from "../(admin_utils)/utils";

const ProfilePage: React.FC = () => {
  const { statusData, isPending } = useUserContext();

  const {
    firstName,
    lastName,
    email,
    phoneNumber,
    username,
    studentMajor,
    role,
    createdAt,
  } = statusData || {};

  const fullName = `${firstName} ${lastName}`;

  if (isPending) {
    return (
      <div className="w-full h-[85vh] flex items-center justify-center">
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
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!statusData) {
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
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-all rounded-md text-sm font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mr-auto p-12 flex flex-col gap-y-6">
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-full bg-violet-600 flex items-center justify-center text-white text-2xl font-bold">
          {firstName?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white">{fullName}</h1>
          <p className="text-sm text-neutral-400">@{username}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white text-sm">
        <ProfileItem label="Email" value={email} />
        <ProfileItem
          label="Phone Number"
          value={phoneNumber || "Not Provided"}
        />
        <ProfileItem
          label="Role"
          value={
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                role === "admin"
                  ? "bg-yellow-300/20 text-yellow-300"
                  : "bg-blue-400/20 text-blue-300"
              }`}
            >
              {role && role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          }
        />
        <ProfileItem
          label="Student Major"
          value={studentMajor || "Not Provided"}
        />
        <ProfileItem
          label="Joined"
          value={formatDateWithYear(new Date(createdAt!))}
        />
      </div>
    </div>
  );
};

const ProfileItem: React.FC<{
  label: string;
  value: string | React.ReactNode;
}> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-neutral-400 text-xs font-medium uppercase tracking-wider">
      {label}
    </p>
    <div className="text-neutral-200 font-normal break-all">{value}</div>
  </div>
);

export default ProfilePage;
