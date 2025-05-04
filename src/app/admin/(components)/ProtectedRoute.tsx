"use client";

import React from "react";
import { useUserContext } from "@/app/contexts/userContext";
import LoadingState from "./LoadingState";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { statusData, isPending } = useUserContext();

  if (isPending) {
    return <LoadingState />;
  }

  if (!statusData || statusData.role !== "admin") {
    window.location.href = "/";
    return;
  }

  return children;
};

export default ProtectedRoute;
