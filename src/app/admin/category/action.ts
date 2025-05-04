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

interface Category {
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
        res.data.message || "Somthing went worng while creating book"
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
        res.data.message || "Somthing went worng while creating book"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function GetAllBooksForCategoryCreation() {
  try {
    const res = await axiosInstance.get("book/get-all");
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while getting books"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function CreateCategory(data: Category) {
  try {
    const res = await axiosInstance.put(`category/create`, data, {
      withCredentials: true,
    });

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while creating category"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function UpdateCategory(id: string, data: Category) {
  try {
    const res = await axiosInstance.put(`category/update/${id}`, data, {
      withCredentials: true,
    });

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while updating category"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}

export async function DeleteCategory(id: string) {
  try {
    const res = await axiosInstance.put(`category/delete/${id}`, {
      withCredentials: true,
    });

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while updating category"
      );

    return res.data?.data || null;
  } catch (error) {
    handleError(error);
  }
}
