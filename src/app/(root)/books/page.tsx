"use client";
import { getAllBooks } from "@/app/adminbak/book/action";
import BookCard, { book } from "@/app/components/bookCard";
import BookSkeleton from "@/app/components/bookSkeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight2, FilterSearch, SearchNormal1 } from "iconsax-react";
import { motion } from "framer-motion";
export default function AllBooksPage() {
  const {
    data: Books,
    isLoading,
    isPending,
  } = useQuery({
    queryKey: ["BOOKS"],
    queryFn: () =>
      getAllBooks(
        null,
        { IsAvailable: true, CategoryId: null, Genre: null },
        null
      ),
  });

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
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-neutral-900 font-semibold text-3xl flex justify-between items-center">
        <h1>Books</h1>
      </div>

      <div className="w-full flex flex-col gap-3">
        <div className="w-full h-auto p-3 flex items-center justify-between">
          <div className="relative">
            <SearchNormal1
              className="absolute top-[7px] left-4"
              size="20"
              color="#262626"
            />

            <button className="text-sm absolute right-4 top-[8px]">
              <FilterSearch size="20" color="#262626" />
            </button>

            <input
              type="text"
              placeholder="Search for a book"
              className="h-[35px] w-[250px] md:w-[400px] lg:w-[400px] xl:w-[400px] 2xl:w-[400px] bg-transparent placeholder:text-sm border border-neutral-800 focus:border-neutral-900 rounded-3xl pl-16 text-sm font-normal outline-none"
            />
          </div>

          <Select>
            <SelectTrigger className=" w-32 h-[35px] placeholder:text-sm text-white placeholder:text-white border-neutral-800 outline-none rounded-3xl">
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
          className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 justify-start gap-5 justify-items-center "
        >
          {isLoading && isPending
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
}
