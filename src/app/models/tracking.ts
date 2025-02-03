export interface Tracking {
  tracking_id: number;
  delivery_status: string;
  delivery_date: string;
  remarks?: string;
  tracking_created: string;
  tracking_updated: string;
  resource_name: string;
  requested_quantity: number;
  resource_description?: string;
  request_id: number;
  request_status: string;
  requester_name: string;
  requester_email: string;
  requester_type: string;
  user_id: number;
  center_id: number;
  benefits_image: string | null;  
}
