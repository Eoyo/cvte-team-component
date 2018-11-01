import { AddGroupTypes } from "../AddGroupTypes";
import { Act } from "../../../../stores/Actor/actor";
import { AddGroupTool } from "../AddGroupTool";

export const group = Act<
  AddGroupTypes.InitState
>()({
  operateGroup: {
    groupId: "",
    opeType: "" as "selectAll" | "cancelAll",
  },
  setGroupListOpen: {
    newOpen: false,
  },
  setOneGroupOpen: {
    groupId: "",
    newOpen: false,
  },
})({
  setGroupListOpen(s, d) {
    s.myContact.myGroups.open = d.newOpen;
    return s;
  },
  operateGroup: (s, d) => {
    if (d.opeType) {
      const oneGroup = AddGroupTool.findOneGroup(
        s,
        d.groupId
      );
      if (oneGroup) {
        switch (d.opeType) {
          case "selectAll":
            s.selectGroup.adding = 0;
            oneGroup.containMemberId.forEach(
              id => {
                AddGroupTool.addSelect(
                  s,
                  id
                ).setSelectState(
                  s,
                  id,
                  "selected"
                );
              }
            );
            break;
          case "cancelAll":
            s.selectGroup.adding = 0;
            oneGroup.containMemberId.forEach(
              id => {
                AddGroupTool.removeSelect(
                  s,
                  id
                ).setSelectState(s, id, "static");
              }
            );
            break;
        }
      }
    }
    return s;
  },
  setOneGroupOpen(s, d) {
    const oneGroup = AddGroupTool.findOneGroup(
      s,
      d.groupId
    );
    if (oneGroup) {
      oneGroup.open = d.newOpen;
    }
    return s;
  },
});
