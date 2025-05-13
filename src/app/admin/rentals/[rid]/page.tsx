"use client";
import toaster from "@/app/components/toaster";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  approveRental,
  declineRental,
  getRentalById,
  Rental,
  returnRental,
} from "../action";
import { formatDotNetDate } from "@/app/utils/methods.utils";

export default function AdminVeiwAndApproveRentalPage() {
  const { rid } = useParams();
  const RentalId: string = Array.isArray(rid) ? rid[0] : rid ?? "";

  const client = useQueryClient();

  const { data: RentalData, isPending } = useQuery<Rental | undefined>({
    queryKey: ["BOOKRENTAL"],
    queryFn: () => getRentalById(RentalId),
    retry: 0,
    enabled: !!RentalId,
  });

  const { mutate: ApproveRentalMutate } = useMutation({
    mutationKey: ["APPROVERENTAL"],
    mutationFn: () => approveRental(RentalId),
    onSuccess: () => {
      toaster("Success", `Successfully approved rental`);
      client.invalidateQueries({ queryKey: ["BOOKRENTAL"] });
    },
    onError: (e) => {
      toaster("Error", e.message);
    },
  });

  const { mutate: DeclineRentalMutate } = useMutation({
    mutationKey: ["DECLINERENTAL"],
    mutationFn: () => declineRental(RentalId),
    onSuccess: () => {
      toaster("Success", `Successfully declined rental`);
      client.invalidateQueries({ queryKey: ["BOOKRENTAL"] });
    },
    onError: (e) => {
      toaster("Error", e.message);
    },
  });
  const { mutate: ReturnRentalMutate } = useMutation({
    mutationKey: ["RETURNRENTAL"],
    mutationFn: () => returnRental(RentalId),
    onSuccess: () => {
      toaster("Success", `Successfully returned rental`);
      client.invalidateQueries({ queryKey: ["BOOKRENTAL"] });
    },
    onError: (e) => {
      toaster("Error", e.message);
    },
  });

  if (!RentalData && isPending) return <p>loading...</p>;

  return (
    <section className=" w-full h-screen p-4 overflow-y-auto flex flex-col gap-4 text-white">
      <Breadcrumb>
        <BreadcrumbList className="2 font-sans text-xs text-white">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="25" color="#FFFFFF" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/admin/rentals`}>Rentals</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <h1 className=" text-2xl font-semibold">{RentalData?.id}# Rental</h1>
      <div className=" w-full border rounded-md border-dashed border-gray-500">
        <div
          key={RentalData?.id}
          className="w-full h-28 bg-transperant text-neutral-800 hover:bg-neutral-800 cursor-pointer transition-colors duration-300 flex gap-2"
        >
          <div className="relative w-20 overflow-hidden text-white">
            <Image
              unoptimized={false}
              src={RentalData?.book?.bookPictureUrl ?? ""}
              alt="pic"
              className="object-cover object-center"
              fill
            />
          </div>

          <div className="w-[60%] flex flex-col justify-between text-white  p-2">
            <div className="flex flex-col justify-between gap-1">
              <p className="text-lg font-semibold">{RentalData?.book.title}</p>
              <div className="w-[280px] overflow-hidden">
                <p className="text-xs text-gray-400 line-clamp-1">
                  {RentalData?.book.description}
                </p>
              </div>
              <p className="text-xs">by {RentalData?.book.author}</p>
            </div>
            <p className="text-sm ">{RentalData?.book.genre}</p>
          </div>

          <div className="flex-1" />
        </div>
      </div>
      <div className="bg-neutral-900 border border-neutral-700 rounded-md p-4 space-y-4 mt-2">
        <h2 className="text-lg font-semibold text-white">Renter Info</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300">
          <div>
            <p className="font-medium text-white">Full Name</p>
            <p>
              {RentalData?.user.firstName} {RentalData?.user.lastName}
            </p>
          </div>
          <div>
            <p className="font-medium text-white">Username</p>
            <p>{RentalData?.user.username}</p>
          </div>
          <div>
            <p className="font-medium text-white">Email</p>
            <p>{RentalData?.user.email}</p>
          </div>
          <div>
            <p className="font-medium text-white">Phone Number</p>
            <p>{RentalData?.user.phoneNumber}</p>
          </div>
          <div>
            <p className="font-medium text-white">Address</p>
            <p>{RentalData?.user.address}</p>
          </div>
          <div>
            <p className="font-medium text-white">Major</p>
            <p>{RentalData?.user.studentMajor}</p>
          </div>
        </div>

        <div className="border-t border-neutral-700 pt-4">
          <h2 className="text-lg font-semibold text-white">Rental Metadata</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-300 mt-2">
            {RentalData?.status == "approved" && (
              <div>
                <p className="font-medium text-white">Rented At</p>
                <p>{formatDotNetDate(RentalData?.borrowedAt ?? "")}</p>
              </div>
            )}{" "}
            {RentalData?.status == "approved" && (
              <div>
                <p className="font-medium text-white">Return Due</p>
                <p>{formatDotNetDate(RentalData?.returnDueDate ?? "")}</p>
              </div>
            )}
            {RentalData?.status == "returned" && (
              <div>
                <p className="font-medium text-white">Returned At</p>
                <p>
                  {RentalData?.returnedAt
                    ? formatDotNetDate(RentalData.returnedAt ?? "")
                    : "Not Returned"}
                </p>
              </div>
            )}
            <div>
              <p className="font-medium text-white">Status</p>
              <p
                className={`font-bold ${
                  RentalData?.status === "approved"
                    ? "text-green-500"
                    : RentalData?.status === "pending"
                    ? "text-yellow-400"
                    : RentalData?.status === "returned"
                    ? "text-violet-600"
                    : "text-red-700"
                }`}
              >
                {RentalData?.status}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className=" flex gap-2">
        {RentalData?.status === "pending" && (
          <>
            <Button
              onClick={() => ApproveRentalMutate()}
              className=" w-32 h-8 bg-green-800 hover:bg-green-900"
            >
              Approve Rental
            </Button>

            <Button
              onClick={() => DeclineRentalMutate()}
              className=" w-32 h-8  bg-red-700 hover:bg-red-900 text-white"
            >
              Decline Rental
            </Button>
          </>
        )}
        {RentalData?.status == "approved" && (
          <Button
            onClick={() => ReturnRentalMutate()}
            className=" w-32 h-8  bg-neutral-800 hover:bg-gray-500 text-white"
          >
            Return Rental
          </Button>
        )}
      </div>
    </section>
  );
}
