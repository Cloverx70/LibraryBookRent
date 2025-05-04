"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Clock, XCircle } from "lucide-react";
import { book } from "@/app/components/bookCard";
import BookCardMapper from "./BookCardMapper";

const UserPageManagement: React.FC<{
  isPending: boolean;
  pendingRentals: book[];
  approvedRentals: book[];
  declinedRentals: book[];
}> = ({ isPending, pendingRentals, approvedRentals, declinedRentals }) => {
  return (
    <Tabs
      defaultValue="pending-rentals"
      className="w-full flex flex-col items-start justify-center gap-y-6"
    >
      <TabsList className="p-0 h-fit w-full flex items-center justify-center bg-neutral-900">
        <TabsTrigger
          value="pending-rentals"
          disabled={isPending}
          className="bg-neutral-900 gap-x-2 rounded-none text-neutral-100 text-sm md:text-base font-semibold hover:text-neutral-300 border-b border-neutral-800 hover:border-neutral-700 px-4 md:px-7 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50 data-[state=active]:border-neutral-300 disabled:opacity-100 disabled:text-neutral-600 disabled:cursor-not-allowed"
        >
          <Clock size={17} className="inline sm:hidden" />
          <span className="hidden sm:inline">Pending </span>Rentals
        </TabsTrigger>
        <TabsTrigger
          value="approved-rentals"
          disabled={isPending}
          className="bg-neutral-900 gap-x-2 rounded-none text-neutral-100 text-sm md:text-base font-semibold hover:text-neutral-300 border-b border-neutral-800 hover:border-neutral-700 px-4 md:px-7 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50 data-[state=active]:border-neutral-300 disabled:opacity-100 disabled:text-neutral-600 disabled:cursor-not-allowed"
        >
          <CheckCircle size={17} className="inline sm:hidden" />
          <span className="hidden sm:inline">Approved </span>Rentals
        </TabsTrigger>
        <TabsTrigger
          value="declined-rentals"
          disabled={isPending}
          className="bg-neutral-900 gap-x-2 rounded-none text-neutral-100 text-sm md:text-base font-semibold hover:text-neutral-300 border-b border-neutral-800 hover:border-neutral-700 px-4 md:px-7 py-2 data-[state=active]:bg-neutral-900 data-[state=active]:text-neutral-50 data-[state=active]:border-neutral-300 disabled:opacity-100 disabled:text-neutral-600 disabled:cursor-not-allowed"
        >
          <XCircle size={18} className="inline sm:hidden" />
          <span className="hidden sm:inline">Declined </span>Rentals
        </TabsTrigger>
      </TabsList>
      <TabsContent value="pending-rentals">
        {pendingRentals && pendingRentals.length > 0 ? (
          <BookCardMapper books={pendingRentals} />
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>{`You Don't Have Any Pending Rentals Yet.`}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="approved-rentals">
        {approvedRentals && approvedRentals.length > 0 ? (
          <BookCardMapper books={approvedRentals} />
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>{`You Don't Have Any Approved Rentals Yet.`}</p>
          </div>
        )}
      </TabsContent>
      <TabsContent value="declined-rentals">
        {declinedRentals && declinedRentals.length > 0 ? (
          <BookCardMapper books={declinedRentals} />
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>{`You Don't Have Any Declined Rentals Yet.`}</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default UserPageManagement;
