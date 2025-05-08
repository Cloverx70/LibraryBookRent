import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
}

interface AllResponse {
  message: string;
  data?: Review[];
}
export interface Review {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  reviewText: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function CreateReview(Data: {
  BookId: string;
  UserId: string;
  Rating: number;
  ReviewText: string;
}) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      `review/create`,
      Data,
      { withCredentials: true }
    );

    if (res.status !== 201)
      throw new Error(res.data.message || "error creating review");

    return res.data ?? undefined;
  } catch (error) {
    handleError(error);
  }
}

export async function GetBookReviews(BookId: string) {
  try {
    const res: AxiosResponse<AllResponse> = await axiosInstance.get(
      `review/get/${BookId}`
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving reviews");

    return res.data.data ?? undefined;
  } catch (error) {
    handleError(error);
  }
}
