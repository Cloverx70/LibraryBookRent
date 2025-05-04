"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import toaster from "@/app/components/toaster";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { GetAllBooksForCategoryCreation } from "../action";
import { book } from "@/app/components/bookCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { z } from "zod";

const CategorySchema = z.object({
  Name: z
    .string()
    .trim()
    .nonempty("Title field cannot be empty")
    .min(1, "Name is required")
    .max(100, "Name must be at most 100 characters"),
  Description: z
    .string()
    .trim()
    .max(500, { message: "Description should be at most 500 characters long" })
    .optional(),
  BookIds: z.array(z.string()).optional(),
});

export default function AddCategoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: books } = useQuery({
    queryKey: ["BOOKS"],
    queryFn: () => GetAllBooksForCategoryCreation(),
    refetchOnWindowFocus: false,
  });

  type CategoryFormInputs = z.infer<typeof CategorySchema>;

  const form = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      Name: "",
      Description: "",
      BookIds: [],
    },
  });

  const { mutate: createCategoryMutation, isPending } = useMutation({
    mutationFn: async (data: CategoryFormInputs) => {
      // await createCategory(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });

      toaster("Success", "Category created successfully");
      form.reset();
      router.push("/admin/category");
    },
    onError: (error) => {
      toaster(
        "Error creating cateogry",
        error.message || "Something went wrong"
      );
    },
  });

  const selectedBooks = form.watch("BookIds");

  const toggleBookId = (book: book) => {
    if (book.availableCopies <= 0) {
      toaster("Book Unavailable", "This book is not available for selection");
      return;
    }

    const current = form.getValues("BookIds") || [];
    const updated = current.includes(book.id)
      ? current.filter((bookId) => bookId !== book.id)
      : [...current, book.id];

    form.setValue("BookIds", updated, { shouldValidate: true });
  };

  return (
    <section className="w-full h-screen p-5 flex flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList className="text-white font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/book">Book</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="text-white font-semibold text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl">
        Add Category
      </div>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "linear" }}
        className="w-full h-full flex justify-center items-start overflow-y-auto text-white"
      >
        <div className="w-full p-6 rounded-lg">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) =>
                createCategoryMutation(data)
              )}
              className="space-y-4 w-full"
            >
              <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-4">
                <div className="w-full flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name="Name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Name</FormLabel>
                        <FormControl>
                          <input
                            className="w-full text-sm h-12 px-2 outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="Description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Description</FormLabel>
                        <FormControl>
                          <textarea
                            rows={7}
                            className="w-full resize-none text-sm p-2 outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="w-px h-[292px] border border-dashed border-gray-600 hidden lg:block" />
                <div className="w-full">
                  {books && books.length > 0 ? (
                    <FormField
                      control={form.control}
                      name="BookIds"
                      render={() => (
                        <FormItem>
                          <FormLabel className="text-xs">Books</FormLabel>
                          <FormControl>
                            <ScrollArea className="w-full h-64 p-2 pr-3 rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 border border-dashed border-gray-500 hover:border-gray-400">
                              <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 text-sm text-white">
                                {books.map((book: book) => {
                                  const isSelected = selectedBooks?.includes(
                                    book.id
                                  );

                                  return (
                                    <div
                                      key={book.id}
                                      onClick={() => toggleBookId(book)}
                                      className={cn(
                                        "w-full h-[235px] p-1 flex flex-col items-center justify-center pt-2 rounded-lg transition-all cursor-pointer",
                                        {
                                          "bg-green-700 hover:bg-green-600":
                                            isSelected,
                                          "bg-neutral-700 hover:bg-neutral-600":
                                            !isSelected,
                                        }
                                      )}
                                    >
                                      <div className="relative w-full h-full rounded-lg">
                                        <Image
                                          src={book.bookPictureUrl || ""}
                                          alt="pic"
                                          className="object-cover object-center rounded-lg"
                                          fill
                                        />
                                      </div>
                                      <div className="flex flex-col items-center justify-center">
                                        <h1 className="font-semibold text-xs truncate text-center w-[80%]">
                                          {book.title}
                                        </h1>
                                        <h3 className="text-xs">
                                          {book.availableCopies > 0
                                            ? "Available"
                                            : "UnAvailable"}
                                        </h3>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <div className="w-full py-4 lg:py-0 lg:h-[200px] flex items-center justify-center">
                      <p className="text-sm ">
                        No Books available at this moment
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                disabled={isPending}
                className="w-32 h-8 text-xs bg-neutral-800 hover:bg-neutral-700 "
              >
                {isPending ? <Loader2 className="animate-spin" /> : "Create"}
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
}
