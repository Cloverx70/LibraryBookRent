import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { ArrowRight2 } from "iconsax-react";

export default function AboutPage() {
  return (
    <section className="max-h-screen p-4 flex flex-col gap-4">
      <Breadcrumb>
        <BreadcrumbList className="text-neutral-800 font-sans  text-xs">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ArrowRight2 size="32" color="#262626" />
          </BreadcrumbSeparator>
          <BreadcrumbItem>
            <BreadcrumbLink href="/about">About</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className=" flex flex-col items-center justify-center gap-5">
        <h1 className=" text-2xl font-semibold">About us</h1>
        <p className=" text-sm md:text-lg lg:text-lg xl:text-lg 2xl:text-lg w-1/2 text-center">
          Welcome to <span className="font-bold">LIU BookRent</span>, the
          official book renting platform for students and faculty of the
          <span className="font-bold">Lebanese International University</span>.
          Our mission is to make textbooks and academic resources more
          accessible and affordable for everyone in the LIU community. With a
          user-friendly interface and a wide selection of university-approved
          books, LIU BookRent allows students to
          <span className=" font-bold">
            rent, reserve, and manage textbooks seamlessly
          </span>
          . Whether you’re on campus or studying remotely, our platform ensures
          you have the right materials at the right time. We are committed to
          supporting academic success by promoting sustainability, reducing the
          cost of education, and creating a shared space where knowledge can
          <span className=" font-bold"> thrive</span>.
        </p>
      </div>
    </section>
  );
}
