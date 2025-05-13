"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight2, SearchNormal1 } from "iconsax-react";
import { Suspense, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getAllRentals, Rental } from "./action";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDebounce } from "@/app/utils/methods.utils";
import { useRouter } from "next/navigation";
import { SkeletonBookCard } from "../book/page";

export default function AdminBookPageLayout() {
  const router = useRouter();

  const [Query, setQuery] = useState("");

  const DebouncedQuery = useDebounce(Query, 500);

  const {
    data: RentalData,
    isPending,
    isLoading,
  } = useQuery<Rental[] | undefined>({
    queryKey: ["RENTALS", DebouncedQuery],
    queryFn: () => getAllRentals(DebouncedQuery),
    staleTime: 0,
  });

  if (isPending || isLoading)
    return (
      <div className="p-2 w-full flex flex-col gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonBookCard key={i} />
        ))}
      </div>
    );

  return (
    <section className="w-full h-screen flex flex-col gap-5">
      <Breadcrumb>
        <BreadcrumbList className="text-white font-sans text-xs p-4">
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

      <div className="text-white px-4 font-semibold text-2xl flex justify-between items-center">
        <h1>Rentals</h1>
      </div>

      <div className="flex flex-col px-4 items-start justify-start relative">
        <div className="relative">
          <SearchNormal1
            className="absolute top-[9px] left-4"
            size="17"
            color="#FFFFFF"
          />
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a rental"
            className="h-9 w-full bg-transparent border text-white border-neutral-800 focus:border-white rounded-3xl pl-14 text-sm font-normal outline-none"
          />
        </div>
      </div>

      <Suspense fallback={<p>Loading...</p>}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "linear" }}
          key={"booksMap"}
          className="w-full overflow-y-auto flex flex-col gap-4"
        >
          {RentalData && RentalData.length > 0 ? (
            <Table className=" text-white">
              <TableCaption>A list of your recent rentals.</TableCaption>
              <TableHeader>
                <TableRow className="text-xs hover:bg-transparent">
                  <TableHead className="w-[100px] text-white font-semibold text-center">
                    Rental ID
                  </TableHead>
                  <TableHead className=" w-24"></TableHead>
                  <TableHead className="text-white font-semibold">
                    Book Title
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Booked By
                  </TableHead>
                  <TableHead className="text-white font-semibold">
                    Booked At
                  </TableHead>
                  <TableHead className=" text-white font-semibold">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {RentalData.map((rental: Rental, index: number) => (
                  <TableRow
                    key={rental.id || index}
                    className=" hover:bg-neutral-800 h-10 text-xs 2cursor-pointer"
                    onClick={() => router.push(`/admin/rentals/${rental.id}`)}
                  >
                    <TableCell className="font-medium truncate text-center">
                      {rental.id || `Rental ${index + 1}`}
                    </TableCell>
                    <TableCell></TableCell>
                    <TableCell>{rental?.book.title || "Unknown"}</TableCell>
                    <TableCell>{rental?.user.username || "Unknown"}</TableCell>
                    <TableCell>
                      {rental?.createdAt?.toLocaleString() || "Unknown"}
                    </TableCell>

                    <TableCell
                      className={`font-bold ${
                        rental?.status === "approved"
                          ? "text-green-500"
                          : rental?.status === "pending"
                          ? "text-yellow-400"
                          : rental?.status === "returned"
                          ? "text-violet-600"
                          : "text-red-700"
                      }`}
                    >
                      {rental.status}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className=" text-white">No rentals</p>
          )}
        </motion.div>
      </Suspense>
    </section>
  );
}
