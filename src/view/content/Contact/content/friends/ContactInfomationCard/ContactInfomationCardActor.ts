import { contactInfomationCardInit } from "./ContactInfomationCardTypes";
import { Various } from "../../../../../../stores/utils/various";
import { S } from "../../../../../../stores";
import { Actor } from "../../../../../../stores/Actor/actor";
import { AppPivot } from "../../../../../../pivot";

export const contactInfomationCardOperation = Actor(contactInfomationCardInit)(
  //显示，删除联系人
  {
    showOperation: {
      id: "",
    },
    removeOperation: {
      id: "",
    },
    editRemarkOperation: {},
    cancelEditRemarkOperation: {},
    updateRemarkOperation: {
      remark: "",
    },
    //字符大于16位,编辑备注名失败
    setEditRemarkStateOperation: {
      state: true,
    },
  }
)({
  showOperation: (s, d) => {
    return Various(s)(s => {
      let { personList } = S.Hinger.grab();
      for (let i in personList) {
        if (personList[i].id === d.id) {
          s.displayName = personList[i].displayName;
          s.sex = personList[i].sex;
          s.avatar = personList[i].avatar;
          s.remark = personList[i].remark;
          s.phone = personList[i].personalMessage.phone;
          s.email = personList[i].personalMessage.email;
          s.jobTitle = personList[i].personalMessage.jobTitle || "";
          s.department = personList[i].personalMessage.department || "";
          s.id = personList[i].id;
          s.showCard = true;
        }
      }
    });
  },
  removeOperation: (s, d) => {
    S.Hinger.removeContact({
      id: d.id,
    });
    // 跳转默认路由
    AppPivot.writeRoutes({
      routes: ["contact"],
    });
    return Various(s)(s => {
      s.showCard = false;
    });
  },
  editRemarkOperation: (s, d) => {
    return Various(s)(s => {
      s.editRemark = true;
    });
  },
  cancelEditRemarkOperation: (s, d) => {
    return Various(s)(s => {
      s.editRemark = false;
    });
  },
  updateRemarkOperation: (s, d) => {
    return Various(s)(s => {
      s.editRemark = false;
      s.remark = d.remark;
    });
  },
  setEditRemarkStateOperation: (s, d) => {
    return Various(s)(s => {
      s.editResult = d.state;
    });
  },
});
