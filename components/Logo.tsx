import Image from "next/image";

const RATIO = 96 / 55;

/**
 * The HCCLT wordmark ships on a black background, so we frame it in a dark
 * "plaque" with a thin gold edge — this reads as a crest rather than a
 * floating black box on the cream UI.
 */
export function Logo({ height = 40 }: { height?: number }) {
  const imgHeight = height;
  const imgWidth = Math.round(RATIO * imgHeight);
  return (
    <span className="logo-chip">
      <Image
        src="/logo.png"
        alt="Hindu Center of Charlotte"
        width={imgWidth}
        height={imgHeight}
        style={{ height: imgHeight, width: "auto" }}
        priority
      />
    </span>
  );
}
