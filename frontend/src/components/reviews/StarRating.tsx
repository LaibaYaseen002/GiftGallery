"use client";

interface StarRatingProps {
  rating: number;
  maxStars?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

export default function StarRating({
  rating,
  maxStars = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-7 h-7" };
  const starSize = sizes[size];

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: maxStars }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= Math.round(rating);

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onChange?.(starValue)}
            className={`${interactive ? "cursor-pointer hover:scale-110" : "cursor-default"} transition-transform`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFilled ? "#D4A853" : "none"}
              stroke={isFilled ? "#D4A853" : "#D1D5DB"}
              strokeWidth={1.5}
              className={starSize}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
