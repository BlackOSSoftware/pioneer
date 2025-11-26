"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeftCircle, Home } from "lucide-react";

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6 text-center">
      
      {/* BIG 404 */}
      <h1 className="text-7xl font-extrabold text-blue-600 drop-shadow-sm">
        404
      </h1>

      {/* TITLE */}
      <h2 className="text-2xl font-semibold text-gray-900 mt-4">
        Page Not Found
      </h2>

      {/* MESSAGE */}
      <p className="text-gray-600 mt-2 max-w-md">
        The page you’re looking for doesn’t exist or may have been moved.
      </p>

      {/* BUTTONS */}
      <div className="mt-6 flex items-center gap-4">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-100 text-gray-900"
        >
          <ArrowLeftCircle size={20} />
          Go Back
        </button>

        {/* HOME BUTTON */}
        <Link
          href="/"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700"
        >
          <Home size={20} />
          Home
        </Link>
      </div>

    </div>
  );
}
