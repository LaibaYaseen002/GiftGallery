import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-dark mb-1">
          {label}
        </label>
      )}
      <input className={`input-field ${error ? "border-error" : ""} ${className}`} {...props} />
      {error && <p className="text-error text-xs mt-0.5">{error}</p>}
    </div>
  );
}
