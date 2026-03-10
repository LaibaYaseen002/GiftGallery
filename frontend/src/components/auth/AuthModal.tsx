"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import Modal from "@/components/ui/Modal";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectUrl?: string;
}

export default function AuthModal({ isOpen, onClose, redirectUrl = "/checkout" }: AuthModalProps) {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");

  const clerkAppearance = {
    elements: {
      rootBox: "w-full",
      card: "shadow-none border-0 p-0 w-full",
      formButtonPrimary: "bg-primary hover:bg-primary-dark text-white",
      headerTitle: "text-dark",
      headerSubtitle: "text-medium",
      socialButtonsBlockButton: "border-border text-dark hover:bg-light",
      formFieldInput: "border-border focus:ring-primary focus:border-primary",
      footerActionLink: "text-primary hover:text-primary-dark",
      footer: "hidden",
    },
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={mode === "sign-in" ? "Sign In to Continue" : "Create an Account"}>
      <div className="space-y-3">
        {/* Info message */}
        <p className="text-xs text-medium text-center">
          {mode === "sign-in"
            ? "Please sign in to proceed to checkout. Your cart items are saved."
            : "Create an account to complete your purchase."}
        </p>

        {/* Clerk Auth Component */}
        <div className="flex justify-center">
          {mode === "sign-in" ? (
            <SignIn
              appearance={clerkAppearance}
              forceRedirectUrl={redirectUrl}
              routing="hash"
            />
          ) : (
            <SignUp
              appearance={clerkAppearance}
              forceRedirectUrl={redirectUrl}
              routing="hash"
            />
          )}
        </div>

        {/* Toggle between Sign In / Sign Up */}
        <div className="text-center pt-2 border-t border-border">
          {mode === "sign-in" ? (
            <p className="text-xs text-medium">
              Don&apos;t have an account?{" "}
              <button
                onClick={() => setMode("sign-up")}
                className="text-primary font-medium hover:text-primary-dark transition-colors"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p className="text-xs text-medium">
              Already have an account?{" "}
              <button
                onClick={() => setMode("sign-in")}
                className="text-primary font-medium hover:text-primary-dark transition-colors"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
}
