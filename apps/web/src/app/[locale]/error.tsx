"use client";

import { useEffect } from "react";
import { Button } from "@daleel/ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4 text-gray-900">Something went wrong</h1>
        <p className="text-gray-600 mb-8">
          {process.env.NODE_ENV === "development" ? error.message : "An unexpected error occurred"}
        </p>
        {error.digest && (
          <p className="text-sm text-gray-400 mb-4">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-4 justify-center">
          <Button onClick={reset} className="bg-emerald-600 hover:bg-emerald-700">
            Try again
          </Button>
          <Button
            onClick={() => (window.location.href = "/")}
            variant="outline"
            className="border-gray-300"
          >
            Go home
          </Button>
        </div>
      </div>
    </div>
  );
}

