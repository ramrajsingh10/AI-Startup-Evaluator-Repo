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

export function Briefcase(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export function Rocket(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84 1.2-2.1 1.2-2.1L.8 13.5c-1.5-1.5 1-4 4-4L10.5 2h9c3.2 0 5 1.8 5 5s-1.8 5-5 5H10.5L2 22z" />
    </svg>
  );
}

export function ShieldCheck(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M20 13c0 5-1.5 7.5-3.5 9-.7.2-1.5-.3-1.5-.9 0-3.3-2.5-6-5-6s-5 2.7-5 6c0 .5-.8 1.2-1.5.9C4 20.5 2 18 2 13V5l10-4 10 4z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
