//React Hooks: 
//Component: reusable UI component, returns JSX
//state: changing data that affects the UI
//
import { useEffect, useRef, useState } from 'react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  // FEHLER 1 BEHOBEN: sessionId wird jetzt verwendet
  const [sessionId] = useState(() => generateSessionId());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Für lokale Entwicklung: Setze deine n8n Webhook URL hier ein
  const CHAT_URL = 'https://n8n.srv1048389.hstgr.cloud/webhook/chat';

  function generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  useEffect(() => {
    // Session-Info bei Start loggen
    console.log('Session ID:', sessionId);
    console.log('Chat URL:', CHAT_URL);
  }, [sessionId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          chatInput: text.trim(),
          sessionId: sessionId, // Session ID mitschicken
        }),
      });

      console.log('Response Status:', response.status);
      console.log('Response Headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Response Text:', responseText);

      let data;
      // FEHLER 3 BEHOBEN: 'e' Variable wird jetzt korrekt verwendet
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        data = { output: responseText };
      }

      const botText = data?.output || 
                      data?.response || 
                      data?.message || 
                      data?.text ||
                      responseText ||
                      'Keine Antwort erhalten';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botText,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Fehler beim Senden der Nachricht:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Entschuldigung, es gab einen Fehler. Bitte versuche es erneut.',
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  // FEHLER 2 BEHOBEN: onKeyPress durch onKeyDown ersetzt (moderne Alternative)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-content">
            <div className="bot-avatar">🤖</div>
            <div className="header-text">
              <h1>AI Chatbot</h1>
              <p>Powered by n8n</p>
            </div>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="welcome-message">
              <h2>👋 Willkommen!</h2>
              <p>Stelle mir eine Frage und ich helfe dir gerne weiter.</p>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender}`}
            >
              <div className="message-content">
                <p>{message.text}</p>
                <span className="message-time">
                  {message.timestamp.toLocaleTimeString('de-DE', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="message bot">
              <div className="message-content">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Schreibe eine Nachricht..."
              disabled={isLoading}
              className="message-input"
            />
            <button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="send-button"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </form>
        </div>

        <div className="chat-footer">
          <small>
            Chat URL: <code>{CHAT_URL}</code>
          </small>
        </div>
      </div>
    </div>
  );
}

export default App;