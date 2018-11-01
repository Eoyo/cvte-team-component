import { AddGroupTypes } from "../AddGroupTypes";
import { Act } from "../../../../stores/Actor/actor";
export const outskirt = Act<AddGroupTypes.InitState>()({
  setExitedPeopleId: {
    ids: [] as string[],
  },
})({
  setExitedPeopleId: (s, a) => {
    return {
      exitedId: a.ids,
    };
  },
});
