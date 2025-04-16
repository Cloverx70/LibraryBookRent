import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

// interface Response {
//   message: string;
//   data?: Category;
// }

interface AllResponse {
  message: string;
  data?: { values: Category[] };
}

interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
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

    return res.data?.data?.values || null;
  } catch (error) {
    handleError(error);
  }
}
