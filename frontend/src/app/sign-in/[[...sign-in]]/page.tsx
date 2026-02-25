import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary:
              "bg-primary hover:bg-primary-dark text-white",
            card: "shadow-xl border border-border",
            headerTitle: "text-dark",
            headerSubtitle: "text-medium",
            socialButtonsBlockButton:
              "border-border text-dark hover:bg-light",
            formFieldInput:
              "border-border focus:ring-primary focus:border-primary",
            footerActionLink: "text-primary hover:text-primary-dark",
          },
        }}
      />
    </div>
  );
}
