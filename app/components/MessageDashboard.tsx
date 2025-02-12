import React, { useState, useEffect } from 'react';
import { MessageCircle, Send } from 'lucide-react';
import { listMessages, sendMessage, type Message } from '../utils/messages';

const MessageDashboard: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
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

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await sendMessage(newMessage);
      setNewMessage('');
      await loadMessages();
    } catch (error) {
      alert('Failed to send message. Please try again.');
    }
  };

  if (isLoading) {
    return <div className="p-6 text-center">Loading messages...</div>;
  }

  return (
    <div className="p-20 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-[0_0_10px_rgba(255,71,176,0.2)]">
        <div className="bg-[#fff6f9] p-4 rounded-t-lg border-b border-pink-100">
          <div className="flex items-center gap-3">
            <MessageCircle className="text-pink-500" />
            <h2 className="text-xl font-semibold text-pink-900">Message Center</h2>
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

        <form onSubmit={handleSendMessage} className="p-4 border-t border-pink-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 p-2 border border-pink-200 rounded-lg focus:outline-none focus:border-pink-400 bg-[#fff6f9]"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 focus:outline-none flex items-center gap-2"
            >
              <Send size={16} />
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageDashboard;