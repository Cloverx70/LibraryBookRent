"use client";
import BookCard, { book } from "../components/bookCard";
import { useQuery } from "@tanstack/react-query";
import { getAllBooks } from "../admin/book/action";
import BookSkeleton from "../components/bookSkeleton";
import { motion } from "framer-motion";

export default function HomePage() {
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
    <section className="w-full h-auto flex flex-col gap-5 z-10">
      <div
        id="herosection"
        className="w-full h-[300px] bg-gray-300 relative"
      ></div>
      <div
        id="featured products"
        className=" w-full h-auto flex flex-col gap-4 px-5"
      >
        <h1 className=" text-2xl font-semibold">Featured Books</h1>
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: "linear", duration: 0.3 }}
          className="w-full grid grid-flow-col gap-5 justify-start justify-items-center overflow-x-auto "
        >
          {isLoading && isPending
            ? Array.from({ length: 6 }).map((_, index) => (
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
      <hr />
      <div
        id="all products"
        className=" w-full h-auto flex flex-col gap-4 px-5"
      >
        <h1 className=" text-2xl font-semibold">All Books</h1>{" "}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ease: "linear", duration: 0.3 }}
          className="w-full grid grid-flow-col gap-5 justify-start justify-items-center overflow-x-auto "
        >
          {isLoading && isPending
            ? Array.from({ length: 6 }).map((_, index) => (
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
