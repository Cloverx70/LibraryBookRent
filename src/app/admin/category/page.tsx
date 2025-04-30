"use client";

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight2 } from "iconsax-react";
import { GetAllCategories } from "./action";
import { useRouter } from "next/navigation";

export default function AdminCategoryPage() {
  const router = useRouter();

  const {
    data: CategoriesData,
    isLoading,
    isPending,
  } = useQuery({ queryKey: ["CATEGORIES"], queryFn: () => GetAllCategories() });

  if (isLoading || isPending) return "";

  return (
    <section className="w-full h-screen p-4 flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-white font-sans text-xs">
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

      <div className="text-white font-semibold text-2xl flex justify-between items-center">
        <h1>Categories</h1>
      </div>
      <div className="w-full flex items-center justify-end">
        <Button className="w-40 py-2 h-8 hover:bg-black/15 transition-all ease-linear duration-100 font-semibold text-xs bg-neutral-800">
          Add Category
        </Button>
      </div>
      <div></div>

      <div className=" w-full">
        <p className=" text-white text-xl font-semibold">
          {CategoriesData ? CategoriesData?.length : 0} Categories found :
        </p>
      </div>
      <div className=" w-full grid grid-flow-col gap-5 justify-start justify-items-center">
        {CategoriesData && CategoriesData.length > 0 ? (
          CategoriesData.map((category, index) => {
            return (
              <div
                key={category.id || index}
                onClick={() => router.push(`/admin/category/${category.id}`)}
                className=" w-44 h-40 p-4 cursor-pointer bg-neutral-800 flex flex-col items-center justify-center gap-2 text-white "
              >
                <div className=" w-full flex flex-col items-center justify-center ">
                  <h1 className=" font-bold ">{category.name}</h1>
                  <p className=" line-clamp-2 text-center text-xs">
                    {category.description}
                  </p>
                </div>
                <p className=" text-xs">
                  {category.books.length >= 0 && category.books.length} Books
                </p>
              </div>
            );
          })
        ) : (
          <div className="w-full flex items-center justify-center text-white">
            <p>No Books Are Available...</p>
          </div>
        )}
      </div>
    </section>
  );
}
