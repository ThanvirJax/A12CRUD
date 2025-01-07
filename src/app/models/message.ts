export interface Message {
  message_id: number;
  user_id: number;
  message_content: string;
  message_created: string | Date;
  user_name?: string; 
  role: 'admin' | 'user' | 'center';  

}
