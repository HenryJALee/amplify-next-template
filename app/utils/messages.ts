// utils/messages.ts
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";

export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const client = generateClient<Schema>();

const transformMessage = (data: any): Message => ({
  id: data.id || '',
  sender: data.sender || '',
  content: data.content || '',
  timestamp: new Date().toISOString(), // Simplified timestamp handling
  read: Boolean(data.read)
});

export const listMessages = async (): Promise<Message[]> => {
  try {
    const response = await client.models.Message.list();
    return response.data.map(transformMessage);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
};

export const sendMessage = async (content: string): Promise<Message | null> => {
  try {
    const response = await client.models.Message.create({
      sender: 'You',
      content,
      timestamp: new Date().toISOString(),
      read: false
    });
    return transformMessage(response.data);
  } catch (error) {
    console.error('Error sending message:', error);
    throw error;
  }
};





