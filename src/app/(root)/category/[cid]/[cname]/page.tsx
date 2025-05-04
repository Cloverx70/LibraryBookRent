"use client";

import React, { useEffect, useState } from "react";
import BookCard, { book } from "@/app/components/bookCard";
import BookSkeleton from "@/app/components/bookSkeleton";
import { ArrowRight2, FilterSearch, SearchNormal1 } from "iconsax-react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  formUrlQuery,
  removeKeysFromQuery,
} from "@/app/admin/(admin_utils)/utils";
import { AlertCircle, X } from "lucide-react";

type GenreType =
  | "Fiction"
  | "NonFiction"
  | "Fantasy"
  | "Mystery"
  | "Romance"
  | "ScienceFiction"
  | "Thriller"
  | null;

const CategoryBooksPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const { cid: categoryId, cname: categoryName } = useParams();

  const query = searchParams.get("search-query") || "";

  const [search, setSearch] = useState<string>(query || "");
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [Values, setValues] = useState({
    IsAvailable: true,
    Genre: null as GenreType,
    Sort: "",
  });

  const {
    data: Books,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["CATEGORY_BOOKS", query, Values.Sort, categoryId],
    queryFn: async () =>
      await getAllCategoryBooks(
        categoryId,
        query,
        {
          IsAvailable: Values.IsAvailable,
          CategoryId: null,
          Genre: Values.Genre,
        },
        Values.Sort
      ),
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const delayDebounceFN = setTimeout(() => {
      if (search) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: "search-query",
          value: search,
        });

        router.push(newUrl);
      } else {
        if (pathname.includes("/category") && query) {
          const newUrl = removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["search-query"],
          });

          router.push(newUrl);
        }
      }
    }, 500);

    return () => clearTimeout(delayDebounceFN);
  }, [pathname, query, router, search, searchParams]);

  if (isError) {
    return (
      <div className="h-[87.75vh] flex flex-col items-center justify-center text-center p-6 animate-fade-in">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-600">
          Something went wrong
        </h2>
        <p className="text-gray-500 mt-2">
          Please try again or contact support if the issue persists.
        </p>

        <button
          onClick={() => refetch()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="w-full min-h-screen p-5 flex flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList className="text-neutral-900 font-sans text-sm">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/books">Books</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/category">Categories</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-neutral-900 font-semibold text-3xl flex justify-between items-center capitalize">
        <h1>{`${categoryName}'s`} Books</h1>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="w-full h-auto p-3 flex items-center justify-between">
          <div className="flex flex-col items-center justify-center relative">
            <div className="relative">
              <SearchNormal1
                className="absolute top-[7px] left-4"
                size="25"
                color="#262626"
              />

              <button
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
                className="text-sm absolute right-4 top-[8px]"
              >
                <FilterSearch size="25" color="#262626" />
              </button>

              <input
                type="text"
                placeholder="Search for a book"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoComplete="off"
                className="h-[40px] w-[400px] bg-transparent border border-neutral-800 focus:border-neutral-900 rounded-3xl pl-16 text-sm font-normal outline-none"
              />
            </div>

            {showFilters && (
              <motion.div
                initial={{ y: -25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2, ease: "linear" }}
                className="absolute px-4 py-4 top-[60px] right-0 w-full bg-neutral-50 border border-neutral-200 rounded-md flex flex-col gap-4 shadow-lg z-50"
              >
                <div className="flex flex-col gap-2">
                  <div className="w-full flex items-center justify-between">
                    <label className="w-fit text-neutral-800 text-sm flex gap-2">
                      <Switch
                        checked={Values.IsAvailable}
                        onCheckedChange={() =>
                          setValues({
                            ...Values,
                            IsAvailable: !Values.IsAvailable,
                          })
                        }
                        className="data-[state=checked]:bg-neutral-800 data-[state=unchecked]:bg-neutral-200 h-4"
                      />
                      Is Available
                    </label>
                    <X
                      size={18}
                      onClick={() => setShowFilters(false)}
                      className="cursor-pointer text-neutral-800 hover:opacity-85 transition-all"
                    />
                  </div>
                  <label className="block text-neutral-800 text-sm mt-2">
                    <Select
                      onValueChange={(v) =>
                        setValues({ ...Values, Genre: v as GenreType })
                      }
                    >
                      <SelectTrigger className="w-full h-7 text-xs text-neutral-800 rounded-xl border-neutral-500 data-[state=open]:border-white">
                        <SelectValue placeholder="Genre" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-50 text-neutral-800 border-neutral-400">
                        <SelectItem value="Fantasy">Fantasy</SelectItem>
                        <SelectItem value="Fiction">Fiction</SelectItem>
                        <SelectItem value="NonFiction">NonFiction</SelectItem>
                      </SelectContent>
                    </Select>
                  </label>
                </div>
                <Button
                  type="button"
                  onClick={() => refetch()}
                  className="bg-neutral-800 h-7 text-xs hover:bg-neutral-950 text-white"
                >
                  Apply Filters
                </Button>
              </motion.div>
            )}
          </div>
          <Select
            onValueChange={(v) => setValues({ ...Values, Sort: v })}
            value={Values.Sort}
          >
            <SelectTrigger className=" w-32 h-[40px] text-neutral-900 placeholder:text-neutral-900 border-neutral-800 outline-none rounded-3xl">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alpha-asc">A-z</SelectItem>
              <SelectItem value="alpha-desc">Z-a</SelectItem>
              <SelectItem value="date-asc">Oldest to Newest</SelectItem>
              <SelectItem value="date-desc">Newest to Oldest</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ease: "linear", duration: 0.3 }}
          className="w-full grid grid-cols-6 gap-4 justify-items-center "
        >
          {isPending
            ? Array.from({ length: 12 }).map((_, index) => (
                <BookSkeleton key={index} />
              ))
            : Books && Books.length > 0
            ? Books.map((book: book) => {
                return (
                  <BookCard
                    key={book.id}
                    id={book.id}
                    bookPictureUrl={book.bookPictureUrl}
                    title={book.title}
                    description=""
                    author={book.author}
                    isbn={book.isbn}
                    categoryId={book.categoryId}
                    totalCopies={book.totalCopies}
                    availableCopies={book.availableCopies}
                    borrowedBy={book.borrowedBy}
                    borrowedAt={book.borrowedAt}
                    returnDueDate={book.returnDueDate}
                    returnedAt={book.returnedAt}
                    createdAt={book.createdAt}
                    updatedAt={book.updatedAt}
                    genre={book.genre}
                  />
                );
              })
            : ""}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoryBooksPage;
