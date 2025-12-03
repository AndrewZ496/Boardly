"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { AuthLoading, ConvexReactClient } from "convex/react";

import { Loading } from "@/components/auth/loading"; // <- your custom loader component

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;
const convex = new ConvexReactClient(convexUrl);

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        {/* ⏳ Show loading logo when Clerk + Convex auth state is loading */}
        <AuthLoading>
          <Loading />
        </AuthLoading>

        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
};
