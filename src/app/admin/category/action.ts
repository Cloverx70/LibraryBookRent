import { book } from "@/app/components/bookCard";
import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
  data?: Category;
}

interface AllResponse {
  message: string;
  data?: Category[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  books: book[];
}

export async function GetCategoryById(id: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      `category/get/${id}`
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while retrieving category"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function GetAllCategories() {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.get(
      "category/get-all"
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while retrieving categories"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function UpdateCategoryById(
  id: string,
  data: {
    Name: string;
    Description: string;
    KeptBookIds: string[];
    NewBookIds: string[];
  }
) {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.put(
      `category/update/${id}`,
      data,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while updating category"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function CreateCategory(data: {
  Name: string;
  Description: string;
  BookIds: string[];
}) {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.post(
      `category/create`,
      data,
      { withCredentials: true }
    );
    if (res.status !== 201)
      throw new Error(
        res.data.message || "Somthing went worng while updating category"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function DeleteCategoryById(id: string) {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.delete(
      `category/delete/${id}`,

      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while deleting category"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}
