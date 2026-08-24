export default function sitemap() {
  const baseUrl = "https://jayavarapu-siva-tejachary.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
