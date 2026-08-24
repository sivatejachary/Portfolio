"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import ShivaAssistant from "./components/ShivaAssistant";

/* ── Typewriter hook ── */
function useTypewriter(text, speed = 55, startDelay = 800) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed("");
    setDone(false);
    const delay = setTimeout(() => {
      const id = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(id); setDone(true); }
      }, speed);
      return () => clearInterval(id);
    }, startDelay);
    return () => clearTimeout(delay);
  }, [text, speed, startDelay]);

  return { displayed, done };
}

/* ── Animated counter hook ── */
function useCounter(target, duration = 1500, startSignal = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!startSignal) return;
    const startTime = performance.now();
    const raf = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }, [target, duration, startSignal]);
  return value;
}

/* ── Clean scroll helper — no hash in URL ── */
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
};

export default function Home() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [projectsKey, setProjectsKey] = useState(0);
  const canvasRef = useRef(null);
  const statsRef = useRef(null);

  // ── Typewriter on headline ──
  const headline = "Building Scalable AI Applications, LLMs & Enterprise RAG.";
  const { displayed: typedText, done: typingDone } = useTypewriter(headline, 40, 900);

  // ── Animated counters ──
  const c1 = useCounter(2,    1200, statsVisible);
  const c2 = useCounter(85,   1400, statsVisible);
  const c3 = useCounter(85,   1400, statsVisible);

  // ── Particle canvas ──
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animId;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);

    const PARTICLE_COUNT = 110;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.6 + 0.2,
      hue: Math.random() > 0.5 ? 265 : 193,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 80%, 70%, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  // ── Dynamic system theme listener (prefers-color-scheme) ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const applySystemTheme = (e) => {
      document.documentElement.setAttribute("data-theme", e.matches ? "dark" : "light");
    };
    applySystemTheme(media);
    media.addEventListener("change", applySystemTheme);
    return () => media.removeEventListener("change", applySystemTheme);
  }, []);

  // ── Always start at top on refresh ──
  useEffect(() => {
    sessionStorage.removeItem("scrollY");
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // ── IntersectionObserver for scroll-reveal ──
  useEffect(() => {
    const targets = document.querySelectorAll(
      ".reveal, .exp-card, .section-header, .skill-card, .edu-card, .contact-box, .contact-links, footer"
    );

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });

    targets.forEach(el => io.observe(el));

    // Stats observer
    if (statsRef.current) {
      const statsIo = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) { setStatsVisible(true); statsIo.disconnect(); }
      }, { threshold: 0.3 });
      statsIo.observe(statsRef.current);
    }

    return () => io.disconnect();
  }, []);

  // ── Project card stagger on filter change ──
  useEffect(() => {
    const cards = document.querySelectorAll(".project-card");
    cards.forEach(c => c.classList.remove("card-visible"));
    cards.forEach((c, i) => {
      setTimeout(() => c.classList.add("card-visible"), i * 100 + 60);
    });
  }, [activeFilter, projectsKey]);

  const projects = [
    {
      id: "rag-platform",
      title: "Enterprise RAG Platform",
      category: "rag",
      featured: true,
      tag: "ENTERPRISE PLATFORM",
      date: "JAN 2026 – PRESENT",
      desc: "Built an AI platform to chat with company documents using Retrieval-Augmented Generation (RAG). Processed PDF and Word documents, generated embeddings, and stored them in a Qdrant vector database. Developed FastAPI APIs and integrated OpenAI/Gemini with LangChain & LangGraph for context-aware responses.",
      tech: ["Python", "FastAPI", "LangChain", "LangGraph", "OpenAI", "Qdrant", "PostgreSQL"],
    },
    {
      id: "doc-ai",
      title: "Enterprise Document AI & Compliance Automation",
      category: "rag",
      featured: false,
      tag: "DOCUMENT AI",
      date: "OCT 2024 – JAN 2026",
      desc: "Built an AI system to extract invoice data from scanned PDFs using Azure OCR and NER. Integrated Gemini LLM and developed FastAPI APIs for document processing and compliance automation, reducing manual document review effort by 70–85%.",
      tech: ["FastAPI", "Azure OCR", "NER", "Gemini LLM", "PostgreSQL"],
    },
    {
      id: "resume-ai",
      title: "AI Resume Screening System",
      category: "nlp",
      featured: false,
      tag: "NLP & RECRUITMENT",
      date: "AUG 2024 – SEPT 2024",
      desc: "Built an NLP-based resume screening system using TF-IDF and Transformer embeddings to analyze 500+ candidate resumes. Developed a ranking algorithm with 85%+ matching accuracy, reducing manual screening time by 60%.",
      tech: ["Python", "FastAPI", "Transformers", "TF-IDF", "NLP"],
    },
    {
      id: "plant-ai",
      title: "CNN Plant Disease Detection System",
      category: "cv",
      featured: false,
      tag: "COMPUTER VISION",
      date: "TOP 5 HACKATHON WINNER",
      desc: "Built a CNN-powered plant disease detection system to help farmers identify crop diseases early from leaf images. Ranked Top 5 among 250+ participants in college hackathon.",
      tech: ["TensorFlow", "OpenCV", "Flask", "Python"],
    },
    {
      id: "hf-hub",
      title: "HuggingFace Open Source Contributions",
      category: "nlp",
      featured: false,
      tag: "OPEN SOURCE",
      date: "HUGGINGFACE HUB",
      desc: "Published 25 HuggingFace Spaces and 2 fine-tuned custom models (ai-talli 0.1B LLM and ai-thalli Stable Diffusion) for community NLP and GenAI experimentation.",
      tech: ["HuggingFace", "Transformers", "PyTorch"],
    },
    {
      id: "brreddy-client",
      title: "B.R. Reddy Enterprises Web Platform",
      category: "client",
      featured: true,
      tag: "CLIENT PROJECT",
      date: "LIVE PRODUCTION",
      desc: "Engineered and deployed the official production website and digital business platform for B.R. Reddy Enterprises. Built modern responsive UI/UX, optimized performance, and implemented SEO best practices.",
      tech: ["Web Development", "Responsive UI/UX", "SEO", "Production App"],
      link: "https://www.brreddyenterprises.in/"
    },
  ];

  const filteredProjects = activeFilter === "all"
    ? projects
    : projects.filter(p => p.category === activeFilter);

  const handleFilterChange = (f) => {
    setActiveFilter(f);
    setProjectsKey(k => k + 1);
  };

  return (
    <>
      {/* Particle canvas */}
      <canvas ref={canvasRef} id="particles-canvas" aria-hidden="true" />

      <div className="grid-bg"></div>
      <div className="orb orb1"></div>
      <div className="orb orb2"></div>
      <div className="orb orb3"></div>

      {/* HEADER */}
      <header>
        <div className="top-name-banner nav-anim-banner">
          <span className="banner-name">JAYAVARAPU SIVA TEJACHARY</span>
          <span className="banner-sep">·</span>
          <span className="banner-role">AI / ML ENGINEER</span>
        </div>
        <nav>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
            <span className="nav-anim-location">HYDERABAD, TELANGANA, INDIA</span>
          </div>
          <ul className="nav-links">
            <li style={{ "--nav-i": 0 }}><button className="nav-btn" onClick={() => scrollTo("hero")}>About</button></li>
            <li style={{ "--nav-i": 1 }}><button className="nav-btn" onClick={() => scrollTo("experience")}>Experience</button></li>
            <li style={{ "--nav-i": 2 }}><button className="nav-btn" onClick={() => scrollTo("projects")}>Projects</button></li>
            <li style={{ "--nav-i": 3 }}><button className="nav-btn" onClick={() => scrollTo("skills")}>Skills</button></li>
            <li style={{ "--nav-i": 4 }}><button className="nav-btn" onClick={() => scrollTo("education")}>Education</button></li>
            <li style={{ "--nav-i": 5 }}><button className="nav-btn" onClick={() => scrollTo("awards")}>Awards</button></li>
            <li style={{ "--nav-i": 6 }}><button className="nav-btn" onClick={() => scrollTo("contact")}>Contact</button></li>
          </ul>
          <div className="nav-desktop-actions" style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setIsResumeModalOpen(true)} className="btn btn-secondary nav-anim-btn-1" style={{ padding: "5px 12px", fontSize: "12px" }}>View Resume</button>
            <button onClick={() => scrollTo("contact")} className="btn btn-primary nav-anim-btn-2" style={{ padding: "5px 14px", fontSize: "12px" }}>Get in Touch</button>
          </div>
          <button
            className="mobile-hamburger-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Mobile Navigation Menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </nav>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="mobile-dropdown-menu">
            <ul className="mobile-menu-links">
              <li><button onClick={() => { scrollTo("hero"); setIsMobileMenuOpen(false); }}>About</button></li>
              <li><button onClick={() => { scrollTo("experience"); setIsMobileMenuOpen(false); }}>Experience</button></li>
              <li><button onClick={() => { scrollTo("projects"); setIsMobileMenuOpen(false); }}>Projects</button></li>
              <li><button onClick={() => { scrollTo("skills"); setIsMobileMenuOpen(false); }}>Skills</button></li>
              <li><button onClick={() => { scrollTo("education"); setIsMobileMenuOpen(false); }}>Education</button></li>
              <li><button onClick={() => { scrollTo("awards"); setIsMobileMenuOpen(false); }}>Awards</button></li>
              <li><button onClick={() => { scrollTo("contact"); setIsMobileMenuOpen(false); }}>Contact</button></li>
            </ul>
            <div className="mobile-menu-actions">
              <button onClick={() => { setIsResumeModalOpen(true); setIsMobileMenuOpen(false); }} className="btn btn-secondary" style={{ width: "100%", justifyContent: "center" }}>View Resume</button>
              <button onClick={() => { scrollTo("contact"); setIsMobileMenuOpen(false); }} className="btn btn-primary" style={{ width: "100%", justifyContent: "center" }}>Get in Touch</button>
            </div>
          </div>
        )}
      </header>

      <div className="container">

        {/* HERO SECTION */}
        <section id="hero">

          {/* TOP ROW: PROFILE PHOTO ON LEFT, NAME & ROLE ON RIGHT */}
          <div className="hero-top-row">

            {/* LEFT SIDE: PROFILE PHOTO */}
            <div className="hero-profile-card">
              <img src="/profile.png" alt="Jayavarapu Siva Tejachary" className="profile-img" />
            </div>

            {/* RIGHT SIDE: NAME & ROLE */}
            <div className="hero-top-info">
              <div className="main-name-title hero-anim-name">JAYAVARAPU SIVA TEJACHARY</div>
              <div className="role-subtitle hero-anim-role">AI / ML ENGINEER</div>
              <div className="hero-badge hero-anim-badge">
                2 Years Experience · Avataa Solutions (Hyderabad)
              </div>
            </div>

          </div>

          {/* MIDDLE SECTION: TYPEWRITER HEADLINE, DESCRIPTION & ACTIONS */}
          <div className="hero-middle-section hero-anim-middle">
            <h1>
              {typedText}
              {!typingDone && <span className="typewriter-cursor" aria-hidden="true" />}
            </h1>

            <p className="hero-desc">
              AI/ML Engineer with 2 years of experience at <strong>Avataa Solutions (Hyderabad)</strong> developing production AI solutions using <strong>Python, FastAPI, OpenAI, Gemini, LangChain, LangGraph, and Retrieval-Augmented Generation (RAG)</strong>.
            </p>

            <div className="hero-actions">
              <button onClick={() => scrollTo("experience")} className="btn btn-primary">View Experience →</button>
              <button onClick={() => scrollTo("projects")} className="btn btn-secondary">Featured Projects</button>
              <button onClick={() => setIsResumeModalOpen(true)} className="btn btn-secondary">View PDF Resume 📄</button>
              <a href="/resume.pdf" download="JAYAVARAPU_SIVA_TEJACHARY_Resume.pdf" className="btn btn-secondary">Download CV 📥</a>
            </div>

            <div className="hero-meta-grid" ref={statsRef}>
              <div className="meta-card">
                <div className="meta-item-n">{c1}+ Years</div>
                <div className="meta-item-l">AI/ML Industry Experience</div>
              </div>
              <div className="meta-card">
                <div className="meta-item-n">70–85%</div>
                <div className="meta-item-l">Document Effort Reduction</div>
              </div>
              <div className="meta-card">
                <div className="meta-item-n">{c3}%+</div>
                <div className="meta-item-l">Resume Match Accuracy</div>
              </div>
              <div className="meta-card">
                <div className="meta-item-n">Top 5</div>
                <div className="meta-item-l">College Hackathon Rank</div>
              </div>
            </div>
          </div>

        </section>

        {/* EXPERIENCE SECTION */}
        <section id="experience" className="section">
          <div className="section-header reveal">
            <span className="section-tag">Work History</span>
            <h2>Professional Experience</h2>
          </div>

          <div className="exp-list">
            <div className="exp-card reveal reveal-left">
              <div className="exp-top">
                <div>
                  <div className="exp-role">AI / ML Engineer</div>
                  <div className="exp-company">Avataa Solutions Pvt. Ltd. · Hyderabad, India</div>
                </div>
                <span className="exp-date">June 2024 – Present</span>
              </div>
              <ul className="exp-bullets">
                <li>Developed AI-powered applications using Python, FastAPI, NLP, LLMs (OpenAI, Gemini), and Retrieval-Augmented Generation (RAG).</li>
                <li>Built scalable REST APIs for AI-based document processing and intelligent enterprise automation.</li>
                <li>Integrated OpenAI and Gemini APIs for document summarization and AI workflows using prompt engineering.</li>
                <li>Worked on OCR, NER, embeddings, and data preprocessing for document analysis.</li>
                <li>Developed backend services using FastAPI and PostgreSQL for real-time event-driven processing.</li>
                <li>Collaborated with cross-functional teams to build and deploy production-ready AI solutions.</li>
              </ul>
            </div>

            <div className="exp-card reveal reveal-right">
              <div className="exp-top">
                <div>
                  <div className="exp-role">AI / ML Virtual Intern</div>
                  <div className="exp-company">AWS SageMaker Program · AICTE Virtual Internship</div>
                </div>
                <span className="exp-date">May 2023 – Jul 2023</span>
              </div>
              <ul className="exp-bullets">
                <li>Engineered and deployed 3 supervised ML model pipelines on AWS SageMaker with 15,000+ dataset records.</li>
                <li>Improved model prediction accuracy by 18% through systematic hyperparameter optimization and cross-validation matrix tuning.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* PROJECTS SECTION WITH FILTERS */}
        <section id="projects" className="section">
          <div className="section-header reveal">
            <span className="section-tag">Production Work</span>
            <h2>Featured Projects</h2>
          </div>

          <div className="filter-bar">
            <button className={`filter-btn ${activeFilter === "all" ? "active" : ""}`} onClick={() => handleFilterChange("all")}>All Projects</button>
            <button className={`filter-btn ${activeFilter === "client" ? "active" : ""}`} onClick={() => handleFilterChange("client")}>Client Projects</button>
            <button className={`filter-btn ${activeFilter === "rag" ? "active" : ""}`} onClick={() => handleFilterChange("rag")}>Enterprise RAG & Doc AI</button>
            <button className={`filter-btn ${activeFilter === "nlp" ? "active" : ""}`} onClick={() => handleFilterChange("nlp")}>NLP & Automation</button>
            <button className={`filter-btn ${activeFilter === "cv" ? "active" : ""}`} onClick={() => handleFilterChange("cv")}>Computer Vision</button>
          </div>

          <div className="projects-grid" key={projectsKey}>
            {filteredProjects.map((p) => (
              <div key={p.id} className={`project-card ${p.featured ? "featured" : ""}`}>
                <div className="project-tag">
                  <span>{p.tag}</span>
                  <span>{p.date}</span>
                </div>
                <div className="project-title">{p.title}</div>
                <p className="project-desc">{p.desc}</p>
                <div className="tech-stack">
                  {p.tech.map((t, idx) => (
                    <span key={idx} className="tech-chip">{t}</span>
                  ))}
                </div>
                {p.link && (
                  <div style={{ marginTop: "14px" }}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary"
                      style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", padding: "6px 14px", textDecoration: "none" }}
                    >
                      🌐 Visit Live Website →
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section id="skills" className="section">
          <div className="section-header reveal">
            <span className="section-tag">Capabilities</span>
            <h2>Technical Skills</h2>
          </div>

          <div className="skills-grid">
            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">Generative AI & LLMs</div>
              <div className="skill-tags">
                <span className="skill-tag">LLMs</span>
                <span className="skill-tag">OpenAI</span>
                <span className="skill-tag">Gemini</span>
                <span className="skill-tag">RAG</span>
                <span className="skill-tag">Prompt Eng</span>
                <span className="skill-tag">LangChain</span>
                <span className="skill-tag">LangGraph</span>
                <span className="skill-tag">Transformers</span>
              </div>
            </div>

            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">Programming & Backend</div>
              <div className="skill-tags">
                <span className="skill-tag">Python</span>
                <span className="skill-tag">FastAPI</span>
                <span className="skill-tag">REST APIs</span>
                <span className="skill-tag">Event-driven</span>
              </div>
            </div>

            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">NLP & Document AI</div>
              <div className="skill-tags">
                <span className="skill-tag">NER</span>
                <span className="skill-tag">Azure OCR</span>
                <span className="skill-tag">TF-IDF</span>
                <span className="skill-tag">Embeddings</span>
              </div>
            </div>

            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">Machine Learning & CV</div>
              <div className="skill-tags">
                <span className="skill-tag">Scikit-learn</span>
                <span className="skill-tag">TensorFlow</span>
                <span className="skill-tag">PyTorch</span>
                <span className="skill-tag">OpenCV</span>
              </div>
            </div>

            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">Databases & Vector DBs</div>
              <div className="skill-tags">
                <span className="skill-tag">PostgreSQL</span>
                <span className="skill-tag">Qdrant</span>
                <span className="skill-tag">Chroma</span>
                <span className="skill-tag">FAISS</span>
                <span className="skill-tag">MySQL</span>
              </div>
            </div>

            <div className="skill-card reveal reveal-scale">
              <div className="skill-card-title">Tools & Infrastructure</div>
              <div className="skill-tags">
                <span className="skill-tag">Git</span>
                <span className="skill-tag">GitHub</span>
                <span className="skill-tag">Docker</span>
                <span className="skill-tag">Azure</span>
                <span className="skill-tag">AWS SageMaker</span>
              </div>
            </div>
          </div>
        </section>

        {/* EDUCATION SECTION */}
        <section id="education" className="section">
          <div className="section-header reveal">
            <span className="section-tag">Academics</span>
            <h2>Education</h2>
          </div>

          <div className="edu-grid" style={{ gridTemplateColumns: "1fr" }}>
            <div className="edu-card">
              <div className="edu-year">SEP 2020 – APR 2024</div>
              <div className="edu-title">B.Tech in Computer Science and Engineering</div>
              <div className="edu-sub">Chalapathi Institute of Engineering and Technology, Guntur, AP · CGPA: 7.9 / 10</div>
            </div>
          </div>
        </section>

        {/* AWARDS & CERTIFICATIONS SECTION */}
        <section id="awards" className="section">
          <div className="section-header reveal">
            <span className="section-tag">Recognitions & Training</span>
            <h2>Awards & Certifications</h2>
          </div>

          <div className="edu-grid">
            <div className="edu-card">
              <div className="edu-year">COLLEGE HACKATHON (2024)</div>
              <div className="edu-title">Top 5 Winner — CNN Crop Disease AI</div>
              <div className="edu-sub">Ranked Top 5 among 250+ participants with leaf computer vision system.</div>
            </div>

            <div className="edu-card">
              <div className="edu-year">PROFESSIONAL TRAINING</div>
              <div className="edu-title">Data Science & Machine Learning Certification</div>
              <div className="edu-sub">Cranes Varsity, Bengaluru — Hands-on Python, RDBMS, EDA & ML.</div>
            </div>

            <div className="edu-card">
              <div className="edu-year">VIRTUAL INTERNSHIP</div>
              <div className="edu-title">AWS SageMaker AI/ML Program</div>
              <div className="edu-sub">Amazon Web Services & AICTE Program.</div>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="section">
          <div className="contact-box">
            <div className="reveal reveal-left">
              <h2 style={{ marginBottom: "8px" }}>Let's Connect</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "14px", marginBottom: "1.5rem" }}>
                I'm open to discussing AI/ML Engineering roles, Enterprise RAG architecture, and FastAPI backend development.
              </p>
              <button onClick={() => setIsResumeModalOpen(true)} className="btn btn-primary">View Full Resume</button>
            </div>

            <div className="contact-links">
              <a href="mailto:j.shivachary@gmail.com" className="c-link">
                <span>📧 j.shivachary@gmail.com</span>
                <span>→</span>
              </a>
              <a href="tel:+919866862016" className="c-link">
                <span>📞 +91 9866 862 016</span>
                <span>→</span>
              </a>
              <a href="https://www.linkedin.com/in/jayavarapu-siva-tejachary/" target="_blank" className="c-link">
                <span>💼 LinkedIn Profile</span>
                <span>↗</span>
              </a>
              <a href="https://github.com/sivatejachary" target="_blank" className="c-link">
                <span>🐙 GitHub Repositories</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </section>

        <footer>
          <p>© 2026 JAYAVARAPU SIVA TEJACHARY · AI / ML Engineer</p>
          <p>Hyderabad, Telangana, India</p>
        </footer>

      </div>

      {/* EMBEDDED HIGH-PERFORMANCE PDF RESUME OVERLAY MODAL */}
      <div
        className={`modal-overlay ${isResumeModalOpen ? "active" : ""}`}
        onClick={(e) => { if (e.target === e.currentTarget) setIsResumeModalOpen(false); }}
      >
        <div className="modal-content" style={{ maxWidth: "920px", padding: "1.5rem", position: "relative" }}>

          {/* TOP RIGHT PROMINENT CLOSE SYMBOL */}
          <button
            onClick={() => setIsResumeModalOpen(false)}
            aria-label="Close Resume Modal"
            style={{
              position: "absolute",
              top: "1.25rem",
              right: "1.25rem",
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "var(--chip-bg)",
              border: "1px solid var(--border-hover)",
              color: "var(--text)",
              fontSize: "1.2rem",
              fontWeight: "bold",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 9999,
              transition: "all 0.2s ease"
            }}
          >
            ✕
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", paddingBottom: "0.75rem", borderBottom: "1px solid var(--border)", paddingRight: "3.5rem" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "700", color: "var(--text)" }}>JAYAVARAPU SIVA TEJACHARY — RESUME</h3>
              <p style={{ fontSize: "13px", color: "var(--cyan)", fontFamily: "var(--font-mono)" }}>AI/ML Engineer · 2 Years Experience</p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ padding: "6px 14px", fontSize: "12px" }}>Open PDF ↗</a>
              <a href="/resume.pdf" download="JAYAVARAPU_SIVA_TEJACHARY_Resume.pdf" className="btn btn-primary" style={{ padding: "6px 14px", fontSize: "12px" }}>Download PDF 📥</a>
            </div>
          </div>

          {/* Embedded Interactive PDF Viewer */}
          <div style={{ width: "100%", height: "72vh", border: "1px solid var(--border)", borderRadius: "8px", overflow: "hidden", background: "#111218" }}>
            <iframe
              src="/resume.pdf"
              style={{ width: "100%", height: "100%", border: "none" }}
              title="Jayavarapu Siva Tejachary Resume"
            />
          </div>
        </div>
      </div>

      {/* FLOATING SHIVA AI RAG ASSISTANT CHATBOT */}
      <ShivaAssistant />
    </>
  );
}

