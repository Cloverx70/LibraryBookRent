import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
}

export async function ContactUs(data: { Email: string; Message: string }) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      `auth/contact-us`,
      data,
      { withCredentials: true }
    );
    if (res.status !== 201)
      throw new Error(
        res.data.message || "Something went wrong while sending the message"
      );

    return res.data || null;
  } catch (error) {
    handleError(error);
  }
}
