"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { book } from "@/app/components/bookCard";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80";

const BookCardMapper: React.FC<{ books: book[] }> = ({ books }) => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "linear" }}
      className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      {books.map((book: book) => (
        <div
          key={book.id}
          onClick={() => router.push(`/admin/book/${book.id}`)}
          className="w-full cursor-pointer rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-neutral-900 border border-neutral-800 group"
        >
          <div className="w-full h-72 relative">
            <Image
              src={book.bookPictureUrl || FALLBACK_IMAGE}
              alt={book.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 flex flex-col gap-1">
            <h3 className="text-white font-semibold text-lg truncate">
              {book.title}
            </h3>
            <p className="text-sm text-neutral-400 line-clamp-1">
              by {book.author}
            </p>
            <p className="text-xs text-neutral-500 line-clamp-2">
              {book.description}
            </p>
            <div className="mt-2 flex items-center justify-between text-xs text-neutral-300">
              <span className="bg-purple-700/30 text-purple-300 px-2 py-0.5 rounded-full">
                {book.genre}
              </span>
              <span className="bg-green-700/30 text-green-300 px-2 py-0.5 rounded-full">
                {book.availableCopies} available
              </span>
            </div>
          </div>
        </div>
      ))}
    </motion.div>
  );
};

export default BookCardMapper;
