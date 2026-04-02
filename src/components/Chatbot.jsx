import { useState, useEffect, useRef } from "react";
import "./Chatbot.css";

const CHAT_API = "https://8081-edfeacdaaaeceedaedbacbbbaecafbaeaaad.premiumproject.examly.io/ask";


function parseAnswerToNode(answer) {
  if (!answer || typeof answer !== "string") return answer;

  const rawLines = answer.split("\n");
  const lines = rawLines.map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return "";

  let header = "";
  let items = [];

  if (lines.length > 0 && !/^\d+[\.\)]\s*/.test(lines[0])) {
    header = lines[0];
    items = lines.slice(1);
  } else {
    items = lines;
  }

  const parsed = items.map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim());

  return (
    <div>
      {header ? <p style={{ margin: "0 0 6px 0", whiteSpace: "pre-wrap" }}>{header}</p> : null}
      {parsed.length > 0 ? (
        <ol style={{ margin: 0, paddingLeft: "18px" }}>
          {parsed.map((it, i) => (
            <li key={i} style={{ marginBottom: 4, whiteSpace: "pre-wrap" }}>
              {it}
            </li>
          ))}
        </ol>
      ) : (
        // fallback: show raw answer
        <div style={{ whiteSpace: "pre-wrap" }}>{answer}</div>
      )}
    </div>
  );
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "bot", text: "Hi! Ask me about analytics insights." }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const streamControllerRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const appendBotMessage = (textOrNode, replaceLast = false) => {
    setMessages((prev) => {
      if (replaceLast && prev.length && prev[prev.length - 1].from === "bot") {
        const copy = prev.slice();
        copy[copy.length - 1] = { from: "bot", text: textOrNode };
        return copy;
      }
      return [...prev, { from: "bot", text: textOrNode }];
    });
  };

  const safeJsonParse = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { from: "user", text: trimmed }]);
    setInput("");
    setTyping(true);

    appendBotMessage("...", false);

    if (streamControllerRef.current) {
      try {
        streamControllerRef.current.abort();
      } catch (e) {}
      streamControllerRef.current = null;
    }

    const controller = new AbortController();
    streamControllerRef.current = controller;

    try {
      const res = await fetch(CHAT_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: trimmed }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errText = await res.text();
        appendBotMessage(`Error: ${errText}`, true);
        setTyping(false);
        return;
      }

      if (res.body && typeof res.body.getReader === "function") {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        let accumulated = "";

        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            accumulated += decoder.decode(value, { stream: !done });
            // show partial text during stream (as raw text)
            appendBotMessage(accumulated, true);
          }
        }

        const parsed = safeJsonParse(accumulated);
        if (parsed && typeof parsed.answer === "string") {
          appendBotMessage(parseAnswerToNode(parsed.answer), true);
        } else {
          appendBotMessage(accumulated, true);
        }
      } else {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
          const json = await res.json();

          if (json && typeof json.answer === "string") {
            appendBotMessage(parseAnswerToNode(json.answer), true);
          } else if (typeof json === "string") {
            appendBotMessage(json, true);
          } else {
            appendBotMessage(JSON.stringify(json, null, 2), true);
          }
        } else {
          const text = await res.text();
          const parsed = safeJsonParse(text);
          if (parsed && typeof parsed.answer === "string") {
            appendBotMessage(parseAnswerToNode(parsed.answer), true);
          } else {
            appendBotMessage(text, true);
          }
        }
      }
    } catch (err) {
      if (err.name === "AbortError") {
        appendBotMessage("Request cancelled", true);
      } else {
        appendBotMessage("Failed to fetch response", true);
      }
    } finally {
      setTyping(false);
      streamControllerRef.current = null;
    }
  };

  return (
    <>
      <div className="chatbot-button" onClick={() => setOpen(!open)}>
        💬
      </div>

      {open && (
        <div className="chatbot-container">
          <div className="chat-header">
            Event Trackers Analytics Assistant
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}

            {typing && <div className="chat-msg bot">Analysing...</div>}

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend} aria-label="send">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
