import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";
import {
  AttendingPersonInfo,
  invitationStatus,
} from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
import { Meeting } from "../MeetingActor";

export const ormOperateMeeting = Act<MeetingTypes.InitState>()({
  onMeetingInfoModify: {
    meetingId: "",
    subject: "",
    content: "",
    beginTime: 0,
    endTime: 0,
  },
  onMemberInvite: {
    meetingId: "",
    memberId: "",
    user: {} as AttendingPersonInfo & {
      registed: boolean;
    },
  },
  onMemberLeave: {
    meetingId: "",
    memberId: "",
  },
  onSummaryPublish: {
    meetingId: "",
  },
  onMeetingFinish: {
    meetingId: "",
    state: 0,
  },
  onMemberFeedback: {
    meetingId: "",
    memberId: "",
    state: 1 | 2,
  },
})({
  onMeetingInfoModify: (s, a) => {
    let meetingSnapshot = [...s.meetingSnapshot];
    let snapshot = meetingSnapshot.find(param => {
      return param.meetingData.meetingId === a.meetingId;
    });
    if (snapshot) {
      snapshot.meetingData.body.subject = a.subject;
      snapshot.meetingData.body.content = a.content;
      snapshot.meetingData.body.beginTime = a.beginTime;
      snapshot.meetingData.body.endTime = a.endTime;
    }
    return {
      meetingSnapshot: meetingSnapshot,
      sign: ["readSnapshot"],
    };
  },
  onMemberInvite: (s, a) => {
    let meetingSnapshot = [...s.meetingSnapshot];
    let snapshot = meetingSnapshot.find(param => {
      return param.meetingData.meetingId === a.meetingId;
    });
    if (snapshot) {
      let attendingList = snapshot.meetingData.attendingList;
      let member = attendingList.find(param => {
        return param.id === a.memberId;
      });
      if (!member) {
        attendingList.push({
          avatar: a.user.avatar,
          name: a.user.name,
          id: a.user.id,
          participationStatus: a.user.participationStatus,
          invitationStatus: "wait",
          personalMessage: a.user.personalMessage,
          jobTitle: a.user.jobTitle,
          department: a.user.department,
        });
        if (a.user.registed) {
          snapshot.meetingData.body.members.ids.push(a.user.id);
        } else {
          a.user.personalMessage.phone &&
            snapshot.meetingData.body.members.mobiles.push(
              a.user.personalMessage.phone
            );
          a.user.personalMessage.email &&
            snapshot.meetingData.body.members.emails.push(
              a.user.personalMessage.email
            );
        }
      }
    }
    return {
      meetingSnapshot: meetingSnapshot,
      sign: ["readSnapshot"],
    };
  },
  onMemberLeave: (s, a) => {
    let meetingSnapshot = [...s.meetingSnapshot];
    let snapshot = meetingSnapshot.find(param => {
      return param.meetingData.meetingId === a.meetingId;
    });
    if (snapshot) {
      let attendingList = snapshot.meetingData.attendingList;
      let memberIndex = attendingList.findIndex(param => {
        return param.id === a.memberId;
      });
      if (memberIndex) {
        attendingList.splice(memberIndex, 1);
      }
    }
    return {
      meetingSnapshot: meetingSnapshot,
      sign: ["readSnapshot"],
    };
  },
  onSummaryPublish: function*(s, a) {
    yield {
      aimAtMeetingId: a.meetingId,
    };
    Meeting.fetchMeetingSummary({ aimId: a.meetingId });
  },
  onMeetingFinish: (s, a) => {
    return {};
  },
  onMemberFeedback: (s, a) => {
    let meetingSnapshot = [...s.meetingSnapshot];
    let snapshot = meetingSnapshot.find(param => {
      return param.meetingData.meetingId === a.meetingId;
    });
    if (snapshot) {
      let attendingList = snapshot.meetingData.attendingList;
      let member = attendingList.find(param => {
        return param.id === a.memberId;
      });
      if (member) {
        let status: invitationStatus = "wait";
        switch (a.state) {
          case 1:
            status = "reject";
            break;
          case 2:
            status = "accept";
            break;
          default:
            break;
        }
        member.invitationStatus = status;
      }
    }
    return {
      meetingSnapshot: meetingSnapshot,
    };
  },
});
