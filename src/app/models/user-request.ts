interface RequestResource {
  resource_name: string;
  requested_quantity: number;
}

export interface UserRequest {
  request_id: number;
  resource_id: number;
  user_id: number;
  user_name: string;       
  user_email: string;      
  resource_name: string; 
  resource_description: string;  
  requested_quantity: number;
  center_name: string;
  tracking_status:string;
  request_resources: RequestResource[];  
  request_status: string;
  request_date: Date;  
  tracking: {
    tracking_status: string;
    remarks?: string;
    tracking_created_at: string;
    tracking_updated_at: string;
  };
}

