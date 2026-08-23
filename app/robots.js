export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/"],
    },
    sitemap: "https://sivatejachary.vercel.app/sitemap.xml",
  };
}
