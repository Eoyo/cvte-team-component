import { MeetingTypes, cardStatus } from "../MeetingTypes";
import { findSnapshot } from "../Tools/findSnapshot";
import { app } from "../../../../stores/app/app";
import { getDefaultTimePick } from "../../../../view/content/Meeting/MeetingTool";
import {
  AttendingListProps,
  AttendingPersonInfo,
} from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
const statusForRole: {
  [x in MeetingTypes.PersonRole]: (status: cardStatus) => cardStatus
} = {
  compere(status: cardStatus): cardStatus {
    if (status === "notEditable") {
      return "editable";
    } else {
      return status;
    }
  },
  attendee(status: cardStatus): cardStatus {
    if (status === "editable" || status === "editing") {
      return "notEditable";
    } else {
      return status;
    }
  },
};

export const lock = (() => {
  let s: MeetingTypes.InitState;
  const rus = {
    // lock file menu can
    lockFileMenuFileCan() {
      s.meetingPage.uploadFiles.forEach(file => {
        file.card.menuCan = {
          ...file.card.menuCan,
          ...getFileMenuCan(s.meetingPerson.role, getMeetingStatus(s)),
        };
      });
      s.meetingPage.viewFiles.forEach(file => {
        file.card.menuCan = {
          ...file.card.menuCan,
          ...getFileMenuCan(s.meetingPerson.role, getMeetingStatus(s)),
        };
      });
      return rus;
    },
    //lock aimMeeting, 和 MeetingSnaoshot.
    lockAimMeeting() {
      function checkSnapShotEmpty() {
        if (
          s.meetingSnapshot.length === 0 &&
          s.scheduleMeetingDraft.scheduleMeeting === false
        ) {
          s.meetingData = MeetingTypes.createOneMeetingData("none");
          s.meetingPerson = MeetingTypes.createMeetingPersonal();
          s.meetingPage = MeetingTypes.createOneMeetingPage();
        }
      }
      //没有聚焦的会议，如果还是正在修改会议状态，需要重新设置为可修改状态
      function setMeetingEditable() {
        s.meetingSnapshot.map(snap => {
          if (
            snap.meetingData.meetingId !== s.aimAtMeetingId &&
            snap.meetingPerson.detailEdit === "editing"
          ) {
            snap.meetingPerson.detailEdit = "editable";
          }
        });
      }
      function setScheduleMeeting() {
        //如果aimAtMeetingId为空，说明当前是预约会议中
        if (s.aimAtMeetingId === "schedule-meeting") {
          s.scheduleMeetingDraft.meetingData = s.meetingData;
          s.scheduleMeetingDraft.meetingPage = s.meetingPage;
          s.scheduleMeetingDraft.meetingPerson = s.meetingPerson;
        }
      }
      function readFromSnapshot() {
        const oneSnapshot = findSnapshot(s.meetingSnapshot, s.aimAtMeetingId);
        if (oneSnapshot) {
          Object.assign(s, oneSnapshot);
        } else if (s.meetingData.meetingId !== "schedule-meeting") {
          s.aimAtMeetingId = "";
        }
      }
      function writeToSnapshot() {
        s.meetingSnapshot = s.meetingSnapshot.map(snap => {
          if (snap.meetingData.meetingId === s.aimAtMeetingId) {
            return {
              meetingData: s.meetingData,
              meetingPerson: s.meetingPerson,
              meetingPage: s.meetingPage,
            };
          } else {
            return snap;
          }
        });
      }

      checkSnapShotEmpty();
      setMeetingEditable();
      if (s.sign.indexOf("readSnapshot") >= 0) {
        readFromSnapshot();
      } else {
        writeToSnapshot();
      }
      setScheduleMeeting();
      return rus;
    },
    lockRole() {
      // lock , 角色 和 meeting,
      if (s.meetingData.masterId === app.get("userData")._id) {
        s.meetingPerson.role = "compere";
      } else {
        s.meetingPerson.role = "attendee";
      }
      return rus;
    },
    // lock : startTime , endTime;
    lockBeginEnd() {
      if (!s.meetingData.body.beginTime) {
        // 修改不对的数据, 使用s. 开头
        if (s.meetingData.status === "schedule") {
          s.meetingData.body = {
            ...s.meetingData.body,
            ...getDefaultTimePick(),
          };
          s.editingDetail = {
            ...s.editingDetail,
            ...getDefaultTimePick(),
          };
        }
      }
      return rus;
    },

    // lock : attendingList , body.members , from schedule personSelectors ;
    lockMemberList() {
      return rus;
    },
    lockDetailEdit() {
      // 角色, 编辑状态
      if (s.meetingData.status === "waiting") {
        s.meetingPerson.detailEdit = statusForRole[s.meetingPerson.role](
          s.meetingPerson.detailEdit
        );
      } else {
        s.meetingPerson.detailEdit = "notEditable";
      }
    },
  };
  return (newState: MeetingTypes.InitState) => {
    s = newState;
    return rus;
  };
})();

const config = {
  view: ["00", "01", "11", "11", "11", "11"],
  upload: ["10", "00", "11", "11", "11", "00"],
  delete: ["10", "00", "11", "11", "00", "00"],
  download: ["00", "00", "11", "11", "11", "11"],
};

// 映射权限的函数.
function Authority<character, situation, T extends string>(
  character: character[],
  situation: situation[]
) {
  return function getConfig(config: { [x in T]: string[] }) {
    return (c: character, s: situation) => {
      const obj: { [x in T]: boolean } = {} as any;
      for (const x in config) {
        const i = character.indexOf(c);
        const j = situation.indexOf(s);

        if (j >= 0 && i >= 0) {
          obj[x] = config[x][j][i] === "1";
        } else {
          obj[x] = false;
        }
      }
      return obj;
    };
  };
}

const getFileMenuCan = Authority<
  MeetingTypes.PersonRole,
  MeetingTypes.MeetingStatus | "summary",
  "view" | "upload" | "delete" | "download"
>(
  ["compere", "attendee"],
  ["schedule", "inviting", "waiting", "inMeeting", "justEnd", "summary"]
)(config);

function getMeetingStatus(s: MeetingTypes.InitState) {
  let status: MeetingTypes.MeetingStatus | "summary" = s.meetingData.status;
  if (s.meetingPage.isSummarySend && status === "justEnd") {
    status = "summary";
  }
  return status;
}
