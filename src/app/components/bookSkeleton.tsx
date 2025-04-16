import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const bookSkeleton = () => {
  return (
    <div>
      <div className=" w-52 h-[250px] flex flex-col gap-2">
        <div className=" w-[90%] h-[90%]">
          <Skeleton className="w-full h-full rounded-sm" />
        </div>
        <div className="w-[90%] h-[30%] flex flex-col items-center justify-center gap-2 ">
          <Skeleton className="w-full h-1/2 rounded-lg" />

          <div className="h-auto flex flex-col gap-2 items-center justify-end w-full">
            <Skeleton className="w-1/2 h-4 rounded-lg" />
            <Skeleton className="w-1/4 h-4 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default bookSkeleton;
