"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ContactUs } from "./action";
import toaster from "@/app/components/toaster";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ContactUsSchema = z.object({
  Email: z.string().email().nonempty(),
  Message: z.string().min(1, "Message is required"),
});

export default function SupportPage() {
  const router = useRouter();

  type ContactUsInputs = z.infer<typeof ContactUsSchema>;

  const ContactUsForm = useForm<ContactUsInputs>({
    resolver: zodResolver(ContactUsSchema),
    defaultValues: {
      Email: "",
      Message: "",
    },
  });

  const { mutate: ContactUsMutate, isPending } = useMutation({
    mutationKey: ["CONTACTUS"],
    mutationFn: (data: { Message: string; Email: string }) => ContactUs(data),
    onSuccess: () => {
      toaster("Success", "Message Sent Successfully");
      router.push("/");
    },
    onError: (e) => {
      toaster("Error", e.message);
      ContactUsForm.reset({ Email: "", Message: "" });
    },
  });

  return (
    <section className="max-h-screen  flex flex-col">
      <Breadcrumb>
        <BreadcrumbList className="text-neutral-800 p-6 font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/support">Support</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" flex flex-col items-center justify-center">
        <div className="w-full bg-neutral-900 p-6 flex items-center justify-center shadow-md border border-neutral-700">
          <div className=" w-1/2 flex flex-col  ">
            <h1 className="text-2xl font-semibold text-center mb-6 text-white">
              Contact Us
            </h1>
            <Form {...ContactUsForm}>
              <form
                onSubmit={ContactUsForm.handleSubmit((data) =>
                  ContactUsMutate(data)
                )}
                className="flex flex-col gap-4"
              >
                <FormField
                  name="Email"
                  control={ContactUsForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-white">
                        Email
                      </FormLabel>
                      <FormControl>
                        <input
                          className="w-full h-8 px-3 text-sm rounded-lg bg-neutral-800 text-white border border-dashed border-gray-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                          {...field}
                          type="email"
                          placeholder="your@email.com"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="Message"
                  control={ContactUsForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm text-white">
                        Message
                      </FormLabel>
                      <FormControl>
                        <textarea
                          rows={5}
                          placeholder="Write your message here..."
                          className="w-full px-3 py-2 text-sm rounded-lg bg-neutral-800 text-white border border-dashed border-gray-500 focus:outline-none focus:ring-2 focus:ring-neutral-500"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <Button
                    disabled={isPending}
                    className="bg-white text-black hover:bg-gray-200 w-32 h-8 text-sm font-semibold disabled:bg-neutral-400"
                  >
                    Send
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
