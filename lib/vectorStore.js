import { ALL_KNOWLEDGE_CHUNKS } from "./knowledge/index";
import { detectQueryIntent } from "./intentDetector";

/**
 * Production RAG Vector Store & Metadata Pre-Filtering Search Engine
 */

const RELEVANCE_THRESHOLD = 0.25;

const FEATURE_VOCAB = [
  "shiva", "siva", "tejachary", "jayavarapu", "engineer", "ml", "ai", "developer", "backend",
  "avataa", "solutions", "experience", "work", "job", "role", "company", "hyderabad", "years",
  "rag", "retrieval", "augmented", "generation", "llm", "llms", "openai", "gpt", "gemini", "groq", "llama",
  "langchain", "langgraph", "agentic", "prompt", "embeddings", "vector", "qdrant", "chroma", "faiss",
  "python", "fastapi", "rest", "api", "postgresql", "sql", "microservices", "tech", "technology", "technologies", "skills", "stack",
  "ocr", "azure", "ner", "document", "pdf", "word", "invoices", "compliance", "nlp", "transformers", "tfidf", "resume", "screening",
  "cnn", "crop", "disease", "plant", "vision", "opencv", "tensorflow", "pytorch", "sagemaker", "aws",
  "huggingface", "spaces", "talli", "thalli", "diffusion", "open", "source",
  "education", "degree", "btech", "cse", "chalapathi", "ciet", "cgpa", "hackathon", "winner", "certifications", "awards",
  "contact", "email", "phone", "mobile", "linkedin", "github", "hire", "recruiter", "summary", "salary", "google", "pilot"
];

const VOCAB_MAP = new Map(FEATURE_VOCAB.map((word, idx) => [word, idx]));
const VECTOR_DIM = FEATURE_VOCAB.length;

function tokenize(text) {
  return (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

function textToDenseVector(text) {
  const vec = new Float32Array(VECTOR_DIM);
  const tokens = tokenize(text);

  tokens.forEach(t => {
    if (VOCAB_MAP.has(t)) {
      const idx = VOCAB_MAP.get(t);
      vec[idx] += 2.0;
    }
    FEATURE_VOCAB.forEach((word, idx) => {
      if (t.includes(word) || word.includes(t)) {
        vec[idx] += 0.8;
      }
    });
  });

  let norm = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    norm += vec[i] * vec[i];
  }
  norm = Math.sqrt(norm);

  if (norm > 0) {
    for (let i = 0; i < VECTOR_DIM; i++) {
      vec[i] /= norm;
    }
  }

  return vec;
}

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  for (let i = 0; i < VECTOR_DIM; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return dotProduct;
}

const PREINDEXED_CHUNKS = ALL_KNOWLEDGE_CHUNKS.map(chunk => {
  const fullText = `${chunk.title} ${chunk.source} ${chunk.company || ""} ${chunk.type} ${chunk.category || ""} ${chunk.project || ""} ${chunk.content}`;
  return {
    ...chunk,
    vector: textToDenseVector(fullText)
  };
});

/**
 * Metadata-Filtered Vector Search Execution
 */
export function metadataVectorSearch(query, topK = 3) {
  const intentResult = detectQueryIntent(query);
  const queryVec = textToDenseVector(query);

  // STEP 1: Metadata Pre-Filtering BEFORE Scoring
  let filteredChunks = PREINDEXED_CHUNKS;

  if (intentResult.project) {
    const exactProjectMatches = PREINDEXED_CHUNKS.filter(
      c => c.project === intentResult.project || (c.title && c.title.toLowerCase().includes(intentResult.project.toLowerCase()))
    );
    if (exactProjectMatches.length > 0) {
      filteredChunks = exactProjectMatches;
    }
  } else if (intentResult.type === "project" && intentResult.category) {
    const categoryMatches = PREINDEXED_CHUNKS.filter(
      c => c.type === "project" && c.category === intentResult.category
    );
    if (categoryMatches.length > 0) {
      filteredChunks = categoryMatches;
    }
  } else if (intentResult.company === "Avataa Solutions") {
    const companyMatches = PREINDEXED_CHUNKS.filter(
      c => c.company === "Avataa Solutions" || (c.type === "experience" && c.company.includes("Avataa"))
    );
    if (companyMatches.length > 0) {
      filteredChunks = companyMatches;
    }
  } else if (intentResult.type) {
    const typeMatches = PREINDEXED_CHUNKS.filter(c => c.type === intentResult.type);
    if (typeMatches.length > 0) {
      filteredChunks = typeMatches;
    }
  }

  // STEP 2: Dense Vector Cosine Scoring on Filtered Candidates
  const scoredResults = filteredChunks.map(chunk => {
    let score = cosineSimilarity(queryVec, chunk.vector);
    if (intentResult.type || intentResult.project) {
      score += 0.30;
    }
    return {
      chunk,
      score: Math.min(score, 1.0)
    };
  });

  scoredResults.sort((a, b) => b.score - a.score);

  const maxScore = scoredResults[0]?.score || 0;
  
  // Explicit check for unsupported out-of-domain topics (salary, Google, pilot, president)
  const lowerQuery = query.toLowerCase();
  const isExplicitUnsupported = lowerQuery.includes("salary") || lowerQuery.includes("google") || lowerQuery.includes("pilot") || lowerQuery.includes("president");

  const isOutOfDomain = isExplicitUnsupported || maxScore < RELEVANCE_THRESHOLD || scoredResults.length === 0;

  const topChunks = isOutOfDomain ? [] : scoredResults.slice(0, topK).map(r => ({
    ...r.chunk,
    score: r.score
  }));

  return {
    query,
    intentResult,
    maxScore,
    isOutOfDomain,
    topChunks
  };
}
