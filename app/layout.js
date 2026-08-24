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
  metadataBase: new URL("https://jayavarapu-siva-tejachary.vercel.app"),
  title: {
    default: "Jayavarapu Siva Tejachary | AI/ML Engineer & RAG Specialist",
    template: "%s | Jayavarapu Siva Tejachary"
  },
  description: "Jayavarapu Siva Tejachary is an AI/ML Engineer with 2 years of experience building AI applications, LLM solutions, RAG systems, FastAPI services, and production AI solutions at Avataa Solutions, Hyderabad.",
  keywords: [
    "Jayavarapu Siva Tejachary",
    "Jayavarapu Siva",
    "Siva Tejachary",
    "Jayavarapu Siva Tejachary AI ML Engineer",
    "Jayavarapu Siva Tejachary AI Engineer",
    "Jayavarapu Siva Tejachary RAG",
    "Jayavarapu Siva Tejachary portfolio",
    "AI ML Engineer Hyderabad",
    "Avataa Solutions",
    "FastAPI AI Engineer",
    "OpenAI Gemini Engineer",
    "Qdrant Vector DB"
  ],
  authors: [{ name: "Jayavarapu Siva Tejachary", url: "https://github.com/sivatejachary" }],
  creator: "Jayavarapu Siva Tejachary",
  publisher: "Jayavarapu Siva Tejachary",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/jayavarapu-siva-tejachary-ai-ml-engineer.png", type: "image/png" }
    ],
    shortcut: "/favicon.svg",
    apple: "/jayavarapu-siva-tejachary-ai-ml-engineer.png",
  },
  openGraph: {
    title: "Jayavarapu Siva Tejachary | AI/ML Engineer & RAG Specialist",
    description: "Official portfolio of Jayavarapu Siva Tejachary, AI/ML Engineer specializing in AI applications, LLMs and RAG.",
    url: "https://jayavarapu-siva-tejachary.vercel.app/",
    siteName: "Jayavarapu Siva Tejachary",
    images: [
      {
        url: "https://jayavarapu-siva-tejachary.vercel.app/jayavarapu-siva-tejachary-ai-ml-engineer.png",
        width: 800,
        height: 800,
        alt: "Jayavarapu Siva Tejachary - AI/ML Engineer"
      }
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayavarapu Siva Tejachary | AI/ML Engineer",
    description: "Official portfolio of Jayavarapu Siva Tejachary.",
    images: ["https://jayavarapu-siva-tejachary.vercel.app/jayavarapu-siva-tejachary-ai-ml-engineer.png"],
    creator: "@sivatejachary"
  },
  alternates: {
    canonical: "https://jayavarapu-siva-tejachary.vercel.app/"
  }
};

export default function RootLayout({ children }) {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://jayavarapu-siva-tejachary.vercel.app/#person",
    "name": "Jayavarapu Siva Tejachary",
    "alternateName": [
      "Siva Tejachary",
      "Jayavarapu Siva",
      "J. Siva Tejachary",
      "Sivatejachary"
    ],
    "url": "https://jayavarapu-siva-tejachary.vercel.app/",
    "image": "https://jayavarapu-siva-tejachary.vercel.app/jayavarapu-siva-tejachary-ai-ml-engineer.png",
    "jobTitle": "AI/ML Engineer",
    "description": "AI/ML Engineer with 2 years of experience building AI applications, LLM solutions, and RAG systems.",
    "worksFor": {
      "@type": "Organization",
      "name": "Avataa Solutions",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "IN"
      }
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Chalapathi Institute of Engineering and Technology"
    },
    "email": "j.shivachary@gmail.com",
    "telephone": "+91-9866862016",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Hyderabad",
      "addressRegion": "Telangana",
      "addressCountry": "IN"
    },
    "sameAs": [
      "https://www.linkedin.com/in/jayavarapu-siva-tejachary/",
      "https://github.com/sivatejachary"
    ],
    "knowsAbout": [
      "Artificial Intelligence",
      "Machine Learning",
      "Generative AI",
      "Retrieval-Augmented Generation (RAG)",
      "Large Language Models (LLMs)",
      "Python",
      "FastAPI",
      "LangChain",
      "LangGraph",
      "Qdrant Vector DB",
      "PostgreSQL"
    ]
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://jayavarapu-siva-tejachary.vercel.app/#website",
    "url": "https://jayavarapu-siva-tejachary.vercel.app/",
    "name": "Jayavarapu Siva Tejachary",
    "description": "Official portfolio website of Jayavarapu Siva Tejachary, AI/ML Engineer."
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/jayavarapu-siva-tejachary-ai-ml-engineer.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
