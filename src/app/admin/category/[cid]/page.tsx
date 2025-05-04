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
import { ArrowRight2 } from "iconsax-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DeleteCategory, GetCategoryById, UpdateCategory } from "../action";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import toaster from "@/app/components/toaster";
import { Loader2 } from "lucide-react";

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

export default function ViewAndEditCategoryPage() {
  const router = useRouter();
  const { cid } = useParams();
  const CategoryId: string = Array.isArray(cid) ? cid[0] : cid ?? "";

  const queryClient = useQueryClient();

  const [open, setOpen] = useState<boolean>(false);

  const { data: CategoryData } = useQuery({
    queryKey: ["CATEGORY"],
    queryFn: () => GetCategoryById(CategoryId),
    refetchOnWindowFocus: false,
  });

  type CategoryFormInputs = z.infer<typeof CategorySchema>;

  const CategoryForm = useForm<CategoryFormInputs>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      Name: "",
      Description: "",
      BookIds: [],
    },
  });

  const selectedBooks = CategoryForm.watch("BookIds");

  const toggleBookId = (book: book) => {
    if (book.availableCopies <= 0) {
      toaster("Book Unavailable", "This book is not available for selection");
      return;
    }

    const current = CategoryForm.getValues("BookIds") || [];
    const updated = current.includes(book.id)
      ? current.filter((bookId) => bookId !== book.id)
      : [...current, book.id];

    CategoryForm.setValue("BookIds", updated, { shouldValidate: true });
  };

  const { mutate: updateCategoryMutation, isPending } = useMutation({
    mutationFn: async (data: CategoryFormInputs) =>
      await UpdateCategory(CategoryId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["CATEGORIES"],
      });

      toaster("Success", "Category updated successfully");
      CategoryForm.reset();
      router.push("/admin/category");
    },
    onError: (error) => {
      toaster("Error creating book", error.message || "Something went wrong");
    },
  });

  const { mutate: deleteCategoryMutation, isPending: isDeleting } = useMutation(
    {
      mutationFn: async () => await DeleteCategory(CategoryId),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["CATEGORIES"],
        });

        toaster("Success", "Category deleted successfully");
        router.push("/admin/category");
      },
      onError: (error) => {
        toaster(
          "Error updating category",
          error.message || "Something went wrong"
        );
      },
      onSettled: () => {
        setOpen(false);
      },
    }
  );

  useEffect(() => {
    if (CategoryData) {
      CategoryForm.reset({
        Name: CategoryData.name,
        Description: CategoryData.description || "",
        BookIds: CategoryData.books?.map((book) => book.id) ?? [],
      });
    }
  }, [CategoryData, CategoryForm]);

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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className=" w-auto px-5 h-7 text-xs  flex items-center justify-center  bg-red-900 hover:bg-red-950  rounded-sm transition-colors duration-100 ease-linear font-normal">
              Delete Category
            </DialogTrigger>
            <DialogContent
              aria-describedby={undefined}
              className=" bg-neutral-900 text-white w-1/2 border-none px-10"
            >
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
                    disabled={isDeleting}
                    onClick={() => deleteCategoryMutation()}
                    className="w-44 h-8 bg-neutral-800 hover:bg-neutral-700 "
                  >
                    {isDeleting ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Delete"
                    )}
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
            onSubmit={CategoryForm.handleSubmit((data) =>
              updateCategoryMutation(data)
            )}
            className="space-y-4 w-full"
          >
            <div className="w-full flex flex-col lg:flex-row justify-center items-start gap-4">
              <div className="w-full flex flex-col gap-y-4">
                <FormField
                  control={CategoryForm.control}
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
                  control={CategoryForm.control}
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
                {CategoryData?.books && CategoryData.books.length > 0 ? (
                  <FormField
                    control={CategoryForm.control}
                    name="BookIds"
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs">Books</FormLabel>
                        <FormControl>
                          <ScrollArea className="w-full h-64 p-2 pr-3 rounded-lg bg-neutral-800 focus:bg-neutral-700 transition-colors ease-linear duration-300 border border-dashed border-gray-500 hover:border-gray-400">
                            <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 text-sm text-white">
                              {CategoryData.books.map((book: book) => {
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
                    <p className="text-sm text-gray-400">
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
              {isPending ? <Loader2 className="animate-spin" /> : "Update"}
            </Button>
          </form>
        </Form>
      </div>
      <div></div>
    </section>
  );
}
