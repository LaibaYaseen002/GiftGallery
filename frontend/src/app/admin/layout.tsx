"use client";

import { useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import AdminGuard from "@/components/admin/AdminGuard";
import AdminSidebar from "@/components/admin/AdminSidebar";
import NotificationBell from "@/components/admin/NotificationBell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  return (
    <AdminGuard>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <AdminSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="bg-white border-b border-border h-16 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
            {/* Left: Hamburger + Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-medium hover:text-dark transition-colors"
                aria-label="Open sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              </button>
              <h1 className="text-lg font-semibold text-dark hidden sm:block">
                Gift Gallery Admin
              </h1>
            </div>

            {/* Right: Notifications + Admin info + UserButton */}
            <div className="flex items-center gap-3">
              <NotificationBell />
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-dark">
                  {user?.firstName || user?.emailAddresses?.[0]?.emailAddress || "Admin"}
                </p>
                <p className="text-xs text-primary font-medium">Administrator</p>
              </div>
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}
