/**
 * Query Intent & Metadata Classification Layer for RAG & Calculation Engine
 */

export function detectQueryIntent(query) {
  const q = (query || "").toLowerCase().trim();

  // 1. Client Project & Specific Query Intent Matching
  if (q.includes("client project") || q.includes("client projects") || q.includes("br reddy") || q.includes("brreddy") || q.includes("b.r. reddy")) {
    return {
      intent: "project_query",
      type: "project",
      category: "client_project",
      project: "B.R. Reddy Enterprises Web Platform",
      company: "Client Project"
    };
  }

  // 2. Experience Duration & Calculation Intent Matching (MANDATORY DURATION)
  if (
    q.includes("shiva's ai/ml experience") ||
    q.includes("shiva's experience") ||
    q.includes("how much ai/ml experience") ||
    q.includes("how much experience") ||
    q.includes("how many years of experience") ||
    q.includes("how long has shiva been working") ||
    q.includes("total experience") ||
    q.includes("professional experience") ||
    q.includes("tell me about his ai/ml experience") ||
    q.includes("tell me about shiva's ai/ml experience")
  ) {
    return {
      intent: "experience_query",
      type: "experience",
      category: "experience",
      requiresCalculation: true,
      calculationType: "experience_duration",
      project: null,
      company: null
    };
  }

  // 3. Universal Calculation & Reasoning Intent Detection
  if (
    q.includes("how long") ||
    q.includes("how many months") ||
    q.includes("how many years") ||
    q.includes("how many projects") ||
    q.includes("how many rag") ||
    q.includes("how many nlp") ||
    q.includes("how many companies") ||
    q.includes("what percentage") ||
    q.includes("percentage of") ||
    q.includes("difference between") ||
    q.includes("compare") ||
    q.includes("highest accuracy") ||
    q.includes("highest effort") ||
    q.includes("how did you calculate")
  ) {
    return {
      intent: "calculation_query",
      isCalculation: true,
      requiresCalculation: true,
      calculationType: "generic_calculation",
      type: "calculation",
      category: "calculation"
    };
  }

  // 4. Specific Project Intent Matching
  if (q.includes("enterprise rag") || q.includes("rag platform")) {
    return {
      intent: "project_query",
      type: "project",
      category: "rag",
      project: "Enterprise RAG Platform",
      company: "Avataa Solutions"
    };
  }

  if (q.includes("plant disease") || q.includes("crop disease") || q.includes("cnn plant") || q.includes("leaf")) {
    return {
      intent: "project_query",
      type: "project",
      category: "computer_vision",
      project: "CNN Plant Disease Detection System",
      company: null
    };
  }

  if (q.includes("document ai") || q.includes("compliance automation") || q.includes("invoice")) {
    return {
      intent: "project_query",
      type: "project",
      category: "document_ai",
      project: "Enterprise Document AI & Compliance Automation",
      company: "Avataa Solutions"
    };
  }

  if (q.includes("resume screening") || q.includes("candidate ranker") || q.includes("screening system")) {
    return {
      intent: "project_query",
      type: "project",
      category: "nlp",
      project: "AI Resume Screening System",
      company: null
    };
  }

  if (q.includes("huggingface") || q.includes("ai-talli") || q.includes("ai-thalli") || q.includes("open source")) {
    return {
      intent: "project_query",
      type: "project",
      category: "open_source",
      project: "HuggingFace Open Source Contributions",
      company: null
    };
  }

  // 5. Category & Group Intent Matching
  if (q.includes("rag project") || q.includes("rag projects") || q.includes("rag")) {
    return {
      intent: "project_query",
      type: "project",
      category: "rag",
      project: null,
      company: null
    };
  }

  if (q.includes("project") || q.includes("projects") || q.includes("built") || q.includes("develop")) {
    return {
      intent: "project_query",
      type: "project",
      category: null,
      project: null,
      company: null
    };
  }

  // 6. Work Experience & Company Matching
  if (q.includes("avataa") || q.includes("avataa solutions") || q.includes("fastapi")) {
    return {
      intent: "experience_query",
      type: "experience",
      category: "experience",
      requiresCalculation: true,
      calculationType: "experience_duration",
      project: null,
      company: "Avataa Solutions"
    };
  }

  if (q.includes("sagemaker") || q.includes("aws virtual") || q.includes("internship")) {
    return {
      intent: "experience_query",
      type: "experience",
      category: "experience",
      project: null,
      company: "AWS"
    };
  }

  if (q.includes("experience") || q.includes("work history") || q.includes("career") || q.includes("industry")) {
    return {
      intent: "experience_query",
      type: "experience",
      category: "experience",
      requiresCalculation: true,
      calculationType: "experience_duration",
      project: null,
      company: null
    };
  }

  // 7. Skills & Technical Stack Intent Matching
  if (q.includes("tech") || q.includes("technology") || q.includes("technologies") || q.includes("skill") || q.includes("skills") || q.includes("stack") || q.includes("language") || q.includes("python") || q.includes("vector db") || q.includes("database") || q.includes("databases") || q.includes("genai")) {
    return {
      intent: "skills_query",
      type: "skills",
      category: "skills",
      project: null,
      company: null
    };
  }

  // 8. Education & Certifications Intent Matching
  if (q.includes("education") || q.includes("b.tech") || q.includes("college") || q.includes("degree") || q.includes("cgpa") || q.includes("university")) {
    return {
      intent: "education_query",
      type: "education",
      category: "education",
      project: null,
      company: null
    };
  }

  if (q.includes("certification") || q.includes("certifications") || q.includes("award") || q.includes("awards") || q.includes("hackathon")) {
    return {
      intent: "certification_query",
      type: "education",
      category: "education",
      project: null,
      company: null
    };
  }

  // 9. Contact & Hiring Intent Matching
  if (q.includes("contact") || q.includes("email") || q.includes("phone") || q.includes("reach") || q.includes("hire") || q.includes("linkedin") || q.includes("github")) {
    return {
      intent: "contact_query",
      type: "contact",
      category: "contact",
      project: null,
      company: null
    };
  }

  // 10. Profile / Bio / Summary Intent Matching
  if (q.includes("who is shiva") || q.includes("who is siva") || q.includes("about shiva") || q.includes("recruiter summary") || q.includes("summary") || q.includes("shiva") || q.includes("siva")) {
    return {
      intent: "profile_query",
      type: "profile",
      category: "profile",
      project: null,
      company: null
    };
  }

  return {
    intent: "general_query",
    type: null,
    category: null,
    project: null,
    company: null
  };
}
