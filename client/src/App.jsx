import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const ChatInterface = () => {
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations');
    return saved ? JSON.parse(saved) : [{ id: Date.now(), title: 'New Chat', messages: [] }];
  });
  const [currentConvId, setCurrentConvId] = useState(() => {
    const saved = localStorage.getItem('currentConvId');
    return saved ? JSON.parse(saved) : conversations[0]?.id || Date.now();
  });
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentConv = conversations.find(c => c.id === currentConvId) || conversations[0];
  const messages = currentConv?.messages || [];

  // Save conversations to localStorage
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('currentConvId', JSON.stringify(currentConvId));
  }, [currentConvId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const updateConversationTitle = (convId, firstMessage) => {
    setConversations(prev => prev.map(conv =>
      conv.id === convId && conv.title === 'New Chat'
        ? { ...conv, title: firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '') }
        : conv
    ));
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, userMessage];

    setConversations(prev => prev.map(conv =>
      conv.id === currentConvId
        ? { ...conv, messages: updatedMessages }
        : conv
    ));

    if (messages.length === 0) {
      updateConversationTitle(currentConvId, input);
    }

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: input,
          history: messages.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          }))
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setConversations(prev => prev.map(conv =>
        conv.id === currentConvId
          ? { ...conv, messages: [...updatedMessages, { role: 'model', content: data.text }] }
          : conv
      ));
    } catch (error) {
      console.error('Error:', error);
      setConversations(prev => prev.map(conv =>
        conv.id === currentConvId
          ? { ...conv, messages: [...updatedMessages, { role: 'model', content: 'Sorry, I encountered an error. Please check if the server is running and your API key is valid.' }] }
          : conv
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const createNewChat = () => {
    const newConv = { id: Date.now(), title: 'New Chat', messages: [] };
    setConversations(prev => [newConv, ...prev]);
    setCurrentConvId(newConv.id);
  };

  const deleteConversation = (id) => {
    if (conversations.length === 1) {
      // Don't delete the last conversation, just clear it
      setConversations([{ id: Date.now(), title: 'New Chat', messages: [] }]);
      setCurrentConvId(conversations[0].id);
    } else {
      setConversations(prev => prev.filter(c => c.id !== id));
      if (currentConvId === id) {
        const remaining = conversations.filter(c => c.id !== id);
        setCurrentConvId(remaining[0].id);
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <button className="new-chat-button" onClick={createNewChat}>
            <Plus size={18} />
            <span>New Chat</span>
          </button>
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="conversations-list">
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conversation-item ${conv.id === currentConvId ? 'active' : ''}`}
              onClick={() => setCurrentConvId(conv.id)}
            >
              <MessageSquare size={16} />
              <span className="conversation-title">{conv.title}</span>
              <button
                className="delete-conv-button"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteConversation(conv.id);
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        {!sidebarOpen && (
          <button className="open-sidebar-button" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>
        )}

        <div className="chat-container">
          <div className="messages-list">
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
                <h1>How can I help you today?</h1>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`message-wrapper ${msg.role === 'user' ? 'user' : 'ai'}`}>
                <div className="message-avatar">
                  {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                </div>
                <div className="message-content">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-wrapper ai">
                <div className="message-avatar">
                  <Bot size={20} />
                </div>
                <div className="message-content">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="input-container">
            <div className="input-wrapper">
              <textarea
                ref={textareaRef}
                rows="1"
                placeholder="Message Gemini..."
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
              />
              <button
                className="send-button"
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
