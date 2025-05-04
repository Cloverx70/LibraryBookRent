import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
}

export async function BookABook(Data: { BookId: string; UserId: string }) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      `booking/book`,
      Data,
      { withCredentials: true }
    );

    if (res.status !== 201)
      throw new Error(res.data.message || "error retrieving book");

    return res.data ?? undefined;
  } catch (error) {
    handleError(error);
  }
}
