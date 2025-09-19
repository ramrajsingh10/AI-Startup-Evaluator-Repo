import type { SVGProps } from "react";

export function AppLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      {...props}
    >
      <path
        fill="currentColor"
        d="M128 24a104 104 0 1 0 104 104A104.11 104.11 0 0 0 128 24Zm0 192a88 88 0 1 1 88-88a88.1 88.1 0 0 1-88 88Zm52-88a52 52 0 0 0-98.35 22.31l-3.61-12.65a8 8 0 0 0-15.58 4.44l24.34 85.16a8 8 0 0 0 15.58-4.44L114.71 168h1.64a52 52 0 0 0 45.65-80Z"
      />
    </svg>
  );
}
