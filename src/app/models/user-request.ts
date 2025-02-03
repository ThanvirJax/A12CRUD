interface RequestResource {
  resource_name: string;
  requested_quantity: number;
}

export interface UserRequest {
  request_id: number;
  resources: {
    resource_name: string;
    requested_quantity: number;
  }[];
  resource_id: number;
  user_id: number;
  user_name: string;       
  user_email: string;      
  resource_name: string; 
  resource_description: string;  
  requested_quantity: number;
  center_name: string;
  delivery_status: string;
  request_resources: RequestResource[];  
  request_status: string;
  request_date: Date;  
  delivery_location: string; 
  tracking: {
    tracking_id:number;
    delivery_status: string;
    remarks?: string;
    delivery_date?: string | null;
    tracking_created_at: string;
    tracking_updated_at: string;
  };
}
