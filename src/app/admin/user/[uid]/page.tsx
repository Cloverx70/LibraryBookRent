"use client";
import { book } from "@/app/components/bookCard";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toaster from "@/app/components/toaster";
import { UpdateAccount, User } from "@/app/(root)/profile/action";
import { DeleteUserById, GetUserById, LockUserById } from "../action";
import { useParams, useRouter } from "next/navigation";

const UserSchema = z.object({
  username: z.string().nonempty("username is required"),
  firstName: z.string().nonempty("first name cannot be empty"),
  lastName: z.string().nonempty("last name cannot be empty"),
  email: z.string().email().nonempty("email is required"),
  phoneNumber: z.string(),
  address: z.string(),
  studentMajor: z.string(),
});

export default function AdminUserViewPage() {
  const { uid } = useParams();
  const UserId: string = Array.isArray(uid) ? uid[0] : uid ?? "";

  const { data: UserData } = useQuery({
    queryKey: ["USERDATA"],
    queryFn: () => GetUserById(UserId),
  });

  const [UserBooksState, setUserBooksState] = useState({
    Pending: true,
    Approved: false,
    Declined: false,
  });

  const [EditMode, setEditMode] = useState(false);

  const client = useQueryClient();
  const router = useRouter();

  type userInputs = z.infer<typeof UserSchema>;

  const UserForm = useForm<userInputs>({
    resolver: zodResolver(UserSchema),
    defaultValues: {
      username: "",
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      address: "",
      studentMajor: "",
    },
  });

  const { mutate: LockAccountMutate } = useMutation({
    mutationKey: ["LOCKACCOUNT"],
    mutationFn: () => LockUserById(UserId),
    onSuccess: () => {
      toaster("Success", "User have been locked successfully");
      client.invalidateQueries({ queryKey: ["USERDATA"] });
      client.invalidateQueries({ queryKey: ["USERS"] });
    },
    onError: (e) => {
      toaster("Error locking account", e.message);
    },
  });

  const { mutate: DeleteUserMutate } = useMutation({
    mutationKey: ["DELETEMUTATE"],
    mutationFn: () => DeleteUserById(UserId),
    onSuccess: () => {
      toaster("Success", "User have been deleted successfully");
      client.invalidateQueries({ queryKey: ["USERS"] });
      router.push("/admin/user");
    },
    onError: (e) => {
      toaster("Error deleting account", e.message);
    },
  });

  const { mutate: SaveChanges, isPending } = useMutation({
    mutationKey: ["UPDATEUSER"],
    mutationFn: (data: User) => UpdateAccount(data, UserId),
    onSuccess: () => {
      toaster("Success", "Changes have been saved");
      client.invalidateQueries({ queryKey: ["USERDATA"] });
      client.invalidateQueries({ queryKey: ["USERS"] });

      setEditMode(false);
    },
    onError: (e) => {
      toaster("Error Saving Changes", e.message);
    },
  });

  useEffect(() => {
    if (UserData) {
      UserForm.reset({
        username: UserData.username,
        firstName: UserData.firstName,
        lastName: UserData.lastName,
        email: UserData.email,
        phoneNumber: UserData.phoneNumber ?? undefined,
        address: UserData.address || " ",
        studentMajor: UserData.studentMajor ?? undefined,
      });
    }
  }, [UserForm, UserData]);

  return (
    <section className="w-full h-screen  bg-white">
      <div className="p-5 flex flex-col gap-5">
        <Breadcrumb>
          <BreadcrumbList className="text-neutral-800 font-sans text-xs">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator>
              <ArrowRight2 size="25" color="#262626" />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbLink href={`/admin/user`}>Users</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className=" flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-semibold ">
            {UserData?.username + "'"}s Profile
          </h1>
          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.preventDefault();
                LockAccountMutate();
              }}
              className="bg-neutral-800 text-center w-32 h-8 text-xs"
            >
              Lock Account
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                DeleteUserMutate();
              }}
              className="bg-red-950 text-center w-32 h-8 text-xs"
            >
              Delete Account
            </Button>
            {!EditMode && (
              <Button
                onClick={() => setEditMode(true)}
                className=" bg-neutral-800 text-center w-32 h-8 text-xs"
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        <div className=" w-full">
          <Form {...UserForm}>
            <form
              className=" flex flex-col gap-2"
              onSubmit={UserForm.handleSubmit((data) => SaveChanges(data))}
            >
              <div className="w-full flex  gap-4 ">
                <div className="w-1/2">
                  <FormField
                    name="username"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2">
                  <FormField
                    name="email"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full flex  gap-4 ">
                <div className="w-1/2">
                  <FormField
                    name="firstName"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2">
                  <FormField
                    name="lastName"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="w-full flex  gap-4 ">
                <div className="w-1/2">
                  <FormField
                    name="studentMajor"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>Student Major</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="w-1/2">
                  <FormField
                    name="phoneNumber"
                    control={UserForm.control}
                    render={({ field }) => (
                      <FormItem className="w-full space-y-0">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <input
                            disabled={!EditMode}
                            className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                name="address"
                control={UserForm.control}
                render={({ field }) => (
                  <FormItem className="space-y-0">
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <input
                        disabled={!EditMode}
                        className="w-full h-8 px-2 disabled:bg-gray-100 text-sm outline-none rounded-lg bg-transparent focus:bg-neutral-700 focus:text-white transition-colors ease-linear duration-300 text-neutral-800 border border-dashed border-gray-500 hover:border-gray-400 "
                        {...field}
                      />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />

              {EditMode && (
                <div className="w-full flex items-center justify-end mt-1">
                  <Button
                    className=" bg-neutral-800 text-center w-32 h-8 text-xs disabled:bg-neutral-600"
                    disabled={isPending}
                    type="submit"
                  >
                    Save changes
                  </Button>
                </div>
              )}
            </form>
          </Form>
        </div>
      </div>

      <div className=" w-full flex items-center justify-center text-sm ">
        <button
          onClick={() =>
            setUserBooksState({
              Pending: true,
              Approved: false,
              Declined: false,
            })
          }
          className={`w-[33%] py-2 rounded-none ${
            UserBooksState.Pending
              ? "bg-neutral-800 text-white border border-neutral-800 font-semibold"
              : "border border-dashed border-gray-500 bg-transparent text-neutral-700"
          }`}
        >
          Pending Rentals
        </button>
        <button
          onClick={() =>
            setUserBooksState({
              Pending: false,
              Approved: true,
              Declined: false,
            })
          }
          className={`w-[34%] py-2 rounded-none ${
            UserBooksState.Approved
              ? "bg-neutral-800 text-white border border-neutral-800 font-semibold"
              : "border-b border-t border-dashed border-gray-500 bg-transparent text-neutral-700"
          }`}
        >
          Approved Rentals
        </button>
        <button
          onClick={() =>
            setUserBooksState({
              Pending: false,
              Approved: false,
              Declined: true,
            })
          }
          className={`w-[33%] py-2 rounded-none ${
            UserBooksState.Declined
              ? "bg-neutral-800 text-white border border-neutral-800 font-semibold"
              : "border border-dashed border-gray-500 bg-transparent text-neutral-700"
          }`}
        >
          Declined Rentals
        </button>
      </div>
      <div className="w-full max-h-[35%] overflow-y-auto bg-white flex flex-col p-1 gap-1">
        {UserBooksState.Pending &&
          (UserData && UserData?.pendingRentals?.length > 0 ? (
            <PendingRentalsDisplay PendingRentals={UserData.pendingRentals} />
          ) : (
            <p className="text-center mt-5 ">No pending rentals yet..</p>
          ))}

        {UserBooksState.Approved &&
          (UserData && UserData?.approvedRentals?.length > 0 ? (
            <ApprovedRentalsDisplay
              ApprovedRentals={UserData.approvedRentals}
            />
          ) : (
            <p className="text-center mt-5">No approved rentals yet..</p>
          ))}

        {UserBooksState.Declined &&
          (UserData && UserData?.declinedRentals?.length > 0 ? (
            <DeclinedRentalsDisplay
              DeclinedRentals={UserData.declinedRentals}
            />
          ) : (
            <p className="text-center mt-5">No declined rentals yet..</p>
          ))}
      </div>
    </section>
  );
}

type PendingRentalsProps = {
  PendingRentals: book[];
};

type ApprovedRentalsProps = {
  ApprovedRentals: book[];
};

type DeclinedRentalsProps = {
  DeclinedRentals: book[];
};

const PendingRentalsDisplay = ({ PendingRentals }: PendingRentalsProps) => {
  return PendingRentals.map((rental, index) => (
    <div
      key={index}
      className="w-full h-28 p-2 bg-white border-gray-500 border border-dashed text-neutral-800 bg-black/15 cursor-pointer transition-colors duration-300 flex gap-2 "
    >
      <div className="relative w-20 overflow-hidden">
        <Image
          unoptimized={false}
          src={rental.bookPictureUrl}
          alt="pic"
          className="object-cover object-center"
          fill
        />
      </div>

      <div className="w-[60%] flex flex-col justify-between  p-2">
        <div className="flex flex-col justify-between gap-1">
          <p className="text-lg font-semibold">{rental.title}</p>
          <div className="w-[280px] overflow-hidden">
            <p className="text-xs text-gray-700 line-clamp-1">
              {rental.description}
            </p>
          </div>
          <p className="text-xs">by {rental.author}</p>
        </div>
        <p className="text-sm ">{rental.genre}</p>
      </div>

      <div className="flex-1" />

      <div className="p-2 text-xs ">
        <p>Pending</p>
      </div>
    </div>
  ));
};

const ApprovedRentalsDisplay = ({ ApprovedRentals }: ApprovedRentalsProps) => {
  return ApprovedRentals.map((rental, index) => (
    <div
      key={index}
      className="w-full h-28 p-2 bg-white border-gray-500 border border-dashed text-neutral-800 bg-black/15 cursor-pointer transition-colors duration-300 flex gap-2 "
    >
      <div className="relative w-20 overflow-hidden">
        <Image
          unoptimized={false}
          src={rental.bookPictureUrl}
          alt="pic"
          className="object-cover object-center"
          fill
        />
      </div>

      <div className="w-[60%] flex flex-col justify-between  p-2">
        <div className="flex flex-col justify-between gap-1">
          <p className="text-lg font-semibold">{rental.title}</p>
          <div className="w-[280px] overflow-hidden">
            <p className="text-xs text-gray-700 line-clamp-1">
              {rental.description}
            </p>
          </div>
          <p className="text-xs">by {rental.author}</p>
        </div>
        <p className="text-sm ">{rental.genre}</p>
      </div>

      <div className="flex-1" />

      <div className="p-2 text-xs flex flex-col justify-between ">
        <div>
          <p>Borrowed At:</p>
          <p>{rental.borrowedAt ? rental.borrowedAt.toLocaleString() : ""}</p>
        </div>
        <p className="text-center">Approved</p>
      </div>
    </div>
  ));
};

const DeclinedRentalsDisplay = ({ DeclinedRentals }: DeclinedRentalsProps) => {
  return DeclinedRentals.map((rental, index) => (
    <div
      key={index}
      className="w-full h-28 p-2 bg-white border-gray-500 border border-dashed text-neutral-800 bg-black/15 cursor-pointer transition-colors duration-300 flex gap-2 "
    >
      <div className="relative w-20 overflow-hidden">
        <Image
          unoptimized={false}
          src={rental.bookPictureUrl}
          alt="pic"
          className="object-cover object-center"
          fill
        />
      </div>

      <div className="w-[60%] flex flex-col justify-between  p-2">
        <div className="flex flex-col justify-between gap-1">
          <p className="text-lg font-semibold">{rental.title}</p>
          <div className="w-[280px] overflow-hidden">
            <p className="text-xs text-gray-700 line-clamp-1">
              {rental.description}
            </p>
          </div>
          <p className="text-xs">by {rental.author}</p>
        </div>
        <p className="text-sm ">{rental.genre}</p>
      </div>

      <div className="flex-1" />

      <div className="p-2 text-xs ">
        <p>Declined</p>
      </div>
    </div>
  ));
};
