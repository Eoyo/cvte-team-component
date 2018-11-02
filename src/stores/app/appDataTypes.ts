import { UTILS_GET_APP_VERSION_RESPONSE_TYPE } from "src/services/native";

export type appDataTypes = {
  userData: {
    displayName: string;
    remark: string;
    mobile: string;
    avatar: any;
    createTime?: string | number;
    isMailConfig?: boolean;
    email?: string;
    _id: string;
    jobTitle?: string;
    department?: string;
  };
  contactLists: { contacts: any[]; teams: any[] };
  access_token: string;
  baseURL?: string;
  server_name?: string;
  mrbsServer?: string;
  fullVersion?: UTILS_GET_APP_VERSION_RESPONSE_TYPE;
  fridayAppId: string;
};
