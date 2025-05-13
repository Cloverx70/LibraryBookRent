import { book } from "@/app/components/bookCard";
import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  username: string;
  studentMajor: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  pendingRentals: book[];
  approvedRentals: book[];
  declinedRentals: book[];
}

interface Response {
  message: string;
  data?: User;
}

interface AllResponse {
  message: string;
  data?: User[];
}

export async function GetAllUsers() {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.get(
      "auth/get-all",
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while retrieving users"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function GetUserById(id: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      `auth/get/${id}`,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while retrieving user"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function LockUserById(id: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.put(
      `auth/lock/${id}`,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while locking user"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function DeleteUserById(id: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.delete(
      `auth/delete/${id}`,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while locking user"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}
