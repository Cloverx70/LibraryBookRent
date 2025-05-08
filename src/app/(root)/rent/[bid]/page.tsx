"use client";
import { getBookById } from "@/app/admin/book/action";
import { book } from "@/app/components/bookCard";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight2 } from "iconsax-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { BookABook } from "../action";
import toaster from "@/app/components/toaster";
import { useUserContext } from "@/app/contexts/userContext";

export default function RentBookPage() {
  const { bid } = useParams();
  const BookId: string = Array.isArray(bid) ? bid[0] : bid ?? "";

  const { statusData } = useUserContext();

  const router = useRouter();

  const { data: BookData, isPending } = useQuery<book | undefined>({
    queryKey: ["BOOKRENTAL"],
    queryFn: () => getBookById(BookId),
    retry: 0,
    enabled: !!BookId,
  });

  const { mutate: RentBookMutate } = useMutation({
    mutationKey: ["RENTABOOK"],
    mutationFn: (data: { BookId: string; UserId: string }) => BookABook(data),
    onSuccess: () => {
      toaster("Success", `Successfully rented ${BookData?.title}`);
      router.push("/");
    },
    onError: (e) => {
      toaster("Error", e.message);
      router.push("/");
    },
  });

  if (!BookData && isPending) return <p>loading...</p>;

  return (
    <section className=" w-full min-h-screen p-4 flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-neutral-800 font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="25" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/profile/${""}`}>Rental</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className=" text-2xl font-semibold">{BookData?.title} Rental</h1>
      <div className=" w-full border border-dashed border-gray-500">
        <div
          key={BookData?.id}
          className="w-full h-28 bg-transperant text-neutral-800 hover:bg-gray-200 cursor-pointer transition-colors duration-300 flex gap-2"
        >
          <div className="relative w-20 overflow-hidden">
            <Image
              unoptimized={false}
              src={BookData!.bookPictureUrl}
              alt="pic"
              className="object-cover object-center"
              fill
            />
          </div>

          <div className="w-[60%] flex flex-col justify-between  p-2">
            <div className="flex flex-col justify-between gap-1">
              <p className="text-lg font-semibold">{BookData?.title}</p>
              <div className="w-[280px] overflow-hidden">
                <p className="text-xs text-gray-600 line-clamp-1">
                  {BookData?.description}
                </p>
              </div>
              <p className="text-xs">by {BookData?.author}</p>
            </div>
            <p className="text-sm ">{BookData?.genre}</p>
          </div>

          <div className="flex-1" />
        </div>
      </div>
      <div className=" w-full flex items-end justify-end">
        <Button
          onClick={() => RentBookMutate({ BookId, UserId: statusData!.id! })}
          className="w-32 h-8 text-xs"
        >
          Rent now
        </Button>
      </div>

      <div className=" flex flex-col gap-4 mt-4">
        <div>
          <p className=" text-xl font-semibold">Renting Rules : </p>
          <ul className="text-base text-neutral-800 font-semibold list-disc pl-5 space-y-1 mt-4">
            <li>
              Books must be collected on time after approval — delays may lead
              to cancellation.
            </li>
            <li>Return the book by the due date to avoid penalties.</li>
            <li>
              The book must be returned in the same condition it was issued.
            </li>
            <li>
              Students are fully responsible for any damage or changes in book
              condition.
            </li>
            <li>
              Students are fully responsible for any damage or changes in book
              condition.
            </li>

            <li>
              Students have 7 days from the date of collection to return the
              book — please ensure timely return to avoid any necessary
              follow-ups or restrictions.
            </li>
          </ul>
        </div>
        <p className="text-xs  400  ">
          Note: After your rental is approved, you must visit the library
          located at <strong>Block E, 10th floor</strong> on{" "}
          <strong>Mondays only</strong> to collect your book.
        </p>
      </div>
    </section>
  );
}
