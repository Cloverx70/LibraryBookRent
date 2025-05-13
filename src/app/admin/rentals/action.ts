import { User } from "@/app/(root)/profile/action";
import { book } from "@/app/components/bookCard";
import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

export interface Rental {
  id: string;
  user: User;
  book: book;
  borrowedAt?: string | null;
  returnDueDate?: string | null;
  returnedAt?: string | null;
  status?: string | null;
  createdAt: Date;
}

interface Response {
  message: string;
  data?: Rental;
}

interface AllResponse {
  message: string;
  data?: Rental[];
}

export async function approveRental(rid: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.put(
      `booking/approve/${rid}`,
      {},
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving rental");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}

export async function declineRental(rid: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.put(
      `booking/decline/${rid}`,
      {},
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving rental");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}

export async function returnRental(rid: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.put(
      `booking/return/${rid}`,
      {},
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving rental");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getRentalById(id: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      `booking/get/${id}`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving rental");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}

export async function getAllRentals(query?: string) {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.get(
      query ? `booking/get-all?query=${query}` : `booking/get-all?query=`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving rentals");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}
