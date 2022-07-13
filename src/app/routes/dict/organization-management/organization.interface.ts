interface SavePro {
  name: string;
  corpId: string;
  agentId: string;
  category: string;
  automaticUpdate: boolean;
  synchronisedTime?: number;
  logo?: string;
  id?: string;
}

interface SaveApp {
  name: string;
  category: string;
  companyId: string;
  url: string;
  id?: string;
  corpId?: string;
  agentId?: string;
  secret?: string;
  messageToken?: string;
  messageEncodingAesKey?: string;
  businessType?: string;
}



export {
  SavePro,
  SaveApp
}
