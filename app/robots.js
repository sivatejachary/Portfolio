export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://jayavarapu-siva-tejachary.vercel.app/sitemap.xml",
  };
}
