"use client";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import React, { createContext, useContext, ReactNode } from "react";
import { axiosInstance } from "../lib/axios.instance";
import { handleError } from "../utils/methods.utils";
import { book } from "../components/bookCard";

interface statusData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  username: string;
  studentMajor: string | null;
  role: "client" | "admin";
  address: string;
  createdAt: string;
  updatedAt: string;
  pendingRentals: book[];
  approvedRentals: book[];
  declinedRentals: book[];
}

interface Response {
  message: string;
  user: statusData;
}

interface UserContextType {
  statusData?: statusData;
  isPending: boolean;
}

export async function getStatus(): Promise<statusData | undefined> {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      "auth/status",
      {
        withCredentials: true,
      }
    );

    if (res.status !== 200 || !res.data.user) {
      throw new Error(
        res.data.message || "Something went wrong while authenticating"
      );
    }

    return res.data.user;
  } catch (error) {
    handleError(error);
    return undefined;
  }
}

const UserContext = createContext<UserContextType>({
  statusData: undefined,
  isPending: true,
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const { data: statusData, isLoading: isPending } = useQuery<
    statusData | undefined
  >({
    queryKey: ["STATUS"],
    queryFn: getStatus,
    staleTime: 60000,
    retry: 0,
    refetchOnWindowFocus: true,
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
