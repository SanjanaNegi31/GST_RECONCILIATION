import React from "react";

interface MastersIndiaLogoProps {
  className?: string;
  size?: number;
}

export const MastersIndiaLogo: React.FC<MastersIndiaLogoProps> = ({
  className = "",
  size = 32,
}) => {
  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* SVG Icon matching Masters India brand logo */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Dark Circle Background */}
        <circle cx="50" cy="50" r="50" fill="#222025" />

        {/* 'm' letter body */}
        <path
          d="M 23 68 L 23 43 C 23 37 27 33 33 33 C 39 33 43 37 43 43 L 43 68 M 43 43 C 43 37 47 33 53 33 C 59 33 63 37 63 43 L 63 68"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />

        {/* 'i' letter stem */}
        <path
          d="M 77 48 L 77 68"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="square"
        />

        {/* 'i' letter top blue dot/cyan accent */}
        <path
          d="M 77 32 L 77 41"
          stroke="#2B82B9"
          strokeWidth="11"
          strokeLinecap="square"
        />
      </svg>

      {/* Brand Text */}
      <span className="text-[19px] font-bold tracking-tight text-[#1b1b3a] font-sans">
        Masters India
      </span>
    </div>
  );
};
