import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { Message } from '../types/messages';


  export class messageServices {
    private client = generateClient<Schema>();
  
    async sendMessage(content: string, sender: string): Promise<Message> {
      try {
        const response = await this.client.models.Message.create({
          content,
          sender,
          timestamp: new Date().toISOString(),
          read: false
        });
    
        if (!response.data) {
          throw new Error('Failed to send message');
        }
        
        return response.data as Message;
      } catch (error) {
        console.error('Error sending message:', error);
        throw error;
      }
    }
  
    async getMessages(): Promise<Message[]> {
      try {
        //reate test message
        const message: Message = {
          id: "1",
          sender: "admin",
          content: "Hello, how are you?",
          timestamp: new Date().toISOString(),
          read: false
        }
        return [message]
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    }
  
    async markMessageAsRead(messageId: string): Promise<void> {
      try {
        await this.client.models.Message.update({
          id: messageId,
          read: true
        });
      } catch (error) {
        console.error('Error marking message as read:', error);
        throw error;
      }
    }
  }