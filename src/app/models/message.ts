export interface Message {
  message_id: number;
  user_id: number;
  admin_id?: number;
  message_content: string;
  message_created: Date;
  sender_name: string;  
  role: 'admin' | 'user' | 'center';
}
