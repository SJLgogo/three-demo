type variable<T> = T | undefined | null;
type EmptyObject = { [key in any]: never };

interface CommonSelect<T=string> {
    label:string,
    value:T
}

interface HttpResult {
  code: string;
  version: number;
  data?: any;
  success: boolean;
  message?: string;
}


export {
  variable,
  CommonSelect,
  HttpResult,
  EmptyObject
}
