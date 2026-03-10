interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "error" | "warning" | "info";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  const variants = {
    default: "bg-border text-dark",
    success: "bg-success/10 text-success",
    error: "bg-error/10 text-error",
    warning: "bg-accent/10 text-accent",
    info: "bg-primary/10 text-primary",
  };

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
