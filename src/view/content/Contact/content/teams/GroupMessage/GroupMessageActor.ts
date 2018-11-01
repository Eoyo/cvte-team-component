import { GroupMessageInitState } from "./GroupMessageTypes";
import { ormOperateGroupMessage } from "./zAct/ormOperateGroupMessage";
import { Actor } from "../../../../../../stores/Actor/actor";

export const GroupMessage = Actor(GroupMessageInitState)({
  ...ormOperateGroupMessage.actions,
})({
  ...ormOperateGroupMessage.reducers,
});
