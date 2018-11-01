export namespace contactItem {
  export type contactItemType = {
    members: {
      id: string;
      name: string;
      avatar: string;
    }[];
    name: string;
    createTime?: string | number;
    id?: string;
  };
}
