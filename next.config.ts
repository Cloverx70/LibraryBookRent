import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "img.freepik.com",
      "www.freepik.com",
      "images.pexels.com",
      "librarybookingwebsite.s3.us-east-1.amazonaws.com",
    ], // Add the domain here
  },
};

export default nextConfig;
