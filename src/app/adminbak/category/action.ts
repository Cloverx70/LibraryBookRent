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
