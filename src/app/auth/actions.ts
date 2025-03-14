import { AxiosResponse } from "axios";
import { axiosInstance } from "../lib/axios.instance";
import { handleError } from "../utils/methods.utils";

export interface Response {
  message: string;
  data?: string;
}

export async function login(email: string, password: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      "auth/login",
      {
        email,
        password,
      },
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while loggin in"
      );
  } catch (error) {
    handleError(error);
  }
}

export async function register(
  FirstName: string,
  LastName: string,
  Email: string,
  Password: string,
  Username: string,
  StudentMajor: string
) {
  try {
    const res = await axiosInstance.post("auth/register", {
      FirstName,
      LastName,
      Email,
      Password,
      Username,
      StudentMajor,
    });

    if (res.status !== 201)
      throw new Error(
        res.data.message || "Something went wrong while registering"
      );
  } catch (error) {
    handleError(error);
  }
}

export async function requestResetPassword(Email: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      "auth/req-reset-password",
      {
        Email,
      }
    );

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while sending the request"
      );

    return res.data;
  } catch (error) {
    handleError(error);
  }
}

export async function verifyResetPassword(
  Token: string,
  NewPassword: string,
  ConfirmNewPassword: string
) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.post(
      "auth/verify-reset-password",
      {
        Token,
        NewPassword,
        ConfirmNewPassword,
      }
    );

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Something went wrong while verifying the request"
      );

    return res.data;
  } catch (error) {
    handleError(error);
  }
}
