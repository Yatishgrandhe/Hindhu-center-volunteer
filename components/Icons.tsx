import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const IconCalendar = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="4.5" width="18" height="16" rx="2.5" /><path d="M3 9h18M8 2.5v4M16 2.5v4" /></svg>
);
export const IconClock = (p: P) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.5V12l3 2" /></svg>
);
export const IconPin = (p: P) => (
  <svg {...base} {...p}><path d="M20 10c0 5.5-8 12-8 12s-8-6.5-8-12a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.6" /></svg>
);
export const IconUsers = (p: P) => (
  <svg {...base} {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><path d="M16 5.2a3 3 0 0 1 0 5.6M18 14c2.4.5 4 2.3 4 5" /></svg>
);
export const IconHours = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l2.4 5 5.6.6-4.2 3.8 1.2 5.6L12 21l-5 3 1.2-5.6L4 14.6 9.6 8 12 3Z" /></svg>
);
export const IconPhone = (p: P) => (
  <svg {...base} {...p}><path d="M5 3.5h3.2l1.5 4-2.1 1.6a12 12 0 0 0 5.3 5.3l1.6-2.1 4 1.5V19a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4 6.7 2 2 0 0 1 5 3.5Z" /></svg>
);
export const IconMail = (p: P) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m4 7 8 6 8-6" /></svg>
);
export const IconArrow = (p: P) => (
  <svg {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const IconCheck = (p: P) => (
  <svg {...base} {...p}><path d="M5 12.5 10 17l9-10" /></svg>
);
export const IconX = (p: P) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const IconPlus = (p: P) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconLink = (p: P) => (
  <svg {...base} {...p}><path d="M9 15l6-6" /><path d="M10.5 6.5 12 5a4 4 0 0 1 6 6l-1.5 1.5M13.5 17.5 12 19a4 4 0 0 1-6-6l1.5-1.5" /></svg>
);
export const IconCopy = (p: P) => (
  <svg {...base} {...p}><rect x="9" y="9" width="12" height="12" rx="2.5" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
);
export const IconMenu = (p: P) => (
  <svg {...base} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const IconShield = (p: P) => (
  <svg {...base} {...p}><path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3Z" /><path d="M9 12l2 2 4-4" /></svg>
);
export const IconGoogle = (p: P) => (
  <svg viewBox="0 0 24 24" width={20} height={20} {...p}>
    <path fill="#4285F4" d="M22.5 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h5.9a5 5 0 0 1-2.2 3.3v2.7h3.6c2.1-1.9 3.2-4.8 3.2-8Z" />
    <path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.6-2.7c-1 .7-2.2 1-3.6 1-2.8 0-5.1-1.9-6-4.4H2.3v2.8A11 11 0 0 0 12 23Z" />
    <path fill="#FBBC05" d="M6 14.3a6.6 6.6 0 0 1 0-4.2V7.3H2.3a11 11 0 0 0 0 9.8L6 14.3Z" />
    <path fill="#EA4335" d="M12 5.4c1.6 0 3 .5 4.1 1.6l3.1-3.1A11 11 0 0 0 12 1 11 11 0 0 0 2.3 7.3L6 10.1c.9-2.5 3.2-4.7 6-4.7Z" />
  </svg>
);
export const OmMark = (p: P) => (
  <svg viewBox="0 0 100 100" width={40} height={40} {...p} aria-hidden>
    <text x="50" y="72" textAnchor="middle" fontSize="72" fontFamily="Georgia, serif" fill="currentColor">&#2320;</text>
  </svg>
);
