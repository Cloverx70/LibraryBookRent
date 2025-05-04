import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
}

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  username: string;
  studentMajor: string | null;
  address: string | null;
}

export async function UpdateAccount(data: User) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      `auth/update`,
      data,
      { withCredentials: true }
    );
    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while updating the account"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}
