export interface Resource {
  resource_id: number;
  resource_name: string;
  resource_description?: string; 
  resource_quantity: number;
  resource_type: string;
  resource_status: any;  
  resource_created: string | Date; 
  resource_modified: string | Date; 
  resource_expiry_date: string | Date; 
}
