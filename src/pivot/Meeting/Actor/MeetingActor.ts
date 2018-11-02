import { MeetingTypes } from "./MeetingTypes";
import { schedule } from "./zActForMeeting/schedule";
import { detailEditor } from "./zActForMeeting/detailEditor";
import { invite } from "./zActForMeeting/inviting";
import { justEnd } from "./zActForMeeting/justEnd";
import { lock } from "./Lock/lock";
import { addGroup } from "./zActForMeeting/addGroup";
import { findSnapshot } from "./Tools/findSnapshot";
import { meetingList } from "./zActForMeeting/meetingList";
import { polling } from "./zActForMeeting/polling";
import { inMeeting } from "./zActForMeeting/inMeeting";
import { checkTimeDelay } from "./Tools/checkDateDelay";
import { note } from "./zActForMeeting/noteEditor";
import { uploadFile } from "./zActForMeeting/uploadFile";
import { ormOperateMeeting } from "./zActForMeeting/ormOperateMeeting";
import { popShow } from "./zActForMeeting/popShow";
import { repeatMeeting } from "./zActForMeeting/repeatMeeting";
import * as moment from "moment";
import { message } from "antd";
import { Actor } from "../../../stores/Actor/actor";
import { Fusion } from "../../../stores/Actor/fusion";
import { fridayPushData } from "src/friday";

export const Meeting = Actor(MeetingTypes.createInitState())({
  ...schedule.actions,
  ...invite.actions,
  ...detailEditor.actions,
  ...justEnd.actions,
  ...addGroup.actions,
  ...meetingList.actions,
  ...polling.actions,
  ...inMeeting.actions,
  ...note.actions,
  ...uploadFile.actions,
  ...popShow.actions,
  ...ormOperateMeeting.actions,
  ...repeatMeeting.actions,
  // @test
  changePage: {
    status: "" as MeetingTypes.MeetingStatus,
  },
  focusOneMeeting: {
    aimId: "",
  },
  updateMeetingSnapshot: {
    newSnapshot: [] as MeetingTypes.OneMeetingSnapshot[],
  },
  setRightClickState: {
    meetingId: "",
    rightClickMenu: false,
  },
  setSendSummaryPopState: {
    show: false,
  },
  setMeetingFilter: {
    content: {} as MeetingTypes.MeetingResult,
  },
})({
  ...uploadFile.reducers,
  ...schedule.reducers,
  ...invite.reducers,
  ...detailEditor.reducers,
  ...justEnd.reducers,
  ...addGroup.reducers,
  ...meetingList.reducers,
  ...polling.reducers,
  ...inMeeting.reducers,
  ...note.reducers,
  ...popShow.reducers,
  ...ormOperateMeeting.reducers,
  ...repeatMeeting.reducers,
  setMeetingFilter: function*(s, a) {
    if (a.content.action === "book") {
      let repeatValue = "";
      const meetingFilter = a.content.filter;
      let repeatType: MeetingTypes.RepeatMeetingType | undefined = undefined;
      if (meetingFilter.repeat.type === 1) {
        repeatType = 0;
      } else if (meetingFilter.repeat.type === 2) {
        repeatType = 1;
      }
      const repeatDateArr = meetingFilter.repeat.repeatDateArr;
      if (meetingFilter.repeat.type === 2) {
        for (let i = 0; i < repeatDateArr.length; ++i) {
          repeatValue += meetingFilter.repeat.repeatDateArr[i];
          if (i !== repeatDateArr.length - 1) {
            repeatValue += ",";
          }
        }
      } else if (meetingFilter.repeat.type === 1) {
        repeatValue = "1";
      }
      let repeatEndTime = moment(
        meetingFilter.repeat.repeatEndDate +
          "/" +
          moment(s.meetingData.body.endTime).format("HH:mm"),
        "YYYY-M-D/HH:mm"
      ).valueOf();

      //如果是预约态，就需要把内容放置在schedulemeetingdraft里面，用于当做草稿
      if (s.meetingData.status === "schedule") {
        let scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
        scheduleMeetingDraft.meetingData.body.beginTime = a.content.data.startTime.getTime();
        scheduleMeetingDraft.meetingData.body.endTime = a.content.data.endTime.getTime();
        scheduleMeetingDraft.meetingData.body.repeatStartTime = a.content.data.startTime.getTime();
        scheduleMeetingDraft.meetingData.body.repeatEndTime = repeatEndTime;
        scheduleMeetingDraft.meetingData.body.repeatValue = repeatValue;
        scheduleMeetingDraft.meetingData.body.address = a.content.data.text;
        scheduleMeetingDraft.meetingData.body.repeatType = repeatType;
        scheduleMeetingDraft.meetingData.body.roomId = a.content.data.roomId;
        yield {
          scheduleMeetingDraft,
        };
      }
      yield {
        meetingBeUsed: false,
        editingDetail: {
          beginTime: a.content.data.startTime.getTime(),
          endTime: a.content.data.endTime.getTime(),
          repeatStartTime: a.content.data.startTime.getTime(),
          repeatEndTime: repeatEndTime,
          address: a.content.data.text,
          repeatValue: repeatValue,
          repeatType: repeatType,
          roomId: a.content.data.roomId,
        },
      };
    } else if (a.content.action === "cancel-book") {
      if (s.meetingData.status === "schedule") {
        let scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
        scheduleMeetingDraft.meetingData.body.repeatType = undefined;
        scheduleMeetingDraft.meetingData.body.repeatEndTime = undefined;
        scheduleMeetingDraft.meetingData.body.repeatStartTime = undefined;
        scheduleMeetingDraft.meetingData.body.repeatValue = undefined;
        scheduleMeetingDraft.meetingData.body.roomId = "";
        scheduleMeetingDraft.meetingData.body.address = "";
        yield {
          scheduleMeetingDraft,
        };
      }
      yield {
        meetingBeUsed: false,
        editingDetail: {
          repeatType: undefined,
          repeatEndTime: undefined,
          repeatStartTime: undefined,
          repeatValue: undefined,
          roomId: undefined,
          address: "",
        },
      };
    }
  },
  setSendSummaryPopState: function*(s, a) {
    // 发送纪要
    fridayPushData({
      event: "click",
      eventName: "SEND_MEETING_SUMMARY_BUTTON_CLICK",
      attr: {
        meetingId: s.aimAtMeetingId,
      },
    });

    yield {
      showSendSummaryPopCard: a.show,
    };
  },
  changePage: (s, a) => {
    return { meetingData: { status: a.status } };
  },
  focusOneMeeting: function*(s, a) {
    // 查看会议详情
    fridayPushData({
      event: "click",
      eventName: "CHECK_MEETING_DETAIL",
      attr: {
        meetingId: a.aimId,
      },
    });
    yield {
      sign: ["readSnapshot"],
      aimAtMeetingId: a.aimId,
    };
    Meeting.fetchAimMeeting({ aimId: a.aimId });
  },
  setRightClickState: function*(s, a) {
    const newSnapshot = [...s.meetingSnapshot];
    const snapshot = findSnapshot(newSnapshot, a.meetingId);
    if (snapshot) {
      snapshot.meetingData.rightClickMenu = a.rightClickMenu;
    }
    yield {
      sign: ["readSnapshot"],
      meetingSnapshot: newSnapshot,
    };
  },
  // Actor 的 always 使用规范参照;
  always: (s, a) => {
    // 获取基本数据
    lock(s)
      .lockAimMeeting()
      .lockRole()
      .lockMemberList()
      .lockBeginEnd()
      .lockFileMenuFileCan()
      .lockDetailEdit();

    // 计算剩余时间
    switch (s.meetingData.status) {
      case "waiting":
        s.meetingPage.waitingTime = s.meetingData.body.beginTime - Date.now();
        break;
      case "inMeeting":
        checkTimeDelay(s);
        break;
      case "inviting":
      // s.meetingPage.inviteFrom =
      // s.meetingData.masterId;
    }

    return s;
  },

  updateMeetingSnapshot: (s, a) => {
    return {
      meetingSnapshot: a.newSnapshot,
      sign: ["readSnapshot"],
    };
  },
});

export const MeetingConnect = Fusion(Meeting.getStore());
