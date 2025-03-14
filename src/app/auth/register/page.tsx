"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import Input from "@/app/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { register } from "../actions";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import toaster from "@/app/components/toaster";
import { useRouter } from "next/navigation";
import { useState } from "react";
const majors = ["Computer Science", "Business", "Engineering"] as const;

const registerSchema = z
  .object({
    username: z.string().nonempty("Username is required"),
    firstname: z.string().nonempty("First name is required"),
    lastname: z.string().nonempty("Last name is required"),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    password: z
      .string()
      .min(8, "Minimum password length is 8 characters")
      .nonempty("Password is required"),
    confirmpassword: z.string(),
    studentMajor: z.enum(majors),
    address: z.string().nonempty("Address is required"),
  })
  .refine((data) => data.password === data.confirmpassword, {
    message: "Passwords do not match",
    path: ["confirmpassword"],
  });

export default function RegisterPage() {
  type RegisterFormInputs = z.infer<typeof registerSchema>;
  const router = useRouter();

  const [showPassword, setshowPassword] = useState({
    password: false,
    confirmPassword: false,
  });

  const FormData = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      firstname: "",
      lastname: "",
      email: "",
      password: "",
      confirmpassword: "",
      studentMajor: "Business",
      address: "",
    },
  });

  const { mutate: mutateRegister } = useMutation({
    mutationKey: ["REGISTER"],
    mutationFn: (data: RegisterFormInputs) =>
      register(
        data.firstname,
        data.lastname,
        data.email,
        data.password,
        data.username,
        data.studentMajor
      ),
    onError: (e) => {
      const errorMessage =
        e instanceof Error ? e.message : "Something went wrong.";

      FormData.reset();
      toaster("Failed Register", errorMessage);
    },
    onSuccess: () => {
      router.push("/auth/login");
      toaster("Successful Register", "Please login now");
    },
  });

  const PasswordValue = FormData.watch("password");
  const ConfirmPasswordValue = FormData.watch("confirmpassword");

  return (
    <section className="w-full h-screen bg-gray-100 flex items-center justify-center ">
      <div className="w-full h-auto 2xl:w-[60%] xl:w-[60%] lg:w-[60%] md:w-[65%] sm:w-full mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col justify-between">
        <div>
          <h1 className="text-xl 2xl:text-3xl xl:text-3xl lg:text-3xl md:text-2xl sm:text-2xl font-bold">
            Welcome to <span className="text-customYellow">Liu Library.</span>
          </h1>
          <h4 className="text-sm 2xl:text-lg xl:text-lg lg:text-lg md:text-base sm:text-base font-bold mb-4">
            Register now to continue
          </h4>
        </div>
        <Form {...FormData}>
          <form
            onSubmit={FormData.handleSubmit((data) => mutateRegister(data))}
            className="w-full h-auto flex flex-col gap-5"
          >
            <div className=" w-full h-auto flex flex-col gap-4">
              <div className=" w-full h-auto flex gap-4">
                <div className=" w-1/2 h-auto flex flex-col gap-4  ">
                  <FormField
                    control={FormData.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            label="firstname"
                            placeholder="Enter your first name"
                          />
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.firstname?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormData.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your username"
                            label="username"
                          />
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.username?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={FormData.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="email"
                            {...field}
                            label="email"
                            placeholder="Enter your email"
                          />
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.email?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
                <div className=" w-1/2 h-auto flex flex-col gap-4  ">
                  <FormField
                    control={FormData.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            label="lastname"
                            placeholder="Enter your last name"
                          />
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.lastname?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={FormData.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className=" relative">
                            <Input
                              type={showPassword.password ? "text" : "password"}
                              {...field}
                              label="password"
                              placeholder="Enter your password"
                            />
                            {PasswordValue && (
                              <button
                                className="absolute top-3 right-3 text-gray-500"
                                type="button"
                                onClick={() =>
                                  setshowPassword({
                                    ...showPassword,
                                    password: !showPassword.password,
                                  })
                                }
                              >
                                {showPassword.password ? "hide" : "show"}
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.password?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={FormData.control}
                    name="confirmpassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <div className=" relative">
                            <Input
                              type={
                                showPassword.confirmPassword
                                  ? "text"
                                  : "password"
                              }
                              {...field}
                              label="confirm password"
                              placeholder="Enter your password"
                            />

                            {ConfirmPasswordValue && (
                              <button
                                className="absolute top-3 right-3 text-gray-500"
                                type="button"
                                onClick={() =>
                                  setshowPassword({
                                    ...showPassword,
                                    confirmPassword:
                                      !showPassword.confirmPassword,
                                  })
                                }
                              >
                                {showPassword.confirmPassword ? "hide" : "show"}
                              </button>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage>
                          {FormData.formState.errors.confirmpassword?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className=" flex flex-col gap-4">
                <FormField
                  control={FormData.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          {...field}
                          label="address"
                          placeholder="Enter your address"
                        />
                      </FormControl>
                      <FormMessage>
                        {FormData.formState.errors.address?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />

                <FormField
                  control={FormData.control}
                  name="studentMajor"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="">
                            <SelectValue placeholder="Select your major" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {majors.map((major) => (
                            <SelectItem key={major} value={major}>
                              {major}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage>
                        {FormData.formState.errors.studentMajor?.message}
                      </FormMessage>
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="flex text-sm 2xl:text-base xl:text-base lg:text-base md:text-base sm:text-base gap-1">
              <p>already have an account?</p>
              <Link
                className=" text-customDarkBlue hover:text-black"
                href={"/auth/login"}
              >
                Log in
              </Link>
            </div>
            <button
              type="submit"
              disabled={FormData.formState.isSubmitting}
              className="w-full h-auto p-2 rounded-md text-white bg-customYellow hover:bg-yellow-400 transition disabled:bg-gray-400"
            >
              {FormData.formState.isSubmitting ? "Registering..." : "Register"}
            </button>
          </form>
        </Form>
      </div>
    </section>
  );
}
