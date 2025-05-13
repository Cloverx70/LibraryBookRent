"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight2, Add } from "iconsax-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CreateCategory } from "../action";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useEffect, useState } from "react";
import Image from "next/image";
import { book } from "@/app/components/bookCard";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import toaster from "@/app/components/toaster";
import { getAllBooks } from "../../book/action";

const CategorySchema = z.object({
  Name: z.string().nonempty(),
  Description: z.string().nonempty(),
  BookIds: z.string().array().optional().default([]),
});

export default function CreateCategoryPage() {
  const client = useQueryClient();
  const router = useRouter();

  type CategoryFormInputs = z.infer<typeof CategorySchema>;

  const CategoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      Name: "",
      Description: "",
      BookIds: [],
    },
  });

  const { data: Books } = useQuery({
    queryKey: ["BOOKS"],
    queryFn: () =>
      getAllBooks(
        null,
        { IsAvailable: true, CategoryId: null, Genre: null },
        null
      ),
  });

  const { mutate: UpdateCategoryMutation } = useMutation({
    mutationFn: (data: CategoryFormInputs) => CreateCategory(data),
    mutationKey: ["UPDATECATEGORY"],
    onSuccess: () => {
      setcategoryBooksNew([]);
      client.invalidateQueries({ queryKey: ["CATEGORYDATA"] });
      toaster("Success", "Successfully created category..");
      router.push("/admin/category");
    },
    onError: (e) => {
      CategoryForm.reset();
      setcategoryBooksNew([]);
      toaster("Error Creating Category", e.message);
    },
  });

  const [categoryBooksNew, setcategoryBooksNew] = useState<book[]>([]);

  useEffect(() => {
    CategoryForm.setValue(
      "BookIds",
      categoryBooksNew.map((book) => book.id)
    );
  }, [categoryBooksNew, CategoryForm]);

  const handleOnRemoveNewCategoryBook = (id: string) => {
    setcategoryBooksNew((prev) => prev.filter((book) => book.id !== id));
  };

  const handleOnAddNewCategoryBook = (book: book) => {
    const isInNew = categoryBooksNew.some((b) => b.id === book.id);
    if (!isInNew) {
      setcategoryBooksNew((prev) => [...prev, book]);
    }
  };

  return (
    <section className="w-full h-screen p-4 flex flex-col gap-4 overflow-y-auto">
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
            <BreadcrumbLink href="/admin/category">Categories</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full text-white font-semibold flex justify-between items-center">
        <p className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl ">
          Create Category
        </p>
      </div>

      <div className=" w-full flex flex-col items-center justify-center">
        <Form {...CategoryForm}>
          <form
            className="w-full flex flex-col items-center justify-center gap-5"
            onSubmit={CategoryForm.handleSubmit((data) => {
              UpdateCategoryMutation(data);
            })}
          >
            <div className=" w-full flex flex-col gap-2">
              <FormField
                control={CategoryForm.control}
                name="Name"
                render={({ field }) => (
                  <FormItem className="w-full ">
                    <FormLabel className="text-xs text-white">Name</FormLabel>
                    <FormControl>
                      <input
                        placeholder="Type your name here..."
                        className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={CategoryForm.control}
                name="Description"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-xs text-white">
                      Description
                    </FormLabel>
                    <FormControl>
                      <textarea
                        rows={7}
                        placeholder="Write your discription here.."
                        className="w-full h-auto p-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className=" w-full flex flex-col gap-2">
                <label className=" text-white text-xs">Books</label>

                <div className="w-full flex items-start justify-start  gap-2 overflow-x-auto h-auto p-3 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400">
                  <Drawer>
                    {categoryBooksNew.length > 0 ? (
                      categoryBooksNew.map((book, index) => (
                        <div
                          key={book.id + index}
                          onClick={() => {
                            handleOnRemoveNewCategoryBook(book.id);
                          }}
                          className="w-48 h-[260px] hover:brightness-75 transition-all ease-linear duration-100 cursor-pointer flex flex-col  bg-neutral-700 items-center justify-center pt-2 rounded-lg"
                        >
                          <div className="relative w-[90%] h-[90%] rounded-lg">
                            <Image
                              src={book.bookPictureUrl}
                              alt="pic"
                              className="object-cover object-center rounded-lg"
                              fill
                            />
                          </div>
                          <div className="w-[90%] h-[30%] flex flex-col items-center justify-center">
                            <h1 className=" font-semibold text-xs truncate text-center w-[80%]">
                              {book.title}
                            </h1>
                            <h3 className=" text-xs">
                              {book.availableCopies > 0
                                ? "Available"
                                : "UnAvailable"}
                            </h3>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className=" w-full p-3 flex flex-col gap-5 items-center justify-center">
                        <p className=" text-sm">No books available...</p>
                        <DrawerTrigger
                          asChild
                          className="w-32 h-8 flex items-center justify-center bg-neutral-900 rounded-md"
                        >
                          <div>Add Book</div>
                        </DrawerTrigger>
                      </div>
                    )}

                    <DrawerTrigger asChild>
                      {categoryBooksNew.length > 0 && (
                        <div className="w-48 h-[260px] hover:brightness-75 transition-all ease-linear duration-100 cursor-pointer flex flex-col  bg-neutral-700 items-center justify-center pt-2 rounded-lg">
                          <Add size="32" color="#FF8A65" />
                          <h1>Add Book</h1>
                        </div>
                      )}
                    </DrawerTrigger>

                    <DrawerContent className=" h-[350px] bg-neutral-800 border-neutral-900">
                      <DrawerTitle className=" text-white px-5">
                        Choose books to add
                      </DrawerTitle>
                      <DrawerHeader className=" w-full flex gap-2 text-white">
                        {Books?.filter(
                          (book) =>
                            book.categoryId === null &&
                            !categoryBooksNew.find((b) => b.id === book.id)
                        ).map((book) => (
                          <div
                            key={book.id}
                            onClick={() => handleOnAddNewCategoryBook(book)}
                            className="w-48 h-[260px] hover:brightness-75 transition-all ease-linear duration-100 cursor-pointer flex flex-col  bg-neutral-700 items-center justify-center pt-2 rounded-lg"
                          >
                            <div className="relative w-[90%] h-[90%] rounded-lg">
                              <Image
                                src={book.bookPictureUrl}
                                alt="pic"
                                className="object-cover object-center rounded-lg"
                                fill
                              />
                            </div>
                            <div className="w-[90%] h-[30%] flex flex-col items-center justify-center">
                              <h1 className=" font-semibold text-xs truncate text-center w-[80%]">
                                {book.title}
                              </h1>
                              <h3 className=" text-xs">
                                {book.availableCopies > 0
                                  ? "Available"
                                  : "UnAvailable"}
                              </h3>
                            </div>
                          </div>
                        ))}
                      </DrawerHeader>
                    </DrawerContent>
                  </Drawer>
                </div>
              </div>
            </div>
            <div className="w-full flex items-center justify-end">
              <Button
                type="submit"
                className=" w-32 h-8 bg-neutral-800 text-white"
              >
                Save
              </Button>
            </div>
          </form>
        </Form>
      </div>

      <div></div>
    </section>
  );
}
