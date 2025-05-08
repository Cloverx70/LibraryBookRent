"use client";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { GetCategoryById } from "../action";
import { useParams } from "next/navigation";
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

const CategorySchema = z.object({
  name: z.string().nonempty(),
  description: z.string().nonempty(),
  books: z
    .array(
      z.object({
        id: z.string(),
        bookPictureUrl: z.string(),
        title: z.string(),
        author: z.string(),
        isbn: z.string(),
        description: z.string(),
        categoryId: z.string(),
        totalCopies: z.number(),
        availableCopies: z.number(),
        borrowedBy: z.coerce.date(),
        borrowedAt: z.coerce.date(),
        returnDueDate: z.coerce.date(),
        returnedAt: z.coerce.date(),
        createdAt: z.coerce.date(),
        updatedAt: z.coerce.date(),
        genre: z.string(),
      })
    )
    .optional(),
});

export default function ViewAndEditCategoryPage() {
  const { cid } = useParams();
  const CategoryId: string = Array.isArray(cid) ? cid[0] : cid ?? "";

  const { data: CategoryData } = useQuery({
    queryKey: ["CATEGORY"],
    queryFn: () => GetCategoryById(CategoryId),
  });

  type CategoryFormInputs = z.infer<typeof CategorySchema>;

  const CategoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: "",
      description: "",
      books: [],
    },
  });

  const [categoryBooksKeep, setcategoryBooksKeep] = useState<book[]>([]);

  useEffect(() => {
    if (CategoryData) {
      CategoryForm.reset({
        name: CategoryData.name,
        description: CategoryData.description,
        books: CategoryData.books ?? [],
      });

      setcategoryBooksKeep(CategoryData.books);
    }
  }, [CategoryData, CategoryForm]);

  const handleOnRemoveCategoryBook = (id: string) => {
    if (categoryBooksKeep.length > 0) {
      setcategoryBooksKeep(categoryBooksKeep.filter((book) => book.id !== id));
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
          Update Category
        </p>
        <div>
          <Dialog>
            <DialogTrigger className=" w-auto px-5 h-7 text-xs  flex items-center justify-center  bg-red-900 hover:bg-red-950  rounded-sm transition-colors duration-100 ease-linear font-normal">
              Delete Category
            </DialogTrigger>
            <DialogContent className=" bg-neutral-900 text-white w-1/2 border-none px-10">
              <DialogHeader>
                <DialogTitle className=" text-2xl">
                  Are you absolutely sure?
                </DialogTitle>
                <DialogDescription className=" text-base">
                  This action cannot be undone. This will permanently delete the
                  Category and remove the data from our servers.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button
                    type="button"
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

      <div className=" w-full flex flex-col items-center justify-center">
        <Form {...CategoryForm}>
          <form
            className="w-full flex flex-col items-center justify-center gap-3"
            onSubmit={CategoryForm.handleSubmit(() => {})}
          >
            <FormField
              control={CategoryForm.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full ">
                  <FormLabel className="text-xs text-white">Name</FormLabel>
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
              control={CategoryForm.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-xs text-white">
                    Description
                  </FormLabel>
                  <FormControl>
                    <textarea
                      rows={7}
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
              <div className="w-full flex overflow-x-auto h-auto p-3 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400">
                {CategoryData?.books &&
                  CategoryData.books.length > 0 &&
                  CategoryData.books.map((book) => (
                    <div
                      key={book.id}
                      className="w-48 h-[260px] flex flex-col  bg-neutral-700 items-center justify-center pt-2 rounded-lg"
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
              </div>
            </div>
          </form>
        </Form>
      </div>
      <div></div>
    </section>
  );
}
