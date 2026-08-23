"use client";

import { useState, useEffect, useRef } from "react";

// Client-side Fail-Safe Sanitizer
function sanitizeText(rawText) {
  if (!rawText) return "";
  let text = String(rawText);

  // Strip closed <think>...</think> blocks completely
  text = text.replace(/<think>[\s\S]*?<\/think>/gi, "");

  // Strip unclosed <think> blocks if missing closing tag
  if (text.toLowerCase().includes("<think>")) {
    text = text.split(/<think>/i)[0].trim();
  }

  // Filter out internal reasoning process lines
  const cleanLines = text.split("\n").filter(line => {
    const l = line.trim().toLowerCase();
    return !l.startsWith("thinking process") &&
           !l.startsWith("analyze user input") &&
           !l.startsWith("identify key entities") &&
           !l.startsWith("scan retrieved context") &&
           !l.startsWith("calculate experience") &&
           !l.startsWith("apply rules") &&
           !l.startsWith("draft response") &&
           !l.startsWith("check against rules") &&
           !l.startsWith("final output generation") &&
           !l.startsWith("self-correction") &&
           !l.startsWith("verification");
  });
  return cleanLines.join("\n").trim();
}

// Markdown parser helper for assistant responses
function renderMarkdown(rawText) {
  const text = sanitizeText(rawText);
  if (!text) return "";

  const lines = text.split("\n");
  const processed = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Bold **text**
    line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Code `code`
    line = line.replace(/`([^`]+)`/g, '<code class="chat-code">$1</code>');

    // Links [text](url)
    line = line.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="chat-link">$1</a>');

    if (line.startsWith("### ")) {
      processed.push(`<h4 class="chat-h3">${line.replace("### ", "")}</h4>`);
    } else if (line.startsWith("## ")) {
      processed.push(`<h3 class="chat-h2">${line.replace("## ", "")}</h3>`);
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      processed.push(`<li class="chat-li">${line.substring(2)}</li>`);
    } else if (line.trim() === "") {
      processed.push("<br/>");
    } else {
      processed.push(`<p class="chat-p">${line}</p>`);
    }
  }

  return processed.join("");
}

export default function ShivaAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      sender: "bot",
      answer: "👋 I'm **Shiva AI**, an AI assistant for Jayavarapu Siva Tejachary's professional profile.\n\nAsk me about his AI/ML experience, projects, technical skills, work at Avataa Solutions, or career background."
    }
  ]);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-hide tooltip after 6 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [messages, isOpen]);

  // Recruiter-focused quick action prompts
  const quickPrompts = [
    "💼 What is Shiva's AI/ML experience?",
    "🤖 Explain his RAG projects",
    "🧠 What GenAI technologies does he use?",
    "⚡ What did he build at Avataa Solutions?",
    "📂 Tell me about his projects",
    "🛠️ What are his strongest technical skills?",
    "📬 How can I contact Shiva?"
  ];

  const handleSend = async (userQuery) => {
    const queryText = (userQuery || input).trim();
    if (!queryText || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: "user",
      answer: queryText
    };

    setMessages(prev => [...prev, userMsg]);
    if (!userQuery) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: queryText,
          history: messages.map(m => ({ sender: m.sender, text: m.answer }))
        }),
      });

      const data = await res.json();
      const aiAnswer = sanitizeText(data.answer || data.text || "I don't have enough information in my knowledge base to answer that accurately.");

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          answer: aiAnswer
        }
      ]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          answer: "Sorry, Shiva AI is temporarily unavailable. Please try again in a moment."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleOpenChat = () => {
    setIsOpen(true);
    setShowTooltip(false);
  };

  return (
    <>
      {/* FLOATING ACTION BUTTON (FAB) */}
      {!isOpen && (
        <div className="shiva-fab-container">
          {/* Subtle First-Visit Tooltip */}
          {showTooltip && (
            <div className="shiva-fab-tooltip" onClick={handleOpenChat}>
              <span>👋 Ask me about Shiva</span>
              <button
                className="shiva-tooltip-close"
                onClick={(e) => { e.stopPropagation(); setShowTooltip(false); }}
              >
                ✕
              </button>
            </div>
          )}

          <button
            onClick={handleOpenChat}
            className="shiva-fab-btn"
            aria-label="Ask Shiva AI"
          >
            <div className="shiva-fab-glow" />
            <div className="shiva-fab-content">
              <img src="/profile.png" alt="Shiva AI Avatar" className="shiva-fab-avatar" />
              <span className="shiva-fab-text">Ask Shiva AI</span>
            </div>
          </button>
        </div>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div className="shiva-chat-window">
          
          {/* HEADER */}
          <div className="shiva-chat-header">
            <div className="shiva-header-info">
              <div className="shiva-header-avatar-container">
                <img src="/profile.png" alt="Shiva AI" className="shiva-header-avatar" />
              </div>
              <div>
                <div className="shiva-header-title">
                  Shiva AI
                </div>
                <div className="shiva-header-subtitle">
                  Jayavarapu Siva Tejachary Portfolio Assistant
                </div>
              </div>
            </div>

            <div className="shiva-header-actions">
              <button
                onClick={() => setIsOpen(false)}
                className="shiva-close-btn"
                title="Close Assistant"
                aria-label="Close Shiva AI Assistant"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MESSAGES CONTAINER */}
          <div className="shiva-chat-body">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`shiva-msg-row ${msg.sender === "user" ? "user-row" : "bot-row"}`}
                  >
                    {msg.sender === "bot" && (
                      <img src="/profile.png" alt="Bot" className="shiva-msg-avatar" />
                    )}

                    <div className={`shiva-msg-bubble ${msg.sender}`}>
                      {msg.sender === "user" ? (
                        <p>{msg.answer}</p>
                      ) : (
                        <div>
                          <div
                            className="shiva-markdown-content"
                            dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.answer) }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* TYPING INDICATOR */}
                {loading && (
                  <div className="shiva-msg-row bot-row">
                    <img src="/profile.png" alt="Bot" className="shiva-msg-avatar pulsing" />
                    <div className="shiva-msg-bubble bot typing">
                      <span className="dot" />
                      <span className="dot" />
                      <span className="dot" />
                      <span className="typing-text">Shiva AI is thinking...</span>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* RECRUITER QUICK PROMPT PILLS */}
              <div className="shiva-quick-prompts">
                {quickPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(prompt)}
                    className="shiva-prompt-chip"
                    disabled={loading}
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* INPUT BAR */}
              <div className="shiva-chat-input-area">
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Ask Shiva AI about Siva's experience, projects..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={loading}
                  className="shiva-chat-input"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="shiva-send-btn"
                  aria-label="Send message"
                >
                  {loading ? "⌛" : "➤"}
                </button>
              </div>

              {/* FOOTER BADGE */}
              <div className="shiva-chat-footer">
                <span>Shiva AI · Jayavarapu Siva Tejachary Portfolio Assistant</span>
              </div>
        </div>
      )}
    </>
  );
}
