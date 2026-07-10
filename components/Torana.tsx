import type { SVGProps } from "react";

/** An ornamental temple arch (torana) drawn as light line-work. */
export function Torana(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 240 120" fill="none" stroke="currentColor" aria-hidden {...props}>
      <g strokeLinecap="round" strokeLinejoin="round">
        {/* outer arch */}
        <path d="M28 118 L28 62 Q28 20 120 12 Q212 20 212 62 L212 118" strokeWidth="2.2" />
        {/* inner arch */}
        <path d="M42 118 L42 66 Q42 32 120 25 Q198 32 198 66 L198 118" strokeWidth="1.2" opacity="0.6" />
        {/* finial / kalasha */}
        <path d="M120 12 L120 2" strokeWidth="2" />
        <circle cx="120" cy="8" r="4.5" strokeWidth="1.8" fill="currentColor" fillOpacity="0.15" />
        <path d="M110 6 Q120 -6 130 6" strokeWidth="1.2" opacity="0.7" />
        {/* pillar caps */}
        <path d="M22 62 L34 62 M206 62 L218 62" strokeWidth="1.6" />
        {/* small dots along the arch */}
        <g fill="currentColor" stroke="none" opacity="0.55">
          <circle cx="70" cy="30" r="2" />
          <circle cx="120" cy="23" r="2" />
          <circle cx="170" cy="30" r="2" />
        </g>
      </g>
    </svg>
  );
}
