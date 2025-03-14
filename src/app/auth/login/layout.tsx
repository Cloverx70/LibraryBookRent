import React from "react";

export const metadata = {
  title: "Liu Library - Login",
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
