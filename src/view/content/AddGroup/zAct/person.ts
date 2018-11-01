import { AddGroupTypes } from "../AddGroupTypes";
import { Act } from "../../../../stores/Actor/actor";
import { AddGroupTool } from "../AddGroupTool";
export const person = Act<
  AddGroupTypes.InitState
>()({
  operatePerson: {
    id: "",
    opeType: "" as "select" | "cancel",
  },
  setPersonListOpen: {
    newOpen: false,
  },
})({
  setPersonListOpen(s, d) {
    s.myContact.myFriend.open = d.newOpen;
    return s;
  },
  operatePerson: (s, d) => {
    // @!! 不对id限制, 只限制了selectState;
    switch (d.opeType) {
      case "select":
        s.selectGroup.adding = 0;
        AddGroupTool.addSelect(
          s,
          d.id
        ).setSelectState(s, d.id, "selected");
        break;
      case "cancel":
        s.selectGroup.adding = 0;
        AddGroupTool.removeSelect(
          s,
          d.id
        ).setSelectState(s, d.id, "static");
        break;
    }
    return s;
  },
});
