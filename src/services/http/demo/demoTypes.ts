export type addContact = {
  userId: string;
};

export type getUserInfo = {
  access_token: string;
};

export type getUserInfoResponse = {
  userId: string;
  displayName: string;
  mobile: string;
  birthYear: number | string;
  birthMonth: number | string;
  birthDay: number | string;
  email: string;
  passwordRuleType: number | string;
  avatar: string;
  unionid: number | string;
  openid: number | string;
  gender: number | string;
  province: string;
  city: string;
  country: string;
  createdDate: number | string;
  updatedDate: string;
};
