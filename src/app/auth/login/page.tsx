"use client";

import Input from "@/app/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import React, { useState } from "react";
import { login } from "../actions";
import { useRouter } from "next/navigation";
import toaster from "@/app/components/toaster";
import { useMutation } from "@tanstack/react-query";
import Link from "next/link";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch, // to watch the password input value
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const { mutate: loginMutate } = useMutation({
    mutationKey: ["LOGIN"],
    mutationFn: async (data: LoginFormInputs) =>
      await login(data.email, data.password),
    onError: (e: unknown) => {
      const errorMessage =
        e instanceof Error ? e.message : "Something went wrong.";

      setValue("password", "");
      toaster("Failed Login", errorMessage);
    },
    onSuccess: () => {
      router.push("/");
      toaster("Successful Login", "Welcome back");
    },
  });

  const passwordValue = watch("password");

  return (
    <section className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="h-[45%] w-full 2xl:w-[40%] xl:w-[40%] lg:w-[45%] md:w-[90%] sm:w-full sm:rounded-none p-6 flex-col gap-6 flex border rounded-lg shadow-lg bg-white overflow-hidden">
        <div className="font-semibold">
          <h1 className=" text-2xl sm:text-3xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl ">
            Welcome to <span className="text-customYellow">Liu Library.</span>
          </h1>
          <h4 className="text-base">Please log in to continue...</h4>
        </div>
        <form
          onSubmit={handleSubmit((data) => loginMutate(data))}
          className="flex flex-col flex-1 justify-between gap-4"
        >
          <div className="w-full h-auto flex flex-col gap-5">
            <div>
              <Input type="email" label="Email" {...register("email")} />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                label="Password"
                {...register("password")}
              />
              {passwordValue && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="w-full text-sm sm:text-base md:text-base lg:text-base xl:text-base 2xl:text-base flex justify-between">
              <Link href={"/auth/reset-password"}>forgot password?</Link>
              <div className="flex gap-1">
                <p>new?</p>
                <Link
                  href={"/auth/register"}
                  className="text-customDarkBlue hover:text-black"
                >
                  Register now
                </Link>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-customYellow text-white py-2 rounded-md hover:bg-yellow-400 transition disabled:bg-gray-400"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </section>
  );
}
