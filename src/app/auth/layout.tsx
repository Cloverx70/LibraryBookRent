import { Montserrat, Roboto } from "next/font/google";
import React from "react";

// Loading fonts
const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
});
const montserrat = Montserrat({
  weight: ["400", "600"],
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${roboto.className} ${montserrat.className} antialiased`}>
      {children}
    </div>
  );
}
