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
  description: "Official portfolio of Jayavarapu Siva Tejachary — AI/ML Engineer with 2 years of experience at Avataa Solutions (Hyderabad) building Enterprise RAG platforms, FastAPI backend microservices, OpenAI & Gemini LLM applications, and B.R. Reddy Enterprises client platforms.",
  keywords: [
    "Jayavarapu Siva Tejachary",
    "Siva Tejachary",
    "Jayavarapu Siva",
    "Siva Tejachary AI ML Engineer",
    "Siva Tejachary Portfolio",
    "AI ML Engineer Hyderabad",
    "Enterprise RAG Platform",
    "Avataa Solutions",
    "FastAPI AI Engineer",
    "OpenAI Gemini Engineer",
    "Qdrant Vector DB",
    "B.R. Reddy Enterprises"
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
    icon: "/profile.png",
    shortcut: "/profile.png",
    apple: "/profile.png",
  },
  openGraph: {
    title: "Jayavarapu Siva Tejachary | AI/ML Engineer & RAG Specialist",
    description: "AI/ML Engineer with 2 years of experience at Avataa Solutions developing production AI solutions using Python, FastAPI, OpenAI, Gemini, LangChain, LangGraph, and RAG.",
    url: "https://jayavarapu-siva-tejachary.vercel.app",
    siteName: "Jayavarapu Siva Tejachary Portfolio",
    images: [
      {
        url: "/profile.png",
        width: 800,
        height: 800,
        alt: "Jayavarapu Siva Tejachary - AI/ML Engineer"
      }
    ],
    locale: "en_IN",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jayavarapu Siva Tejachary | AI/ML Engineer & RAG Specialist",
    description: "AI/ML Engineer with 2 years of experience developing production AI solutions using Python, FastAPI, OpenAI, Gemini, and RAG.",
    images: ["/profile.png"],
    creator: "@sivatejachary"
  },
  alternates: {
    canonical: "https://jayavarapu-siva-tejachary.vercel.app"
  }
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Jayavarapu Siva Tejachary",
    "alternateName": [
      "Siva Tejachary",
      "Jayavarapu Siva",
      "J. Siva Tejachary",
      "Sivatejachary"
    ],
    "jobTitle": "AI / ML Engineer",
    "worksFor": {
      "@type": "Organization",
      "name": "Avataa Solutions Pvt. Ltd.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Hyderabad",
        "addressRegion": "Telangana",
        "addressCountry": "India"
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
      "addressCountry": "India"
    },
    "url": "https://jayavarapu-siva-tejachary.vercel.app",
    "image": "https://jayavarapu-siva-tejachary.vercel.app/profile.png",
    "sameAs": [
      "https://github.com/sivatejachary",
      "https://www.linkedin.com/in/jayavarapu-siva-tejachary/",
      "https://huggingface.co/Shiva-teja-chary",
      "https://www.brreddyenterprises.in/"
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
      "PostgreSQL",
      "Azure OCR & NER",
      "OpenAI & Gemini API"
    ]
  };

  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
