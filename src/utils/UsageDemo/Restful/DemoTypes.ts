export type GetNameSource = {
  id: string;
};
export type GetNameBody = {
  name: string;
};
export type GetNameResponse = {
  opeType: "success";
};

export type AddGroupSource = {};
export type AddGroupBody = {};
export type AddGroupResponse = {};

export type putNameSource = {
  id: string;
  type: "user" | "admin";
};
export type putNameBody = {
  name: string;
};
export type putNameResponse = GetNameResponse;
