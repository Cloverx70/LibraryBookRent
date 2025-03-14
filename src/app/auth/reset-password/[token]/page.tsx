"use client";

import Input from "@/app/components/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { verifyResetPassword } from "../../actions";
import { useEffect, useState } from "react";
import toaster from "@/app/components/toaster";

const VerifyResetPasswordSchema = z
  .object({
    newpassword: z
      .string()
      .min(8, "New Password must be at least 8 characters long"),
    confirmnewpassword: z
      .string()
      .min(8, "Confirm New Password must be at least 8 characters long"),
  })
  .refine((data) => data.newpassword === data.confirmnewpassword, {
    message: "Passwords do not match",
    path: ["NewPassword"],
  });

export default function VerifyRequestResetPasswordPage() {
  type VerifyResetPasswordInputs = z.infer<typeof VerifyResetPasswordSchema>;

  const router = useRouter();

  const { token } = useParams();

  const safeToken: string = Array.isArray(token) ? token[0] : token ?? "";

  useEffect(() => {
    if (safeToken.length < 100) router.replace("/");
  }, [safeToken, router]);

  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const FormData = useForm<VerifyResetPasswordInputs>({
    resolver: zodResolver(VerifyResetPasswordSchema),
    defaultValues: {
      newpassword: "",
      confirmnewpassword: "",
    },
  });

  const { mutate: mutateVerifyPasswordReset } = useMutation({
    mutationKey: ["VERIFYRESETPASSWORD"],
    mutationFn: (data: VerifyResetPasswordInputs) =>
      verifyResetPassword(safeToken, data.newpassword, data.confirmnewpassword),
    onError: (e) => {
      FormData.reset({ newpassword: "", confirmnewpassword: "" });
      toaster("Error Reset Password", e.message);
    },
    onSuccess: (data) => {
      router.push("/auth/login");
      toaster("Password Reset Successfully", data?.message);
    },
  });

  const newPasswordValue = FormData.watch("newpassword");
  const confirmNewPasswordValue = FormData.watch("confirmnewpassword");

  return (
    <section className=" w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className=" w-full h-[40%] 2xl:w-[45%] xl:w-[45%] lg:w-[55%] md:w-[65%] sm:w-full sm:rounded-none bg-white rounded-lg shadow-lg p-6 ">
        <Form {...FormData}>
          <form
            className="w-full h-full flex flex-col items-center justify-between"
            onSubmit={FormData.handleSubmit((data) =>
              mutateVerifyPasswordReset(data)
            )}
          >
            <div className="w-full font-semibold">
              <h1 className=" text-xl 2xl:text-2xl xl:text-2xl lg:text-2xl md:text-2xl sm:text-2xl">
                Reset your <span className=" text-customYellow">password</span>
              </h1>
              <h4 className=" text-sm 2xl:text-base xl:text-base lg:text-base md:text-base sm:text-base">
                Please fill the following form to reset your password.
              </h4>
            </div>
            <div className="w-full flex flex-col gap-4">
              <div className="relative">
                <FormField
                  control={FormData.control}
                  name="newpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type={showPassword.newPassword ? "text" : "password"}
                          label="New Password"
                        />
                      </FormControl>
                      <FormMessage>
                        {FormData.formState.errors.newpassword?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                ></FormField>

                {newPasswordValue && (
                  <button
                    className="absolute top-3 right-3 text-gray-500"
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        newPassword: !showPassword.newPassword,
                      })
                    }
                  >
                    {showPassword.newPassword ? "hide" : "show"}
                  </button>
                )}
              </div>
              <div className="relative">
                <FormField
                  control={FormData.control}
                  name="confirmnewpassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          {...field}
                          type={
                            showPassword.confirmPassword ? "text" : "password"
                          }
                          label="Confirm New Password"
                        />
                      </FormControl>
                      <FormMessage>
                        {FormData.formState.errors.confirmnewpassword?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                ></FormField>
                {confirmNewPasswordValue && (
                  <button
                    className="absolute top-3 right-3 text-gray-500"
                    type="button"
                    onClick={() =>
                      setShowPassword({
                        ...showPassword,
                        confirmPassword: !showPassword.confirmPassword,
                      })
                    }
                  >
                    {showPassword.confirmPassword ? "hide" : "show"}
                  </button>
                )}
              </div>
            </div>
            <Button type="submit" className=" bg-customYellow w-full mt-4">
              Confirm Reset
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
