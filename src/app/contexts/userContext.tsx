"use client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { createContext, useContext, ReactNode } from "react";
import { axiosInstance } from "../lib/axios.instance";
import { handleError } from "../utils/methods.utils";

interface statusData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  username: string;
  studentMajor: string | null;
  role: "client" | "admin";
  createdAt: string;
  updatedAt: string;
}

interface Response {
  message: string;
  data: statusData;
}

interface UserContextType {
  statusData: statusData;
  isPending: boolean;
}

const defaultStatusData: statusData = {
  id: "",
  firstName: "Guest",
  lastName: "",
  email: "",
  phoneNumber: null,
  username: "guest",
  studentMajor: null,
  role: "client",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export async function getStatus(): Promise<statusData> {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      "auth/status",
      {
        withCredentials: true,
      }
    );

    if (res.status !== 200 || !res.data.data) {
      throw new Error(
        res.data.message || "Something went wrong while authenticating"
      );
    }

    return res.data.data;
  } catch (error) {
    handleError(error);
    return defaultStatusData;
  }
}

const UserContext = createContext<UserContextType>({
  statusData: defaultStatusData,
  isPending: true,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: statusData = defaultStatusData, isLoading: isPending } =
    useQuery<statusData>({
      queryKey: ["STATUS"],
      queryFn: getStatus,
      staleTime: 60000,
      retry: 0,
    });

  return (
    <UserContext.Provider value={{ statusData, isPending }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = (): UserContextType => {
  return useContext(UserContext);
};
