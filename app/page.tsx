"use client";

import { useState } from "react";
import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export default function HomePage() {
  const [showSignIn, setShowSignIn] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <SignedIn>
        <h1 className="text-3xl font-bold mb-4">Welcome back to Boardly!</h1>
        {/* Optionally render a list of boards or redirect to /board */}
      </SignedIn>

      <SignedOut>
        <h1 className="text-3xl font-bold mb-4">Welcome to Boardly</h1>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => setShowSignIn(true)}
        >
          Sign In
        </button>

        {showSignIn && (
          <SignIn
            path="/sign-in" // internal routing only, no page needed
            routing="path"
            afterSignInUrl="/board" // redirect after sign-in
          />
        )}
      </SignedOut>
    </main>
  );
}
