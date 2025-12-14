"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Welcome to Boardly</h1>
      <div className="flex gap-4">
        <Link
          href="/sign-in"
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Sign Up
        </Link>
      </div>
    </main>
  );
}
