/**
 * MeetingPage,
 */
import * as React from "react";
import { Layout_HSC1 } from "../common/Layout";
import { MeetingHeader } from "./header/MeetingHeader";
import { ScrollableMeetingList } from "./sider/ConnectedMeetingList";
import { MeetingContent } from "./content/MeetingContent";
import styled from "styled-components";
import { getContact, getTeam } from "../Contact/utils";
import { C_PatchMeetingDetail } from "./content/MeetingPop/PatchMeetingDetail";
import { C_CancelReaptMeeting } from "./content/MeetingPop/CancelReaptMeeting";
import { C_DeleteFile, C_FilePopGroup } from "./content/MeetingPop/FilePop";
import "./MeetingStyle.scss";
import { C_AddressSelectorPop } from "./content/MeetingDetail/MeetingMessageEditGroup/AddressSelector/AddressSelector";
import { C_MeetingBeUsedPop } from "./content/MeetingDetail/MeetingMessageEditGroup/MeetingBeUsedPop";
import { C_PopMeetingMemberSelector } from "./content/AttendingList/PopMeetingMemberSelector";
import { C_SchduleMeetingModal } from "./header/SchduleMeetingModal";
import { C_SummaryConfirmPop } from "./content/Editor/SummaryEditor/SummaryConfirmPopover";
import { C_RightClickPopCard } from "./sider/MeetingList/MeetingListCard/RightClickPopCard";
import { C_StartTimeLessThanNowPopCard } from "./content/MeetingDetail/MeetingMessageEditGroup/TimePicker/C_StartTimeLessThanNowPopCard";
import { C_ScheduleTimePopCard } from "./content/MeetingDetail/MeetingMessageEditGroup/TimePicker/NpmSchedultTimePicker";
import { C_RepeatTimeOverThirtyDayPopCard } from "./content/MeetingDetail/MeetingMessageEditGroup/AddressSelector/C_RepeatTimeOverThirtyDayPopCard";
import { C_MeetingListTimeConflictPopCard } from "./content/MeetingDetail/MeetingMessageEditGroup/AddressSelector/C_MeetingListTimeConflictPopCard";
import { C_MeetingAddressConflictPopCard } from "./content/MeetingDetail/MeetingMessageEditGroup/AddressSelector/C_MeetingAddressConflictPopCard";
import { C_RepeatChoosePop } from "./content/MeetingDetail/MeetingMessageEditGroup/AddressSelector/C_RepeatChoosePop";
export type MeetingPageProps = {};

export const PopGroup = styled("div")`
  --styled: "PopGroup";
  width: 0px;
  height: 0px;
  overflow: visible;
`;

export class MeetingPage extends React.Component<MeetingPageProps> {
  async componentDidMount() {
    await getContact();
    await getTeam();
  }
  render() {
    const p = this.props;
    // Layout_HSC1是某一种规范的布局组件.
    // 使用Connected的组件后可以清晰的看到渲染的层次.
    // 在视图层依赖某个子组件时, 不用关心具体如何控制它.
    return (
      <Layout_HSC1
        Header={<MeetingHeader />}
        Sider={<ScrollableMeetingList />}
        Content={<MeetingContent />}
        footer={
          <PopGroup>
            {/* C_开头表示直接链接过的组件 */}
            <C_PatchMeetingDetail />
            <C_CancelReaptMeeting />
            <C_DeleteFile />
            <C_AddressSelectorPop />
            <C_MeetingBeUsedPop />
            <C_PopMeetingMemberSelector />

            {/* 提示是否使用草稿 */}
            <C_SchduleMeetingModal />

            <C_SummaryConfirmPop />
            <C_RightClickPopCard />
            <C_StartTimeLessThanNowPopCard />
            <C_ScheduleTimePopCard />
            <C_RepeatTimeOverThirtyDayPopCard />
            <C_MeetingListTimeConflictPopCard />
            <C_MeetingAddressConflictPopCard />
            <C_RepeatChoosePop />
            {/* <TimePickerPopCard visibale={true} /> */}
            {C_FilePopGroup}
          </PopGroup>
        }
      />
    );
  }
}
