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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight2, Add } from "iconsax-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  DeleteCategoryById,
  GetCategoryById,
  UpdateCategoryById,
} from "../action";
import { useParams, useRouter } from "next/navigation";
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

import { getAllBooks } from "../../book/action";
import toaster from "@/app/components/toaster";

const CategorySchema = z.object({
  Name: z.string().nonempty(),
  Description: z.string().nonempty(),
  NewBookIds: z.string().array().optional().default([]),
  KeptBookIds: z.string().array().optional().default([]),
});

export default function ViewAndEditCategoryPage() {
  const { cid } = useParams();
  const CategoryId: string = Array.isArray(cid) ? cid[0] : cid ?? "";

  const client = useQueryClient();
  const router = useRouter();

  const { data: CategoryData } = useQuery({
    queryKey: ["CATEGORYDATA", CategoryId],
    queryFn: () => GetCategoryById(CategoryId),
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

  type CategoryFormInputs = z.infer<typeof CategorySchema>;

  const CategoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      Name: "",
      Description: "",
      KeptBookIds: [],
      NewBookIds: [],
    },
  });

  const { mutate: UpdateCategoryMutation } = useMutation({
    mutationFn: (data: CategoryFormInputs) =>
      UpdateCategoryById(CategoryId, data),
    mutationKey: ["UPDATECATEGORY"],
    onSuccess: () => {
      setcategoryBooksNew([]);
      setcategoryBooksKeep([]);
      client.invalidateQueries({ queryKey: ["CATEGORYDATA"] });
      router.push("/admin/category");
      toaster("Success", "Successfully updated category..");
    },
    onError: (e) => {
      CategoryForm.reset();
      toaster("Error Updating Category", e.message);
    },
  });

  const { mutate: DeleteCategoryMutation } = useMutation({
    mutationFn: () => DeleteCategoryById(CategoryId),
    mutationKey: ["DELETECATEGORY"],
    onSuccess: () => {
      setcategoryBooksNew([]);
      setcategoryBooksKeep([]);
      client.invalidateQueries({ queryKey: ["CATEGORIES"] });
      router.push("/admin/category");
      toaster("Success", "Successfully Deleted category..");
    },
    onError: (e) => {
      toaster("Error Deleting Category", e.message);
    },
  });

  const [categoryBooksKeep, setcategoryBooksKeep] = useState<book[]>([]);
  const [categoryBooksNew, setcategoryBooksNew] = useState<book[]>([]);

  useEffect(() => {
    CategoryForm.setValue(
      "KeptBookIds",
      categoryBooksKeep.map((book) => book.id)
    );
    CategoryForm.setValue(
      "NewBookIds",
      categoryBooksNew.map((book) => book.id)
    );
  }, [categoryBooksKeep, categoryBooksNew, CategoryForm]);

  useEffect(() => {
    if (CategoryData) {
      CategoryForm.reset({
        Name: CategoryData.name,
        Description: CategoryData.description,
        KeptBookIds: CategoryData.books.map((book) => book.id) ?? [],
      });

      setcategoryBooksKeep(CategoryData.books);
    }
  }, [CategoryData, CategoryForm]);

  const handleOnRemoveCategoryBook = (id: string) => {
    setcategoryBooksKeep((prev) => prev.filter((book) => book.id !== id));
  };

  const handleOnRemoveNewCategoryBook = (id: string) => {
    setcategoryBooksNew((prev) => prev.filter((book) => book.id !== id));
  };

  const handleOnAddNewCategoryBook = (book: book) => {
    const isInKeep = categoryBooksKeep.some((b) => b.id === book.id);
    const isInNew = categoryBooksNew.some((b) => b.id === book.id);
    if (!isInKeep && !isInNew) {
      setcategoryBooksNew((prev) => [...prev, book]);
    }
  };

  const combinedArray = [
    ...categoryBooksKeep.map((item) => ({ ...item, source: "kept" })),
    ...categoryBooksNew.map((item) => ({ ...item, source: "new" })),
  ];

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
                    onClick={() => DeleteCategoryMutation()}
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
                        className="w-full h-8 px-2 text-sm outline-none rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 text-white border border-dashed border-gray-500 hover:border-gray-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>
                      {CategoryForm.formState.errors.KeptBookIds?.message}
                    </FormMessage>
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
                    {combinedArray.length > 0 ? (
                      combinedArray.map((book, index) => (
                        <div
                          key={book.id + index}
                          onClick={() => {
                            if (book.source === "kept")
                              handleOnRemoveCategoryBook(book.id);
                            else handleOnRemoveNewCategoryBook(book.id);
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
                      {combinedArray.length > 0 && (
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
                            !combinedArray.find((b) => b.id === book.id)
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
