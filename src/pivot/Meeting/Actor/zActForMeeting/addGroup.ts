import { MeetingTypes } from "../MeetingTypes";
import { resLog } from "../Tools/log";
import { Act } from "../../../../stores/Actor/actor";
import { inviteMeetingMembersTypes } from "../../../../services/auto/spore";
import { checki } from "../../../../utils/checkOperator";
import { auto } from "../../../../services/auto/spore";
import { S } from "../../../../stores";
import { AttendingPersonInfo } from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
import { app } from "../../../../stores/app/app";
import { AddGroupTypes } from "../../../../view/content/AddGroup/AddGroupTypes";

const uniqueByKey = (arr: Array<any>, key = "id") => {
  let tmp = {};
  let tmparr: any[] = [];
  arr.forEach(item => {
    tmp[item[key]] = item;
  });
  for (let key of Object.keys(tmp)) {
    tmparr.push(tmp[key]);
  }
  return tmparr;
};

const uniqueContent = (arr: Array<any>) => {
  let tmp = {};
  let tmpArr: any[] = [];
  arr.forEach(item => {
    tmp[item] = item;
  });
  for (let key in tmp) {
    tmpArr.push(tmp[key]);
  }
  return tmpArr;
};

export const addGroup = Act<MeetingTypes.InitState>()({
  setPeopleListAndClose: {
    data: {} as AddGroupTypes.PersonSelector[],
  },
  troggleAddGroup: {
    show: false,
  },
})({
  setPeopleListAndClose: function*(s, a) {
    let members = ReadSelectedToBodyMembers(a.data);
    if (s.meetingData.status === "schedule") {
      S.addGroup.resetAddGroup({});
      yield {
        meetingPage: {
          selectedPerson: a.data,
          showAddGroup: false,
        },
        meetingData: {
          // 去重
          attendingList: uniqueByKey(
            s.meetingData.attendingList.concat(
              ReadSelectedToAttendingList(a.data)
            )
          ),
          body: {
            ...s.meetingData.body,
            members: {
              ids: uniqueContent(
                s.meetingData.body.members.ids.concat(members.ids)
              ),
              mobiles: uniqueContent(
                s.meetingData.body.members.mobiles.concat(members.mobiles)
              ),
              emails: uniqueContent(
                s.meetingData.body.members.emails.concat(members.emails)
              ),
            },
          },
        },
      };
    } else {
      yield {
        meetingPage: {
          loading: {
            ...s.meetingPage.loading,
            attending: 1,
          },
          showAddGroup: false,
        },
      };
      const res:
        | checki<inviteMeetingMembersTypes.response>
        | checki<
            inviteMeetingMembersTypes.ominous
          > = yield auto.inviteMeetingMembers(
        {
          meetingId: s.meetingData.meetingId,
        },
        {
          data: ReadSelectedToBodyMembers(a.data),
        }
      );
      S.Meeting.fetchAimMeeting({ aimId: s.meetingData.meetingId });
      resLog(res);
    }
  },
  troggleAddGroup: function*(s, a) {
    if (a.show) {
      S.addGroup.setExitedPeopleId({
        ids: s.meetingData.attendingList.map(d => {
          return d.id || d.personalMessage.email || d.personalMessage.phone;
        }),
      });
    }
    yield {
      meetingPage: {
        showAddGroup: a.show,
      },
    };
  },
});

function ReadSelectedToBodyMembers(
  selectedPerson: AddGroupTypes.PersonSelector[]
) {
  const members: {
    mobiles: string[]; // 通过手机添加
    emails: string[]; // 通过邮箱添加
    ids: string[]; // 通过 id 添加，未注册的 id 将被忽略
  } = {
    mobiles: [],
    emails: [],
    ids: [],
  };
  selectedPerson.forEach(d => {
    //如果注册就使用id
    if (d.registed) {
      members.ids.push(d.id);
    } else {
      if (d.hasTrueId) {
        members.ids.push(d.id);
      } else if (d.userPersonalMessage.email) {
        members.emails.push(d.userPersonalMessage.email);
      } else if (d.userPersonalMessage.phone) {
        members.mobiles.push(d.userPersonalMessage.phone + "");
      }
    }
  });
  return members;
}

function ReadSelectedToAttendingList(
  selectedPerson: AddGroupTypes.PersonSelector[]
) {
  const attendingList: AttendingPersonInfo[] = [];
  selectedPerson.forEach(d => {
    // 将选择的数据放入attendingList;
    attendingList.push({
      avatar: d.headIconUrl,
      name: d.name,
      id: d.id,
      participationStatus:
        app.get("userData")._id === d.id ? "master" : "participant",
      invitationStatus: "prepare",

      personalMessage: {
        email: d.userPersonalMessage.email || "",
        phone: d.userPersonalMessage.phone
          ? d.userPersonalMessage.phone + ""
          : "",
      },
      department: "",
      jobTitle: "",
    });
  });
  return attendingList;
}
