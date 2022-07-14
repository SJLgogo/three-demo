import {CommonSelect} from "../../../api/common-interface/common-interface";

const appRange: CommonSelect[] = [{label: '企业微信', value: 'wxCp'}, {label: '钉钉', value: 'ding'}, {
  label: '云之家',
  value: 'yzj'
}, {label: '其他', value: 'other'},]

const applicationType: CommonSelect[] = [{label: 'app访问', value: 'app'}, {label: 'web端访问', value: 'web'}, {
  label: '通讯录',
  value: 'contact'
}]

interface SavePro {
  name: string;
  corpId: string;
  // agentId: string;
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
  SaveApp,
  appRange,
  applicationType
}
