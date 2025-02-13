import React, { useState, useEffect } from 'react';
import { listMessages, type Message } from '../utils/messages';

const MessageDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    setIsLoading(true);
    const fetchedMessages = await listMessages();
    setMessages(fetchedMessages);
    setIsLoading(false);
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading messages...</div>;
  }

  return (
    <div className="p-20 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
        <div className="bg-[#fff6f9] p-4 rounded-t-lg border-b border-pink-100">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-[#ff47b0]">Challenges</h2>
          </div>
        </div>
        
        <div className="h-[calc(100vh-300px)] overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.sender === 'You' 
                  ? 'bg-pink-50 ml-8'
                  : 'bg-[#fff6f9] border-l-4 border-pink-400'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-pink-900">{message.sender}</span>
                </div>
                <span className="text-xs text-pink-400">{message.timestamp}</span>
              </div>
              <p className="text-pink-800">{message.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageDashboard;