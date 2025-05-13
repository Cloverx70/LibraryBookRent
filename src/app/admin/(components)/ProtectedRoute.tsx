"use client";

import React from "react";
import { useUserContext } from "@/app/contexts/userContext";

const ProtectedRoute: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { statusData, isPending } = useUserContext();

  if (isPending) {
    return <p>loading</p>;
  }

  if (!statusData || statusData.role !== "admin") {
    window.location.href = "/";
    return;
  }

  return children;
};

export default ProtectedRoute;
