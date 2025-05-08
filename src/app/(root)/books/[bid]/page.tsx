"use client";
import { getBookById } from "@/app/admin/book/action";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight2, ProfileCircle, Star1 } from "iconsax-react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CreateReview, GetBookReviews } from "../action";
import { useUserContext } from "@/app/contexts/userContext";
import toaster from "@/app/components/toaster";

export default function BookPage() {
  const { bid } = useParams();
  const BookId: string = Array.isArray(bid) ? bid[0] : bid ?? "";

  const { statusData, isPending: statusDataPending } = useUserContext();

  const router = useRouter();
  const client = useQueryClient();

  const [Review, setReview] = useState<number | null>(null);
  const [ReviewMessage, setReviewMessage] = useState("");

  const { data: Book, isPending } = useQuery({
    queryKey: ["BOOK"],
    queryFn: () => getBookById(BookId),
    enabled: !!BookId,
  });

  const { data: Reviews, isPending: ReviewsPending } = useQuery({
    queryKey: ["REVIEWS"],
    queryFn: () => GetBookReviews(BookId),
    enabled: !!BookId,
  });

  const { mutate: CreateReviewMutate } = useMutation({
    mutationKey: ["CREATEREVIEW"],
    mutationFn: () =>
      CreateReview({
        UserId: statusData!.id,
        BookId: BookId,
        ReviewText: ReviewMessage,
        Rating: Review!,
      }),
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ["REVIEWS"] });
      toaster("Success", "Successfully added your review");
      setReviewMessage("");
      setReview(0);
    },
    onError: (e) => {
      toaster("Error", e.message);
    },
  });

  const handleOnCreateReview = () => {
    if (!statusDataPending && !statusData) {
      router.push("/auth/login");
      toaster("Unauthorized", "Please login before you add a review");
    } else if (!ReviewMessage || ReviewMessage === "") {
      toaster("Attribute Missing", "You cant add an empty review");
    } else if (!Review || Review === 0) {
      toaster("Attribute Missing", "Please select a review stars number");
    } else {
      CreateReviewMutate();
    }
  };

  const handleOnReview = (stars: number) => {
    setReview(stars);
  };

  if (!Book || isPending) return <div>loading</div>;

  return (
    <section className="w-full min-h-screen flex flex-col gap-20">
      <Breadcrumb>
        <BreadcrumbList className="text-neutral-800 p-5 font-sans text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="25" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/book/${Book?.title}`}>
              {Book?.title}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="w-full flex gap-10 px-5">
        <div className="relative w-[40%] h-[40%]">
          <Image
            src={Book!.bookPictureUrl!}
            alt="pic"
            className="object-cover object-center border"
            fill
          />
        </div>
        <div className="flex flex-col gap-10">
          <div className=" flex flex-col gap-5">
            <div className=" flex flex-col gap-2">
              <h1 className=" text-4xl">{Book.title}</h1>
              <div className=" w-1/2">
                <p className="">{Book.description}</p>
              </div>
              <p className=" text-sm text-gray-500">{Book.genre}</p>
            </div>

            <p className=" text-xs">
              by <span className=" text-sm font-semibold">{Book.author}</span>
            </p>
          </div>
          <Button
            onClick={() => router.push(`/rent/${Book.id}`)}
            className=" w-56  py-2 bg-neutral-800 rounded-xl text-white"
          >
            Rent now
          </Button>
        </div>
      </div>

      <div className=" flex flex-col gap-5">
        <div className=" flex flex-col gap-3 px-5">
          <h1 className=" text-2xl  text-neutral-800 font-semibold">Reviews</h1>
          <textarea
            name=""
            id=""
            rows={5}
            onChange={(e) => setReviewMessage(e.target.value)}
            className=" w-full focus:outline-none rounded-md bg-transparent border border-gray-500 border-dashed text-sm p-2"
            placeholder="Write your review here..."
            value={ReviewMessage}
          />
          <div className="w-full flex gap-1">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star1
                key={index}
                size="20"
                color="#262626"
                variant={Review && index < Review ? "Bold" : undefined}
                className="cursor-pointer"
                onClick={() => handleOnReview(index + 1)}
              />
            ))}
          </div>
          <Button
            onClick={() => handleOnCreateReview()}
            className=" w-32 h-8 text-white"
          >
            Create
          </Button>
        </div>
        <hr />

        <h1 className="px-5 text-2xl font-semibold">
          {Reviews?.length} Review(s)
        </h1>
        <div className=" w-full px-5 flex flex-col gap-5 overflow-y-auto">
          {!ReviewsPending && Reviews && Reviews?.length > 0 ? (
            Reviews.map((review) => {
              return (
                <div
                  key={review.id}
                  className=" w-full px-2 py-3 h-auto flex gap-5 border border-dashed border-neutral-800 rounded-lg"
                >
                  <div>
                    <ProfileCircle size="50" color="#262626" variant="Bold" />
                  </div>
                  <div className=" flex flex-col flex-1 gap-2">
                    <h1 className=" text-sm font-semibold font-sans">
                      {review.userId}
                    </h1>
                    <p className=" text-xs ">{review.reviewText}</p>
                  </div>
                  <p className="text-xs">{review.createdAt.toLocaleString()}</p>
                </div>
              );
            })
          ) : (
            <p className="text-center">No reviews available...</p>
          )}
        </div>
      </div>
    </section>
  );
}
