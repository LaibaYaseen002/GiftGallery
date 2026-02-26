"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container-custom py-20 text-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1}
        stroke="currentColor"
        className="w-20 h-20 text-error mx-auto mb-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
        />
      </svg>
      <h1 className="text-3xl font-bold text-dark mb-4">
        Something went wrong
      </h1>
      <p className="text-medium mb-8 max-w-md mx-auto">
        An unexpected error occurred. Please try again or go back to the home
        page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={reset} className="btn-primary">
          Try Again
        </button>
        <a href="/" className="btn-secondary">
          Go Home
        </a>
      </div>
    </div>
  );
}
