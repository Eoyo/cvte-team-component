import * as React from "react";
import { OnePersonWithPop } from "./OnePersonWithPop";
import { AddGroupTypes } from "../../../../../../AddGroup/AddGroupTypes";
import { U } from "../../../../../../../../utils";
import { uuid } from "../../../../../../../../stores/DataHinger/utils";
import { app as AppStore } from "../../../../../../../../stores/app/app";

export class MemberList extends React.Component<{
  data: AddGroupTypes.OnePerson[];
}> {
  state = {
    nowPage: 1,
  };
  render() {
    let data = AppStore.get("userData");
    const p = this.props;
    //按照名字进行排序，用户本身排在最前面
    let newArr = p.data.sort((param1, param2) => {
      if (param1.id === data._id) {
        return -1;
      } else if (param2.id === data._id) {
        return 1;
      } else {
        return U.compareName(param1.name, param2.name);
      }
    });
    return (
      <div className="member-list">
        {newArr.map(onep => {
          return <OnePersonWithPop onepData={onep} key={onep.id || uuid()} />;
        })}
      </div>
    );
  }
}
