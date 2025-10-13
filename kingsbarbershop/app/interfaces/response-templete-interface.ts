export interface ResponseTemplateInterface<T = any> {
  status: boolean;      
  code: number;         
  message: string;      
  data: T;              
}