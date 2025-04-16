import { book } from "@/app/components/bookCard";
import { axiosInstance } from "@/app/lib/axios.instance";
import { handleError } from "@/app/utils/methods.utils";
import { AxiosResponse } from "axios";

interface Response {
  message: string;
  data?: book;
}

interface AllResponse {
  message: string;
  data?: book[];
}

interface IBookFilter {
  IsAvailable: boolean;
  CategoryId: string | null;
  Genre:
    | (
        | ""
        | "Fiction"
        | "NonFiction"
        | "Fantasy"
        | "Mystery"
        | "Romance"
        | "ScienceFiction"
        | "Thriller"
      )
    | null;
}

export async function CreateBook(
  Title: string,
  Author: string,
  Isbn: string,
  File: File,
  CategoryId: string,
  TotalCopies: number,
  AvailableCopies: number
) {
  try {
    const formData = new FormData();

    formData.append("Title", Title);
    formData.append("Author", Author);
    formData.append("Isbn", Isbn);
    formData.append("File", File);
    formData.append("CategoryId", CategoryId);
    formData.append("TotalCopies", TotalCopies.toString());
    formData.append("AvailableCopies", AvailableCopies.toString());

    const res: AxiosResponse<Response> = await axiosInstance.post(
      "book/create",
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while creating book"
      );
  } catch (error) {
    handleError(error);
  }
}

export async function UpdateBook(
  Bid: string,
  Title: string,
  Author: string,
  Isbn: string,
  File: File,
  CategoryId: string,
  TotalCopies: number,
  AvailableCopies: number
) {
  try {
    const formData = new FormData();
    if (Title) formData.append("Title", Title);
    if (Author) formData.append("Author", Author);
    if (Isbn) formData.append("Isbn", Isbn);
    if (File) formData.append("File", File);
    if (CategoryId) formData.append("CategoryId", CategoryId);
    if (TotalCopies) formData.append("TotalCopies", TotalCopies.toString());
    if (AvailableCopies)
      formData.append("AvailableCopies", AvailableCopies.toString());

    const res: AxiosResponse<Response> = await axiosInstance.put(
      `book/update/${Bid}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (res.status !== 200)
      throw new Error(
        res.data.message || "Somthing went worng while creating book"
      );
  } catch (error) {
    handleError(error);
  }
}

export async function getBookById(bid: string): Promise<book | undefined> {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.get(
      `book/get/${bid}`
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving book");

    return res.data?.data ?? undefined;
  } catch (error) {
    handleError(error);
  }
}
interface GetBooksParams {
  query?: string;
  sort?: string;
  CategoryId?: string;
  Genre?: string;
  IsAvailable: boolean;
}

export async function getAllBooks(
  query: string | null,
  filter: IBookFilter,
  sort: string | null
): Promise<book[] | undefined> {
  try {
    const params: GetBooksParams = {
      IsAvailable: filter.IsAvailable,
    };

    if (query) params.query = query;
    if (sort) params.sort = sort;
    if (filter.CategoryId) params.CategoryId = filter.CategoryId;
    if (filter.Genre) params.Genre = filter.Genre;

    const res: AxiosResponse<AllResponse> = await axiosInstance.get(
      `book/get-all`,
      { params }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error retrieving books");

    return res.data?.data;
  } catch (error) {
    handleError(error);
  }
}

export async function DeleteBookById(bid: string) {
  try {
    const res: AxiosResponse<Response> = await axiosInstance.delete(
      `book/delete/${bid}`,
      { withCredentials: true }
    );

    if (res.status !== 200)
      throw new Error(res.data.message || "error deleting book");
  } catch (error) {
    handleError(error);
  }
}
