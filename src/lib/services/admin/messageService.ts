import { apiClient } from '@/core/client';

/**
 * TYPES
 */

export type RecipientType =
  | 'all_students'
  | 'all_teachers'
  | 'all_parents'
  | 'specific_student'
  | 'specific_teacher'
  | 'specific_parent';

export interface SendMessagePayload {
  recipient_type: RecipientType;
  message: string;
  recipient_ids?: number[];
}

export interface MessageRecipient {
  id: number;
  message_id: number;
  recipient_type: string;
  recipient_id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  recipients: MessageRecipient[];
}

/**
 * SERVICE
 */

export const messageService = {

  /**
   * SEND MESSAGE
   */
  sendMessage: async (payload: SendMessagePayload) => {
    const res: any = await apiClient.post('/admin/messages', payload);

    return res;
  },

  /**
   * GET SENT MESSAGES
   */
  getSentMessages: async (): Promise<Message[]> => {
  const res: any = await apiClient.get('/admin/messages');

  // DEBUG (optional but recommended once)
  console.log("SENT ADMIN MSG:", res);

  return res?.data?.messages ?? [];
},


 
 getReceivedMessages: async (): Promise<Message[]> => {
  const res: any = await apiClient.get('/admin/messages/received');

  console.log("RECEIVED ADMIN MSG:", res);

  return res?.data?.messages ?? [];
},


  
  updateMessage: async (id: number, message: string) => {
    return apiClient.put(`/admin/messages/${id}`, { message });
  },

 
  deleteMessage: async (id: number) => {
    return apiClient.delete(`/admin/messages/${id}`);
  },
};
