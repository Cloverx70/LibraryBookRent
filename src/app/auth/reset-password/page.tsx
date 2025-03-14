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
import { useForm } from "react-hook-form";
import { z } from "zod";
import { requestResetPassword } from "../actions";
import toaster from "@/app/components/toaster";
import { useRouter } from "next/navigation";

const PasswordResetSchema = z.object({
  email: z.string().email(),
});

type PasswordResetInputs = z.infer<typeof PasswordResetSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();

  const FormData = useForm<PasswordResetInputs>({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: { email: "" },
  });

  const { mutate: mutateReset } = useMutation({
    mutationKey: ["RESETPASSWORD"],
    mutationFn: (data: PasswordResetInputs) => requestResetPassword(data.email),
    onError: (e) => {
      const errorMessage =
        e instanceof Error ? e.message : "Something went wrong";

      FormData.setValue("email", "");
      toaster("Error Requesting Reset", errorMessage);
    },
    onSuccess: (data) => {
      router.push("/auth/login");
      toaster("Successfully Requested Reset", data?.message);
    },
  });

  return (
    <section className="w-full h-screen bg-gray-100 flex items-center justify-center">
      <div className=" w-full h-[35%] 2xl:w-[40%] xl:w-[40%] lg:w-[50%] md:w-[55%] sm:w-full sm:rounded-none bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center">
        <Form {...FormData}>
          <form
            className="w-full h-full flex flex-col justify-between"
            onSubmit={FormData.handleSubmit((data) => mutateReset(data))}
          >
            <div className=" w-full h-auto font-semibold flex flex-col gap-1 items-start justify-start ">
              <h1 className="  text-xl 2xl:text-3xl xl:text-3xl lg:text-3xl md:text-xl">
                Reset <span className=" text-customYellow"> Password</span>
              </h1>
              <p className=" text-sm 2xl:text-lg xl:text-base lg:text-base md:text-sm">
                Please enter your Email below to reset your password..
              </p>
            </div>

            <FormField
              control={FormData.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input label="Email" {...field} type="email" />
                  </FormControl>
                  <FormMessage>
                    {FormData.formState.errors.email?.message}
                  </FormMessage>
                </FormItem>
              )}
            ></FormField>
            <Button type="submit" className=" bg-customYellow w-full">
              Reset now
            </Button>
          </form>
        </Form>
      </div>
    </section>
  );
}
