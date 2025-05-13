"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight2, FilterSearch, SearchNormal1 } from "iconsax-react";
import { book } from "@/app/components/bookCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "./action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { useDebounce } from "@/app/utils/methods.utils";

export default function AdminBookPageLayout() {
  const router = useRouter();

  const [showFilters, setShowFilters] = useState(false);
  type GenreType =
    | ""
    | "Fiction"
    | "NonFiction"
    | "Fantasy"
    | "Mystery"
    | "Romance"
    | "ScienceFiction"
    | "Thriller"
    | null;

  const [Values, setValues] = useState({
    Query: "",
    IsAvailable: true,
    CategoryId: "",
    Genre: null as GenreType,
    Sort: "",
  });

  const debouncedQuery = useDebounce(Values.Query, 500);

  const { data: BooksData, refetch } = useQuery<book[] | undefined>({
    queryKey: ["BOOKS", debouncedQuery, Values.Sort],
    queryFn: () =>
      getAllBooks(
        debouncedQuery,
        {
          IsAvailable: Values.IsAvailable,
          CategoryId: Values.CategoryId,
          Genre: Values.Genre,
        },
        Values.Sort
      ),
    staleTime: 0,
  });

  return (
    <section className="w-full h-screen p-4 flex flex-col gap-4">
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
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-white font-semibold text-2xl flex justify-between items-center">
        <h1>Books</h1>
      </div>

      <div className="w-full flex items-center justify-end">
        <Button
          onClick={() => router.push("/admin/book/add")}
          className="w-32 py-2 h-8 hover:bg-black/15 transition-all ease-linear duration-100 font-semibold text-xs bg-neutral-800"
        >
          Add Book
        </Button>
      </div>

      <div className="w-full flex items-center justify-between text-white">
        <div className="flex flex-col items-center justify-center relative">
          <div className="relative">
            <SearchNormal1
              className="absolute top-[9px] left-4"
              size="17"
              color="#FFFFFF"
            />
            <button
              className="text-sm absolute right-4 top-[10px]"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterSearch size="17" color="#FFFFFF" />
            </button>
            <input
              onChange={(e) => setValues({ ...Values, Query: e.target.value })}
              type="text"
              placeholder="Search for a book"
              className="h-9 w-full bg-transparent border border-neutral-800 focus:border-white rounded-3xl pl-14 text-sm font-normal outline-none"
            />
          </div>

          {showFilters && (
            <motion.div
              initial={{ y: -25, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "linear" }}
              className="absolute px-4 py-4 top-[60px] right-0 w-full bg-neutral-900 border border-neutral-700 flex flex-col gap-4 shadow-lg z-50"
            >
              <div className="flex flex-col gap-2">
                <label className="text-white text-sm flex gap-2">
                  <Switch
                    checked={Values.IsAvailable}
                    onCheckedChange={() =>
                      setValues({
                        ...Values,
                        IsAvailable: !Values.IsAvailable,
                      })
                    }
                    className="data-[state=checked]:bg-neutral-800 data-[state=unchecked]:bg-neutral-950 h-3"
                  />
                  Is Available
                </label>
                <label className="block text-white text-sm mt-2">
                  <Select
                    onValueChange={(v) =>
                      setValues({ ...Values, CategoryId: v })
                    }
                  >
                    <SelectTrigger className="w-full h-7 text-xs rounded-xl border-neutral-800 data-[state=open]:border-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-neutral-900">
                      <SelectItem value="light">abodis</SelectItem>
                      <SelectItem value="dark">aloshis</SelectItem>
                      <SelectItem value="system">haha</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
                <label className="block text-white text-sm mt-2">
                  <Select
                    onValueChange={(v) =>
                      setValues({ ...Values, Genre: v as GenreType })
                    }
                  >
                    <SelectTrigger className="w-full h-7 text-xs rounded-xl border-neutral-800 data-[state=open]:border-white">
                      <SelectValue placeholder="Genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-neutral-900">
                      <SelectItem value="Fantasy">Fantasy</SelectItem>
                      <SelectItem value="Fiction">Fiction</SelectItem>
                      <SelectItem value="NonFiction">NonFiction</SelectItem>
                    </SelectContent>
                  </Select>
                </label>
              </div>
              <Button
                onClick={() => refetch()}
                className="bg-neutral-800 h-7 text-xs hover:bg-neutral-950 text-white"
              >
                Apply Filters
              </Button>
            </motion.div>
          )}
        </div>

        <Select onValueChange={(v) => setValues({ ...Values, Sort: v })}>
          <SelectTrigger className="w-28 h-7 text-xs text-white placeholder:text-white border-neutral-800">
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
      <Suspense
        fallback={
          <div className="p-2 w-full flex flex-col gap-4">
            {[...Array(6)].map((_, i) => (
              <SkeletonBookCard key={i} />
            ))}
          </div>
        }
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
          key={"booksMap"}
          className="w-full overflow-y-auto flex flex-col gap-4"
        >
          {BooksData && BooksData.length > 0 ? (
            BooksData.map((book: book) => (
              <div
                key={book.id}
                onClick={() => router.push(`/admin/book/${book.id}`)}
                className="w-full h-28 bg-black/15 hover:bg-neutral-800 cursor-pointer transition-colors duration-300 flex gap-2 rounded-md"
              >
                <div className="relative w-20 rounded-l-md overflow-hidden">
                  <Image
                    unoptimized={false}
                    src={book.bookPictureUrl}
                    alt="pic"
                    className="object-cover object-center"
                    fill
                  />
                </div>

                <div className="w-[60%] flex flex-col justify-between text-white p-2">
                  <div className="flex flex-col justify-between gap-1">
                    <p className="text-lg font-semibold">{book.title}</p>
                    <div className="w-[280px] overflow-hidden">
                      <p className="text-xs text-gray-400 line-clamp-1">
                        {book.description}
                      </p>
                    </div>
                    <p className="text-xs">by {book.author}</p>
                  </div>
                  <p className="text-sm text-white">{book.genre}</p>
                </div>

                <div className="flex-1" />

                <div className="text-white p-2 text-xs">
                  <p>{book.availableCopies > 0 ? "Available" : "Booked"}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full flex items-center justify-center text-white">
              <p>No Books Are Available...</p>
            </div>
          )}
        </motion.div>
      </Suspense>
    </section>
  );
}

export const SkeletonBookCard = () => {
  return (
    <div className="w-full h-28 bg-black/15 animate-pulse rounded-md flex gap-2">
      {/* Image skeleton */}
      <div className="w-20 h-full bg-neutral-800 rounded-l-md" />

      {/* Text content skeleton */}
      <div className="w-[60%] flex flex-col justify-between p-2">
        <div className="flex flex-col gap-2">
          <div className="w-1/2 h-4 bg-neutral-700 rounded" />
          <div className="w-[280px] h-3 bg-neutral-700 rounded" />
          <div className="w-1/3 h-3 bg-neutral-700 rounded" />
        </div>
        <div className="w-1/4 h-3 bg-neutral-700 rounded" />
      </div>

      <div className="flex-1" />

      {/* Availability text skeleton */}
      <div className="p-2 flex items-end">
        <div className="w-16 h-3 bg-neutral-700 rounded" />
      </div>
    </div>
  );
};
