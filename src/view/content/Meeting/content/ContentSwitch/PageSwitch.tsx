/**
 * 控制页面的切换的组件, 可以是路由, 也可以时switch判断.
 */

import {
  ContentSwitcherBuilder,
  ContentSwitcherProps,
  ContentSwitcherArgs,
} from "./ContentSwitcher";
import { MeetingTypes } from "../../../../../pivot/Meeting/Actor/MeetingTypes";
import { MeetingConnect } from "../../../../../pivot/Meeting/Actor/MeetingActor";

export type MeetingPageSwitcherProps = ContentSwitcherProps<MeetingPageStatus>;
export type MeetingPageSwitcherArgs = ContentSwitcherArgs<MeetingPageStatus>;

type MeetingPageStatus = MeetingTypes.MeetingStatus;
export const MeetingPageSwitcher = ContentSwitcherBuilder<MeetingPageStatus>();

export const C_MeetingPageSwitcher = MeetingConnect<MeetingPageSwitcherProps>(
  (s, ownProps: MeetingPageSwitcherArgs) => {
    return {
      case: s.meetingData.status,
      // case: "inviting",
      ...ownProps,
    };
  }
)<MeetingPageSwitcherArgs>(MeetingPageSwitcher);
