"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (!user || user.publicMetadata?.role !== "admin") {
      router.replace("/");
      return;
    }

    setAuthorized(true);
  }, [user, isLoaded, router]);

  if (!isLoaded || !authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-medium text-sm">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
