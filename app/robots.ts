import type { MetadataRoute } from "next";

// Block every crawler from the entire site so it never appears in search results.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        disallow: "/",
      },
    ],
  };
}
