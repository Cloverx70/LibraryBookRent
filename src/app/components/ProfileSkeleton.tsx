"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function ProfileSkeleton() {
  return (
    <motion.section
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full h-screen"
    >
      <div className="p-5 max-h-screen justify-center flex flex-col gap-5">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="w-40 h-4" />

        {/* Header and Button */}
        <div className="flex items-center justify-between">
          <Skeleton className="w-52 h-6" />
          <Skeleton className="w-32 h-8" />
        </div>

        {/* Form Skeleton */}
        <div className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="flex gap-4 w-full">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>

          {/* Row 2 */}
          <div className="flex gap-4 w-full">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>

          {/* Row 3 */}
          <div className="flex gap-4 w-full">
            <Skeleton className="w-1/2 h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>

          {/* Address */}
          <Skeleton className="w-full h-10" />

          {/* Submit button */}
          <div className="flex justify-end">
            <Skeleton className="w-32 h-8" />
          </div>
        </div>
      </div>
    </motion.section>
  );
}
