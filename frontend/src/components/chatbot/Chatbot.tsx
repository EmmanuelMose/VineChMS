
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { ApiDomain } from "../../utils/APIDomain";
import "./Chatbot.css";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Hello! I am your VineChMS Assistant. How can I help you today?",
    },
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async () => {
    const currentInput = input.trim();

    if (!currentInput || loading) {
      return;
    }

    const userMessage: ChatMessage = {
      role: "user",
      text: currentInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = messages.slice(1).map((message) => ({
        role: message.role,
        parts: [{ text: message.text }],
      }));

      const response = await axios.post(
        `${ApiDomain}/chatbot/chat`,
        {
          message: currentInput,
          history: historyPayload,
        },
        {
          timeout: 30000,
        }
      );

      const reply =
        response?.data?.reply ||
        "I couldn't generate a response. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: reply,
        },
      ]);
    } catch (error: unknown) {
      let errorMessage =
        "The VineChMS Assistant is temporarily unavailable. Please try again in a moment.";

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const serverMessage = error.response?.data?.error;

        if (status === 429) {
          errorMessage =
            "The VineChMS Assistant is receiving too many requests. Please try again shortly.";
        } else if (status === 503) {
          errorMessage =
            "The VineChMS Assistant is temporarily busy. Please try again in a moment.";
        } else if (status === 400) {
          errorMessage =
            serverMessage || "Please enter a valid VineChMS question.";
        } else if (status === 500) {
          errorMessage =
            serverMessage ||
            "The VineChMS Assistant is temporarily unavailable. Please try again.";
        } else if (error.code === "ECONNABORTED") {
          errorMessage =
            "The request took too long. Please check your connection and try again.";
        } else if (!error.response) {
          errorMessage =
            "Unable to connect to the VineChMS Assistant. Please check your internet connection.";
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="vine-chatbot-container">
      {isOpen ? (
        <div className="vine-chatbot-window">
          <div className="vine-chatbot-header">
            <div className="vine-chatbot-header-content">
              <span className="vine-chatbot-icon">⛪</span>
              <span className="vine-chatbot-title">
                VineChMS Assistant
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="vine-chatbot-close-btn"
              aria-label="Close chatbot"
              type="button"
            >
              <X size={20} />
            </button>
          </div>

          <div className="vine-chatbot-messages">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`vine-chatbot-message ${
                  message.role === "user" ? "user" : "bot"
                }`}
              >
                <div
                  className={`vine-chatbot-bubble ${
                    message.role === "user"
                      ? "user-bubble"
                      : "bot-bubble"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="vine-chatbot-message bot">
                <div className="vine-chatbot-bubble bot-bubble loading-bubble">
                  <Loader2
                    size={18}
                    className="vine-chatbot-loading-spinner"
                  />
                  <span>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          <div className="vine-chatbot-input-area">
            <div className="vine-chatbot-input-wrapper">
              <input
                className="vine-chatbot-input"
                type="text"
                placeholder="Ask me about VineChMS..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={handleKeyDown}
                disabled={loading}
              />
              <button
                onClick={sendMessage}
                disabled={loading || !input.trim()}
                className={`vine-chatbot-send-btn ${
                  loading || !input.trim() ? "disabled" : ""
                }`}
                type="button"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2
                    size={18}
                    className="vine-chatbot-loading-spinner"
                  />
                ) : (
                  <Send size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="vine-chatbot-toggle-btn"
          type="button"
          aria-label="Open VineChMS Assistant"
        >
          <MessageCircle size={24} />
          <span className="vine-chatbot-toggle-text">
            Need help?
          </span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;