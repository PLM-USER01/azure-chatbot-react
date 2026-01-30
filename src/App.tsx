import { useState } from 'react';
import axios from 'axios';
import './App.css';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

function App() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages([...messages, userMessage]);
        setInput('');
        setLoading(true);

        try {
                const response = await axios.post(
                          'https://shuic-ml0h65y0-eastus2.cognitiveservices.azure.com/openai/deployments/gpt-5.2-chat/chat/completions?api-version=2024-12-01-preview',
                  {
                              messages: [...messages, userMessage].map(m => ({
                                            role: m.role,
                                            content: m.content
                              })),
                              max_tokens: 800
                  },
                  {
                              headers: {
                                            'Content-Type': 'application/json',
                                            'api-key': import.meta.env.VITE_AZURE_OPENAI_KEY || ''
                              }
                  }
                        );

          const assistantMessage: Message = {
                    role: 'assistant',
                    content: response.data.choices[0].message.content
          };
                setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
                console.error('Error:', error);
                alert('Error sending message. Please check your API key and endpoint.');
        } finally {
                setLoading(false);
        }
  };

  return (
        <div className="app">
              <div className="chat-container">
                      <h1>Azure AI Chatbot</h1>h1>
                      <div className="messages">
                        {messages.map((msg, index) => (
                      <div key={index} className={`message ${msg.role}`}>
                                    <strong>{msg.role === 'user' ? 'You' : 'AI'}:</strong>strong> {msg.content}
                      </div>div>
                    ))}
                        {loading && <div className="message assistant">AI is typing...</div>div>}
                      </div>div>
                      <div className="input-area">
                                <input
                                              type="text"
                                              value={input}
                                              onChange={(e) => setInput(e.target.value)}
                                              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                              placeholder="Type your message..."
                                              disabled={loading}
                                            />
                                <button onClick={sendMessage} disabled={loading}>
                                            Send
                                </button>button>
                      </div>div>
              </div>div>
        </div>div>
      );
}

export default App;</div>
