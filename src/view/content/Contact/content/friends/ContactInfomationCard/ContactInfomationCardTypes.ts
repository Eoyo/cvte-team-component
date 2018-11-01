export namespace contactInfomationCard {
  export type contactInfomationCardType = {
    avatar: string;
    displayName: string;
    id: string;
    sex?: string;
    remark?: string;
    phone?: string | number;
    email?: string;
    department: string;
    jobTitle: string;
    editRemark?: boolean; //表示是否要编辑备注名，如果要编辑，则设置为true
    editResult?: boolean; //编辑备注名是否失败，大于16位则失败
    showCard?: boolean; //是否显示卡片，最开始不要显示，删除联系人不要显示
    moreActive?: boolean;
  };
}

export const contactInfomationCardInit: contactInfomationCard.contactInfomationCardType = {
  displayName: "",
  sex: "",
  avatar: "",
  remark: "",
  phone: "",
  email: "",
  department: "",
  jobTitle: "",
  id: "",
  editRemark: false,
  editResult: true,
  showCard: false,
  moreActive: false,
};
