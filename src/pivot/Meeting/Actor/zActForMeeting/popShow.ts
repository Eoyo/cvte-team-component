import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";

export const popShow = Act<MeetingTypes.InitState>()({
  popShow: {
    opeType: "" as keyof MeetingTypes.filePopshow,
    show: false,
  },
})({
  popShow: (s, a) => {
    return {
      meetingPage: {
        messageShow: {
          [a.opeType]: a.show,
        },
      },
    };
  },
});
