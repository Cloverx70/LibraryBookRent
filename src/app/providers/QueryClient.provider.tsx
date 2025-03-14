"use client";
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider as QueryClientProviderWrap,
} from "@tanstack/react-query";

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProviderWrap client={queryClient}>
      {children}
    </QueryClientProviderWrap>
  );
};

export default QueryClientProvider;
