import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export default function Textarea({
  label,
  error,
  className = "",
  ...props
}: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-medium text-dark mb-1">
          {label}
        </label>
      )}
      <textarea
        className={`input-field min-h-[80px] resize-y ${error ? "border-error" : ""} ${className}`}
        {...props}
      />
      {error && <p className="text-error text-xs mt-0.5">{error}</p>}
    </div>
  );
}
