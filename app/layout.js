import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata = {
  title: "JAYAVARAPU SIVA TEJACHARY — AI / ML Engineer",
  description: "Portfolio of Jayavarapu Siva Tejachary, AI/ML Engineer with 2 years of experience at Avataa Solutions building Enterprise RAG platforms, FastAPI services, and LLM applications.",
  keywords: ["Jayavarapu Siva Tejachary", "AI Engineer", "ML Engineer", "FastAPI", "LangChain", "LangGraph", "OpenAI", "Gemini", "RAG", "Qdrant", "PostgreSQL", "Avataa Solutions", "Hyderabad"],
  authors: [{ name: "Jayavarapu Siva Tejachary" }],
  icons: {
    icon: "/profile.png",
    shortcut: "/profile.png",
    apple: "/profile.png",
  },
  openGraph: {
    title: "JAYAVARAPU SIVA TEJACHARY — AI / ML Engineer",
    description: "AI/ML Engineer with 2 years of experience developing scalable AI applications using Python, FastAPI, OpenAI, Gemini, and RAG.",
    url: "https://sivatejachary.dev",
    siteName: "Jayavarapu Siva Tejachary Portfolio",
    images: [{ url: "https://github.com/sivatejachary.png" }],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Jayavarapu Siva Tejachary",
              "jobTitle": "AI / ML Engineer",
              "worksFor": {
                "@type": "Organization",
                "name": "Avataa Solutions Pvt. Ltd."
              },
              "email": "j.shivachary@gmail.com",
              "telephone": "+919866862016",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "addressCountry": "IN"
              },
              "url": "https://sivatejachary.dev",
              "sameAs": [
                "https://github.com/sivatejachary",
                "https://www.linkedin.com/in/jayavarapu-siva-tejachary/",
                "https://huggingface.co/Shiva-teja-chary"
              ]
            })
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
