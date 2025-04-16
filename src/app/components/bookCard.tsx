import Image from "next/image";
import React from "react";

export interface book {
  id: string;
  bookPictureUrl: string;
  title: string;
  author: string;
  isbn: string;
  description: string;
  categoryId: string;
  totalCopies: number;
  availableCopies: number;
  borrowedBy: Date;
  borrowedAt: Date;
  returnDueDate: Date;
  returnedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  genre: string;
}

const BookCard: React.FC<book> = ({
  id,
  title,
  author,
  availableCopies,
  bookPictureUrl,
}) => {
  return (
    <div key={id} className=" w-52 h-[260px] flex flex-col gap-2">
      <div className="relative w-[90%] h-[90%]">
        <Image
          src={bookPictureUrl}
          alt="pic"
          className="object-cover object-center"
          fill
        />
      </div>
      <div className="w-[90%] h-[30%] flex flex-col items-center justify-center gap-4">
        <h1 className=" font-semibold text-base truncate text-center w-[80%]">
          {title}
        </h1>

        <div className=" flex flex-col items-center justify-center">
          <h2 className=" text-xs">
            by <span className=" font-serif font-semibold">{author}</span>
          </h2>
          <h3 className=" text-xs">
            {availableCopies > 0 ? "Available" : "UnAvailable"}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
