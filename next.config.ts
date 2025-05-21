import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "librarybookrent.s3.eu-north-1.amazonaws.com", // ✅ This one matches
      "img.freepik.com",
      "www.freepik.com",
      "images.pexels.com",
      "librarybookingwebsite.s3.us-east-1.amazonaws.com",
    ],
  },
};

export default nextConfig;
