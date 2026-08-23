import { metadataVectorSearch } from "./vectorStore";
import { executeCalculationEngine, calculateDuration } from "./calculationEngine";

/**
 * Production RAG Context Retrieval & Grounded Context Assembly Engine
 */
export function getRAGContext(query) {
  const searchResult = metadataVectorSearch(query, 3);
  const calcResult = executeCalculationEngine(query, searchResult.intentResult);

  // Mandatory Experience Duration Fact Construction
  const isExpDuration = searchResult.intentResult.calculationType === "experience_duration" || 
                        searchResult.intentResult.intent === "experience_query";

  const expDurationObj = calculateDuration("2024-06-01", "present");

  const mandatoryFact = {
    type: "calculated_fact",
    key: "ai_ml_experience_duration",
    value: expDurationObj.formatted,
    totalMonths: expDurationObj.totalMonths,
    formattedDuration: `${expDurationObj.formatted} (${expDurationObj.totalMonths} months)`
  };

  if (searchResult.isOutOfDomain && !calcResult && !isExpDuration) {
    return {
      isOutOfDomain: true,
      contextText: "",
      sources: [],
      rawChunks: [],
      calcResult: null,
      mandatoryFact: null,
      requiresExperienceDuration: false,
      retrievalInfo: {
        intent: searchResult.intentResult.intent,
        category: searchResult.intentResult.category || "unknown",
        chunksUsed: 0,
        maxScore: searchResult.maxScore
      }
    };
  }

  // Construct isolated context string from pre-filtered chunks
  let contextText = searchResult.topChunks
    .map(c => `[DOCUMENT: ${c.title} | Source: ${c.source} | Company: ${c.company || 'N/A'}]\n${c.content}`)
    .join("\n\n");

  if (isExpDuration || calcResult) {
    const factHeader = `[MANDATORY CALCULATED FACT: ai_ml_experience_duration = "${mandatoryFact.value}"]\n` +
      `AUTHORITATIVE VALUE: Shiva has approximately ${mandatoryFact.value} of total professional AI/ML experience (${mandatoryFact.totalMonths} months, June 2024 – Present at Avataa Solutions).\n\n`;
    contextText = factHeader + contextText;
  }

  const sources = searchResult.topChunks.map(c => ({
    title: c.title,
    category: c.source,
    type: c.type
  }));

  return {
    isOutOfDomain: false,
    contextText,
    sources,
    rawChunks: searchResult.topChunks,
    calcResult,
    mandatoryFact: isExpDuration ? mandatoryFact : null,
    requiresExperienceDuration: isExpDuration,
    retrievalInfo: {
      intent: searchResult.intentResult.intent,
      category: searchResult.intentResult.category || searchResult.intentResult.type || "general",
      chunksUsed: searchResult.topChunks.length,
      maxScore: searchResult.maxScore
    }
  };
}

/**
 * Deterministic Grounded Local Fallback (when GROQ_API_KEY is not set)
 */
export function generateLocalRAGResponse(query, sources, rawChunks, intentInfo) {
  const q = query.toLowerCase();

  if (q.includes("client project") || q.includes("client projects") || q.includes("br reddy") || q.includes("brreddy") || q.includes("b.r. reddy")) {
    return {
      answer: "## Client Projects\n\nSiva engineered and deployed the official production web application for **B.R. Reddy Enterprises**.\n\n- **Project**: B.R. Reddy Enterprises Web Platform\n- **Live Website**: [https://www.brreddyenterprises.in/](https://www.brreddyenterprises.in/)\n- **Tech**: Modern Web Application Architecture, Responsive UI/UX, SEO Optimization.",
      sources: sources.length > 0 ? sources : [{ title: "Client Projects — B.R. Reddy Enterprises", category: "Client Projects", type: "project" }],
      retrieval: intentInfo
    };
  }

  const isExpQuery = q.includes("experience") || q.includes("work at avataa") || q.includes("avataa");

  if (isExpQuery) {
    const durationObj = calculateDuration("2024-06-01", "present");
    return {
      answer: `Shiva has approximately **${durationObj.formatted}** of AI/ML experience. He has been working as an AI/ML Engineer at Avataa Solutions Pvt. Ltd. in Hyderabad since June 2024, where he develops production AI applications using Python, FastAPI, OpenAI, Gemini, LangChain, LangGraph, and RAG. His experience mainly covers Generative AI, RAG platforms, document intelligence, Azure OCR, NER, embeddings, and PostgreSQL microservices.`,
      sources: sources.length > 0 ? sources : [{ title: "AI/ML Engineer — Avataa Solutions Pvt. Ltd.", category: "Work Experience · Avataa Solutions", type: "experience" }],
      retrieval: intentInfo
    };
  }

  // 1. Check Calculation Engine Output
  const calc = executeCalculationEngine(query, intentInfo);
  if (calc) {
    return {
      answer: calc.answer,
      sources: sources.length > 0 ? sources : [{ title: "Calculation Engine", category: "Derived Metrics", type: "calculation" }],
      retrieval: intentInfo
    };
  }

  let answer = "";

  // 2. Exact Numerical & Fact Queries
  if (q.includes("cgpa")) {
    answer = "Siva's B.Tech CGPA is **7.9 / 10**.";
  } else if (q.includes("accuracy") || q.includes("matching accuracy") || q.includes("resume screening accuracy")) {
    answer = "The AI Resume Screening System achieved **85%+ match accuracy**.";
  } else if (q.includes("effort reduction") || (q.includes("effort") && q.includes("reduce"))) {
    answer = "The Document AI and Compliance System achieved **70–85% effort reduction** through AI-powered automation.";
  } else if (q.includes("when did shiva join") || (q.includes("join") && q.includes("avataa"))) {
    answer = "Siva joined Avataa Solutions Pvt. Ltd. as an AI/ML Engineer in **June 2024**.";
  } else if (q.includes("how many production") || q.includes("salary") || q.includes("google") || q.includes("pilot")) {
    answer = "I don't have a specific number or documented information for that in my knowledge base.";
  } else if (q.includes("rag project") || q.includes("rag projects") || q.includes("enterprise rag")) {
    answer = "Siva's primary RAG project is the **Enterprise RAG Platform** at Avataa Solutions. Built using Python, FastAPI, Qdrant Vector DB, LangChain, LangGraph, OpenAI, and Gemini, it extracts text and tables from enterprise documents to deliver precise semantic search answers.";
  } else if (q.includes("plant disease") || q.includes("crop disease")) {
    answer = "Siva built the **CNN Plant Disease Detection System** using TensorFlow, OpenCV, and Flask to classify crop leaf diseases. It achieved a Top 5 ranking among 250+ participants at a college hackathon.";
  } else if (q.includes("document ai") || q.includes("compliance automation")) {
    answer = "Siva engineered the **Enterprise Document AI & Compliance Automation** platform at Avataa Solutions using Azure OCR, NER, Gemini LLM, and FastAPI microservices, achieving **70–85% effort reduction** in manual document reviews.";
  } else if (q.includes("resume screening") || q.includes("candidate ranker")) {
    answer = "Siva developed an **AI Resume Screening System** using NLP, TF-IDF, and Transformer embeddings. It ranks candidate resumes against job descriptions with **85%+ match accuracy**, cutting screening effort by 60%.";
  } else if (q.includes("skill") || q.includes("tech") || q.includes("stack")) {
    answer = "Siva's core technical stack includes **Python, FastAPI, OpenAI, Gemini, Groq (LLaMA 3.3), LangChain, LangGraph, RAG, Qdrant Vector DB, PostgreSQL, Azure OCR, NER, TensorFlow, PyTorch, and Docker**.";
  } else if (q.includes("contact") || q.includes("email") || q.includes("phone")) {
    answer = "You can contact Siva directly:\n- 📧 **Email**: [j.shivachary@gmail.com](mailto:j.shivachary@gmail.com)\n- 📞 **Phone**: [+91-9866862016](tel:+919866862016)\n- 💼 **LinkedIn**: [jayavarapu-siva-tejachary](https://www.linkedin.com/in/jayavarapu-siva-tejachary/)\n- 🐙 **GitHub**: [sivatejachary](https://github.com/sivatejachary)\n- 📍 **Location**: Hyderabad, India";
  } else if (q.includes("who is shiva") || q.includes("recruiter summary")) {
    answer = "Jayavarapu Siva Tejachary is an AI/ML Engineer with 2 years of experience at **Avataa Solutions** (Hyderabad). He specializes in Enterprise RAG platforms, FastAPI backend microservices, OpenAI & Gemini LLM workflows, Qdrant vector databases, and Document AI automation.";
  } else if (rawChunks && rawChunks.length > 0) {
    answer = rawChunks.map(c => `${c.content}`).join("\n\n");
  } else {
    answer = "I don't have enough information in my knowledge base to answer that accurately.";
  }

  return {
    answer,
    sources,
    retrieval: intentInfo
  };
}
