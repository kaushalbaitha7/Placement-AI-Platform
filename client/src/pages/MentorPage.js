import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import "../styles/mentorChat.css";
import HomeButton from "../components/HomeButton";
import Navigator from "../components/Navigator";

function MentorPage() {

  const userId = "123";

  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  /* =========================
     LOAD SESSION LIST
  ========================== */

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await fetch(
      `http://localhost:5000/api/mentor/history/${userId}`
    );
    const data = await res.json();
    setSessions(data);
  };

  /* =========================
     LOAD ONE SESSION
  ========================== */

  const loadSession = (session) => {
    setActiveSession(session._id);
    setChat(session.messages || []);
  };

  /* =========================
     NEW CHAT
  ========================== */

  const createNewChat = () => {
    setActiveSession(null);
    setChat([]);
  };

  /* =========================
     HANDLE ASK (STREAM)
  ========================== */

  const handleAsk = async () => {

    if (!message.trim() || loading) return;

    const userMessage = { role: "user", content: message };
    const assistantPlaceholder = { role: "assistant", content: "" };

    const updatedChat = [...chat, userMessage, assistantPlaceholder];

    setChat(updatedChat);
    setMessage("");
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/mentor/stream", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        messages: updatedChat
          .filter(m => !(m.role === "assistant" && m.content === ""))
          .map(m => ({
            role: m.role,
            content: m.content
          }))
      })
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      fullText += chunk;

      setChat(prev => {
        const copy = [...prev];
        copy[copy.length - 1].content = fullText;
        return copy;
      });
    }

    setLoading(false);
    fetchSessions();
  };

  /* =========================
     AUTO SCROLL
  ========================== */

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  /* =========================
     MARKDOWN + COPY BUTTON
  ========================== */

  const MarkdownComponents = {
    pre({ children }) {
      const codeText = children?.props?.children || "";

      const copyCode = async () => {
        await navigator.clipboard.writeText(codeText);
      };

      return (
      
        <div className="code-block">
          
          <button className="copy-btn" onClick={copyCode}>
            Copy
          </button>
          <pre>{children}</pre>
        </div>
      );
    }
  };

  return (
    <div className="mentor-wrapper">

      {/* HEADER */}
      <div className="mentor-header">
  <h2 className="mentor-title">Mentor 7.0</h2>

  <div className="mentor-actions">
    <Navigator />
  </div>
</div>
      
      <div className="mentor-body">

        {/* SIDEBAR */}
        <div className="mentor-sidebar">

          <button className="new-chat-btn" onClick={createNewChat}>
            + New Chat
          </button>

          {sessions.map(session => (
            <div
              key={session._id}
              className={`session-item ${
                activeSession === session._id ? "active" : ""
              }`}
              onClick={() => loadSession(session)}
            >
              {session.messages?.[0]?.content?.slice(0, 28) || "New Chat"}
            </div>
          ))}

        </div>

        {/* CHAT AREA */}
        <div className="mentor-chat-area">

          <div className="chat-messages">

            {chat.map((msg, index) => (
              <div key={index} className={`bubble ${msg.role}`}>
                <ReactMarkdown components={MarkdownComponents}>
                  {msg.content}
                </ReactMarkdown>
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-input-area">
            <input
              type="text"
              placeholder="Ask your doubt..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAsk()}
            />
            <button onClick={handleAsk} disabled={loading}>
              {loading ? "Thinking..." : "Send"}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}

export default MentorPage;