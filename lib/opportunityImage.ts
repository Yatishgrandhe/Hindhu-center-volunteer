const FALLBACKS = [
  "/images/seva-kitchen.jpg",
  "/images/seva-setup.jpg",
  "/images/seva-greeter.jpg",
  "/images/seva-garden.jpg",
  "/images/seva-community.jpg",
];

const KEYWORDS: [RegExp, string][] = [
  [/kitchen|food|annadan|meal|cook|serv|prasad/i, "/images/seva-kitchen.jpg"],
  [/festival|diwali|holi|setup|build|construct|decor|event|stage/i, "/images/seva-setup.jpg"],
  [/greet|front\s*desk|welcome|reception|usher|host|registration/i, "/images/seva-greeter.jpg"],
  [/garden|ground|clean|outdoor|plant|landscap|yard|trail/i, "/images/seva-garden.jpg"],
];

/** Pick a themed photo for an opportunity by its title, with a stable fallback. */
export function opportunityImage(o: { id: string; title: string }): string {
  for (const [re, img] of KEYWORDS) if (re.test(o.title)) return img;
  let h = 0;
  for (const ch of o.id) h = (h + ch.charCodeAt(0)) % FALLBACKS.length;
  return FALLBACKS[h];
}
