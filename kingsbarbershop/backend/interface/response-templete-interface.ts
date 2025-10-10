export interface ResponseTemplateInterface {
  status: boolean;
  code: number;
  message: string;
  data: any;
  error?: any;
}