import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  toggleChat,
  clearChat,
  addUserMessage,
  sendChatMessage,
} from '../../redux/slices/chatbotSlice';
import { FiSend, FiX, FiTrash2 } from 'react-icons/fi';
import { TbPlant2, TbMessageChatbot } from 'react-icons/tb';
import { BsRobot } from 'react-icons/bs';
import { FaUser } from 'react-icons/fa';
import '../../styles/ChatWidget.css';

const QUICK_QUESTIONS = [
  '🍅 Tomato disease tips',
  '🥔 Potato blight cure',
  '🌶️ Pepper care guide',
  '🌿 Organic pest control',
  '💧 Monsoon crop tips',
];

const ChatWidget = () => {
  const dispatch = useDispatch();
  const { messages, isOpen, isLoading, prediction } = useSelector(
    (state) => state.chatbot
  );
  const { userInfo } = useSelector((state) => state.auth);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // All hooks MUST be called before any conditional returns (React Rules of Hooks)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Don't render for non-authenticated users
  if (!userInfo) return null;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    dispatch(addUserMessage(trimmed));
    setInput('');

    // Build history for context
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    dispatch(
      sendChatMessage({
        message: trimmed,
        disease: prediction?.disease || null,
        history,
      })
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question) => {
    // Remove emoji prefix
    const cleanQ = question.replace(/^[^\w]*/, '').trim();
    setInput(cleanQ);
    dispatch(addUserMessage(cleanQ));

    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    dispatch(
      sendChatMessage({
        message: cleanQ,
        disease: prediction?.disease || null,
        history,
      })
    );
  };

  const formatTime = (ts) => {
    if (!ts) return '';
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        id="chat-widget-toggle"
        className={`chat-widget-toggle ${isOpen ? 'is-open' : ''}`}
        onClick={() => dispatch(toggleChat())}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <FiX size={24} /> : <TbMessageChatbot size={26} />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-widget-panel" id="chat-widget-panel">
          {/* Header */}
          <div className="chat-widget-header">
            <div className="chat-widget-header-avatar">
              🌱
            </div>
            <div className="chat-widget-header-info">
              <div className="chat-widget-header-title">Agro AI Assistant</div>
              <div className="chat-widget-header-subtitle">
                <span className="chat-widget-header-dot"></span>
                Online — Ask me anything about farming
              </div>
            </div>
            <button
              className="chat-widget-clear-btn"
              onClick={() => dispatch(clearChat())}
              title="Clear chat"
            >
              <FiTrash2 />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-widget-messages" id="chat-messages">
            {messages.length === 0 && (
              <>
                <div className="chat-welcome">
                  <div className="chat-welcome-icon">🌾</div>
                  <div className="chat-welcome-title">
                    Welcome, {userInfo.firstName}!
                  </div>
                  <div className="chat-welcome-text">
                    I'm your AI farming assistant. Ask me about plant diseases,
                    pest control, crop care, or any agricultural question!
                  </div>
                </div>
                <div className="chat-quick-actions">
                  {QUICK_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      className="chat-quick-btn"
                      onClick={() => handleQuickQuestion(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chat-msg chat-msg--${msg.role === 'user' ? 'user' : 'ai'} ${msg.isError ? 'chat-msg--error' : ''}`}
              >
                <div className="chat-msg-avatar">
                  {msg.role === 'user' ? <FaUser /> : <TbPlant2 />}
                </div>
                <div className="chat-msg-bubble">
                  {msg.content}
                  {msg.timestamp && (
                    <div
                      style={{
                        fontSize: '0.65rem',
                        opacity: 0.5,
                        marginTop: '6px',
                        textAlign: msg.role === 'user' ? 'right' : 'left',
                      }}
                    >
                      {formatTime(msg.timestamp)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="chat-typing">
                <div
                  className="chat-msg-avatar"
                  style={{
                    background: 'linear-gradient(135deg, #dcfce7, #bbf7d0)',
                    color: '#166534',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  <TbPlant2 />
                </div>
                <div className="chat-typing-dots">
                  <div className="chat-typing-dot"></div>
                  <div className="chat-typing-dot"></div>
                  <div className="chat-typing-dot"></div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Disease Context Banner */}
          {prediction && (
            <div
              style={{
                padding: '8px 20px',
                background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                borderTop: '1px solid #bbf7d0',
                fontSize: '0.75rem',
                color: '#166534',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔬 Context: <strong>{prediction.disease}</strong> ({prediction.confidence}% confidence)
            </div>
          )}

          {/* Input */}
          <div className="chat-widget-input-area">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about crops, diseases, treatments..."
              className="chat-widget-input"
              disabled={isLoading}
              id="chat-widget-input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="chat-widget-send-btn"
              id="chat-widget-send"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
