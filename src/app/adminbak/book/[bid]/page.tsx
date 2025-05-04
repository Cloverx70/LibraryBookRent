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
import { z } from "zod";
import { DeleteBookById, getBookById, UpdateBook } from "../action";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import toaster from "@/app/components/toaster";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { book } from "@/app/components/bookCard";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

const BookSchema = z.object({
  Title: z
    .string()
    .nonempty("Title field cannot be empty")
    .min(10, "The title should be at least 10 characters long"),
  Author: z.string().nonempty("Author field cannot be empty"),
  Isbn: z
    .string()
    .min(17, "ISBN length should be exactly 17 characters, including hyphens"),
  File: z
    .custom<File>(
      (file) => {
        if (!file) return true;
        return file instanceof File;
      },
      {
        message: "Invalid file format",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.size < 2 * 1024 * 1024;
      },
      {
        message: "File size must be less than 2MB",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return file.type.startsWith("image/");
      },
      {
        message: "Only image files are allowed",
      }
    )
    .refine(
      (file) => {
        if (!file) return true;
        return ["image/png", "image/jpeg", "image/jpg"].includes(file.type);
      },
      {
        message: "Only PNG, JPEG, and JPG files are allowed",
      }
    ),
  ImageAlreadyExists: z.string(),
  CategoryId: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length === 36, {
      message: "CategoryId should be 36 characters long",
    }),
  TotalCopies: z.number().nonnegative("Minimum total copies is 0"),
  AvailableCopies: z.number().nonnegative("Minimum available copies is 0"),
});

export default function ViewAndEditBookPage() {
  const { bid } = useParams();
  const BookId: string = Array.isArray(bid) ? bid[0] : bid ?? "";

  const { data: BookData, isLoading: isBookLoading } = useQuery<
    book | undefined
  >({
    queryKey: ["BOOK"],
    queryFn: () => getBookById(BookId),
    retry: 0,
    enabled: !!BookId,
  });

  const router = useRouter();
  const client = useQueryClient();

  type BookFormInputs = z.infer<typeof BookSchema>;

  const BookForm = useForm<BookFormInputs>({
    resolver: zodResolver(BookSchema),
    defaultValues: {
      Title: "",
      Author: "",
      Isbn: "",
      File: undefined,
      ImageAlreadyExists: "",
      CategoryId: "",
      TotalCopies: 0,
      AvailableCopies: 0,
    },
  });

  const [ImageAlreadyExists, setImageAlreadyExists] = useState<string | null>(
    ""
  );

  useEffect(() => {
    if (BookData) {
      BookForm.reset({
        Title: BookData.title || "",
        Author: BookData.author || "",
        Isbn: BookData.isbn || "",
        File: undefined,
        ImageAlreadyExists: BookData.bookPictureUrl || "",
        CategoryId: BookData.categoryId || "",
        TotalCopies: BookData.totalCopies || 0,
        AvailableCopies: BookData.availableCopies || 0,
      });
    }
    setImageAlreadyExists(BookForm.watch("ImageAlreadyExists"));
  }, [BookData, BookForm]);

  const { mutate: mutateBook } = useMutation({
    mutationKey: ["UPDATE"],
    mutationFn: (data: BookFormInputs) =>
      UpdateBook(
        BookId,
        data.Title,
        data.Author,
        data.Isbn,
        data.File,
        data.CategoryId || "",
        data.TotalCopies,
        data.AvailableCopies
      ),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["BOOKS"] });
      router.push("/admin/book");
      toaster("Success", "Updated book successfully");
    },
    onError: (e) => {
      BookForm.reset();
      toaster("Error updating book", e.message);
    },
  });

  const { mutate: DeleteBook } = useMutation({
    mutationKey: ["DELETEBOOK"],
    mutationFn: () => DeleteBookById(BookId),
    onError: (e) => toaster("Error deleting book", e.message),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["BOOKS"] });
      router.push("/admin/book");
      toaster("Success", "Deleted book successfully");
    },
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  if (isBookLoading) return <p>Loading ...</p>;

  return (
    <section className="w-full h-screen p-5 flex flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList className="text-white font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="25" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="25" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/book">Book</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full text-white font-semibold flex justify-between items-center">
        <p className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl ">
          Update Book
        </p>
        <div>
          <Dialog>
            <DialogTrigger className=" w-auto px-5 h-7 text-xs  flex items-center justify-center  bg-red-900 hover:bg-red-950  rounded-sm transition-colors duration-100 ease-linear font-normal">
              Delete Book
            </DialogTrigger>
            <DialogContent className=" bg-neutral-900 text-white w-1/2 border-none px-10">
              <DialogHeader>
                <DialogTitle className=" text-2xl">
                  Are you absolutely sure?
                </DialogTitle>
                <DialogDescription className=" text-base">
                  This action cannot be undone. This will permanently delete the
                  book and remove the data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
                    onClick={() => DeleteBook()}
                    className=" w-44 h-8 bg-neutral-800 hover:bg-neutral-700 "
                  >
                    Delete
                  </Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: "linear" }}
        className="w-full h-full flex overflow-y-auto justify-center items-start text-white"
      >
        <div className="w-full p-6 rounded-lg">
          <Form {...BookForm}>
            <form
              onSubmit={BookForm.handleSubmit((data) => mutateBook(data))}
              className="space-y-4"
            >
              <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-4">
                <FormField
                  control={BookForm.control}
                  name="Title"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">Title</FormLabel>
                      <FormControl>
                        <input
                          className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={BookForm.control}
                  name="Author"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">Author</FormLabel>
                      <FormControl>
                        <input
                          className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-4">
                <FormField
                  control={BookForm.control}
                  name="Isbn"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">ISBN</FormLabel>
                      <FormControl>
                        <input
                          className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={BookForm.control}
                  name="CategoryId"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">Category</FormLabel>
                      <FormControl>
                        <input
                          className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row 2xl:flex-row gap-4">
                <FormField
                  control={BookForm.control}
                  name="AvailableCopies"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">
                        Available Copies
                      </FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={BookForm.control}
                  name="TotalCopies"
                  render={({ field }) => (
                    <FormItem className="sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 2xl:w-1/2">
                      <FormLabel className="text-xs">Total Copies</FormLabel>
                      <FormControl>
                        <input
                          type="number"
                          className="w-full h-8 text-sm px-2 outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                          {...field}
                          min="0"
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={BookForm.control}
                name="File"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Image</FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center w-full">
                        {ImageAlreadyExists ? (
                          <div className="w-full h-[250px] relative p-4 flex flex-col items-center justify-center bg-neutral-800 rounded-lg border border-dashed border-gray-500">
                            <Image
                              src={BookForm.watch("ImageAlreadyExists")}
                              alt="Selected File"
                              className=" object-cover object-center z-50"
                              fill
                            />
                            <Button
                              className="absolute z-50 w-full h-full bg-black/15 hover:bg-neutral-700/50"
                              onClick={() => {
                                setImageAlreadyExists(null);
                                field.onChange(undefined);
                              }}
                            >
                              Remove File
                            </Button>
                          </div>
                        ) : selectedFile ? (
                          <div className="w-full h-52 p-4 flex flex-col items-center justify-center bg-neutral-800 rounded-lg border border-dashed border-gray-500">
                            <p className="text-white text-sm">
                              {selectedFile.name}
                            </p>
                            <Button
                              className="mt-2 bg-red-500 hover:bg-red-600"
                              onClick={() => {
                                setSelectedFile(null);
                                field.onChange(undefined);
                              }}
                            >
                              Remove File
                            </Button>
                          </div>
                        ) : (
                          <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-neutral-800 hover:bg-neutral-700 border-gray-500 hover:border-gray-400 transition-colors ease-linear duration-300"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <svg
                                aria-hidden="true"
                                className="w-10 h-10 mb-3 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="M7 16V12M7 12V8M7 12H3M7 12h4M17 16V12M17 12V8M17 12h-4M17 12h4M12 16V12M12 12V8M12 12H8M12 12h4"
                                ></path>
                              </svg>
                              <p className="mb-2 text-sm text-white">
                                <span className="font-semibold">
                                  Click to upload
                                </span>{" "}
                                or drag and drop
                              </p>
                              <p className="text-xs text-white">
                                PNG, JPEG, or JPG (MAX. 2MB)
                              </p>
                            </div>
                            <input
                              id="file-upload"
                              type="file"
                              accept="image/png, image/jpeg, image/jpg"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  setSelectedFile(file);
                                  field.onChange(file);
                                }
                              }}
                              className="hidden"
                            />
                          </label>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className=" w-full flex items-center justify-end ">
                <Button
                  type="submit"
                  className=" w-auto px-6 h-8 text-xs  bg-neutral-800 hover:bg-neutral-700 "
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
}
