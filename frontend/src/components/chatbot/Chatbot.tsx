// File: frontend/src/components/chatbot/Chatbot.tsx

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { ApiDomain } from '../../utils/APIDomain';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', text: 'Hello! I am your VineChMS Assistant. How can I help you today?' }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom() }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);

    const currentInput = input;
    setInput('');
    setLoading(true);

    try {
      const historyPayload = messages.slice(1).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));

      const response = await axios.post(
        `${ApiDomain}/chatbot/chat`,
        { message: currentInput, history: historyPayload }
      );

      setMessages(prev => [...prev, { role: 'model', text: response.data.reply }]);

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.details ||
        error?.response?.data?.error ||
        "Error connecting to service. Please try again.";

      setMessages(prev => [...prev, { role: 'model', text: errorMessage }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vine-chatbot-container">
      {isOpen ? (
        <div className="vine-chatbot-window">
          <div className="vine-chatbot-header">
            <div className="vine-chatbot-header-content">
              <span className="vine-chatbot-icon">⛪</span>
              <span className="vine-chatbot-title">VineChMS Assistant</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="vine-chatbot-close-btn"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="vine-chatbot-messages">
            {messages.map((m, i) => (
              <div key={i} className={`vine-chatbot-message ${m.role === 'user' ? 'user' : 'bot'}`}>
                <div className={`vine-chatbot-bubble ${m.role === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="vine-chatbot-message bot">
                <div className="vine-chatbot-bubble bot-bubble loading-bubble">
                  <Loader2 size={18} className="vine-chatbot-loading-spinner" />
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
                placeholder="Ask me anything about VineChMS..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button 
                onClick={sendMessage} 
                disabled={loading || !input.trim()}
                className={`vine-chatbot-send-btn ${loading || !input.trim() ? 'disabled' : ''}`}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)} 
          className="vine-chatbot-toggle-btn"
        >
          <MessageCircle size={24} />
          <span className="vine-chatbot-toggle-text">Need help?</span>
        </button>
      )}
    </div>
  );
};

export default Chatbot;