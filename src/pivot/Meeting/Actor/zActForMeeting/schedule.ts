import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";
import { U } from "../../../../utils";
import { Merge } from "../../../../stores/Actor/tool";
import { Meeting } from "../MeetingActor";
import { message } from "antd";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { checki } from "../../../../utils/checkOperator";
import { S } from "../../../../stores";
import { AttendingPersonInfo } from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
import {
  scheduleMeetingTypes,
  auto,
  createRepeatMeetingTypes,
} from "../../../../services/auto/spore";
import { app } from "../../../../stores/app/app";
import { meetingLoader } from "../../../../services/meetingroom/meetingroom";
import * as moment from "moment";

export const schedule = Act<MeetingTypes.InitState>()({
  cancelSchedule: {} as { id?: string },
  setMeetingBaseMessage: {} as {
    name?: any;
    date?: {
      day: any;
      startTime: any;
      endTime: any;
    };
    room?: any;
  },
  setStartTimeLessThanNowPopCard: {
    show: false,
  },
  setMeetingTimePickePopCard: {
    show: false,
  },
  checkInfoAndSchedule: {},

  setMeetingListConflictPopCard: { show: false },

  setRepeatTimeOverThirtyDayPopCard: { show: false },

  setMeetingAddressConflictPopCard: { show: false },

  sendSchedule: {},

  createSchedule: {},

  resetSchedule: {},

  useOldSchedule: {},

  closeMeetingBeUsedModal: {},

  checkAndSetRepeatDate: {} as {
    date: {
      repeatType?: 0 | 1;
      repeatValue: string;
      repeatEndTime: number;
    };
  },

  checkAndSetDate: {} as {
    date: {
      day: any;
      startTime: any;
      endTime: any;
    };
  },

  setMeetingBeUsed: { beUsed: false },
  // 取消预约的人员
  removeScheduleMember: {
    id: "",
  },
  addMeetingContent: {
    data: "",
  },
  setAddressSelector: {
    show: false,
  },
  setRepeatSelector: {
    show: false,
  },
  setRepeatEndTime: {
    repeatEndTime: 0 as number | undefined,
  },
  setRepeatStartTime: {
    startTime: 0 as number,
  },
})({
  setRepeatStartTime(s, a) {
    return {
      editingDetail: {
        beginTime: a.startTime,
        repeatStartTime: a.startTime,
      },
    };
  },
  setRepeatEndTime(s, a) {
    return {
      updateInfo: {
        updateRepeatEndTime: a.repeatEndTime,
      },
    };
  },
  setRepeatTimeOverThirtyDayPopCard(s, a) {
    return {
      showRepeatTimeOverThirtyDayPopCard: a.show,
    };
  },
  setMeetingAddressConflictPopCard(s, a) {
    return {
      showMeetingAddressConflictPopCard: a.show,
    };
  },
  setMeetingListConflictPopCard(s, a) {
    return {
      showMeetingListTimeConflictPopCard: a.show,
    };
  },
  setMeetingTimePickePopCard: (s, a) => {
    return {
      showMeetingTimePickerPopCard: a.show,
    };
  },
  setStartTimeLessThanNowPopCard: (s, a) => {
    return {
      showStartTimeLessThanNowPopCard: a.show,
    };
  },
  setMeetingBeUsed: (s, a) => {
    if (s.meetingBeUsed !== a.beUsed) {
      return {
        meetingBeUsed: a.beUsed,
      };
    }
    return {};
  },
  closeMeetingBeUsedModal: (s, a) => {
    return {
      showMeetingBeUsedPopCard: false,
    };
  },
  useOldSchedule: (s, a) => {
    let body = s.scheduleMeetingDraft.meetingData.body;
    body.beginTime = 0;
    body.endTime = 0;
    let editingDetail = {
      content: body.content,
      subject: body.subject,
      beginTime: body.beginTime,
      endTime: body.endTime,
      address: body.address,
      repeatEndTime: body.repeatEndTime,
      repeatStartTime: body.repeatStartTime,
      repeatType: body.repeatType,
      repeatValue: body.repeatValue,
      roomId: body.roomId,
    } as MeetingTypes.EditingDetail;
    return {
      aimAtMeetingId: "schedule-meeting",
      showSchedulePopCard: false,
      meetingData: s.scheduleMeetingDraft.meetingData,
      meetingPage: s.scheduleMeetingDraft.meetingPage,
      meetingPerson: s.scheduleMeetingDraft.meetingPerson,
      editingDetail,
    };
  },
  resetSchedule: (s, a) => {
    const onep = MeetingTypes.createOneMeetingSnapshot();
    const me = app.get("userData");

    onep.meetingData = Merge<MeetingTypes.oneMeeting>(onep.meetingData, {
      status: "schedule",
      meetingId: "schedule-meeting",
      masterId: me._id,
      fromName: me.displayName,
      fromAvatar: me.avatar,
      attendingList: [
        {
          avatar: me.avatar,
          name: me.displayName,
          id: me._id,
          participationStatus: "master",
        },
      ],
    });
    let body = onep.meetingData.body;
    let editingDetail = {
      content: body.content,
      subject: body.subject,
      beginTime: body.beginTime,
      endTime: body.endTime,
      address: body.address,
      repeatEndTime: body.repeatEndTime,
      repeatStartTime: body.repeatStartTime,
      repeatType: body.repeatType,
      repeatValue: body.repeatValue,
      roomId: body.roomId,
    } as MeetingTypes.EditingDetail;
    return {
      aimAtMeetingId: "schedule-meeting",
      showSchedulePopCard: false,
      scheduleMeetingDraft: { ...onep, scheduleMeeting: true },
      meetingData: onep.meetingData,
      meetingPage: onep.meetingPage,
      meetingPerson: onep.meetingPerson,
      editingDetail,
    };
  },
  // 创建一个预约会议, 并放入快照中.
  createSchedule: (s, a) => {
    //不管是使用上一次预约的会议，还是创建一个新的预约的会议，都不需要显示“会议室被占用”这一文字
    //所以设置meetingBeUsed为false
    let addContent = checkAddScheduleContent(s);
    //如果是已经预约了
    if (s.scheduleMeetingDraft.scheduleMeeting === true) {
      if (s.meetingData.status === "schedule") {
        //如果当前正在填写预约会议信息，并且又点击了预约会议按钮，需要弹出“您正在预约会议”的toast
        message.destroy();
        message.info("您正在预约会议");
        return {
          showSchedulePopCard: false,
        };
      } else if (addContent) {
        //有内容的填写，并且当前不是预约会议中，就弹出对话框
        return {
          showSchedulePopCard: true,
          meetingBeUsed: false,
        };
      }
    }
    //如果没有预约过会议，或者没有填写预约会议内容，就重新创建一个新的预约会议
    const onep = MeetingTypes.createOneMeetingSnapshot();
    const me = app.get("userData");
    onep.meetingData = Merge<MeetingTypes.oneMeeting>(onep.meetingData, {
      status: "schedule",
      meetingId: "schedule-meeting",
      masterId: me._id,
      fromName: me.displayName,
      fromAvatar: me.avatar,
      attendingList: [
        {
          avatar: me.avatar,
          name: me.displayName,
          id: me._id,
          participationStatus: "master",
          personalMessage: {
            email: me.email,
            phone: me.mobile,
          },
          department: me.department,
          jobTitle: me.jobTitle,
        },
      ],
    });
    let body = onep.meetingData.body;
    let editingDetail = {
      content: body.content,
      subject: body.subject,
      beginTime: body.beginTime,
      endTime: body.endTime,
      address: body.address,
      repeatEndTime: body.repeatEndTime,
      repeatStartTime: body.repeatStartTime,
      repeatType: body.repeatType,
      repeatValue: body.repeatValue,
      roomId: body.roomId,
    } as MeetingTypes.EditingDetail;
    // 当前数据优先
    return {
      aimAtMeetingId: "schedule-meeting",
      scheduleMeetingDraft: { ...onep, scheduleMeeting: true },
      meetingData: onep.meetingData,
      meetingPage: onep.meetingPage,
      meetingPerson: onep.meetingPerson,
      editingDetail,
      meetingBeUsed: false,
    };
  },
  checkInfoAndSchedule(s, a) {
    if (s.meetingData.status !== "schedule") {
      return {};
    }
    const meetingBody = s.editingDetail;
    let now = Date.now();
    //如果当前时间小于预约会议的开始时间,就需要弹出提示,并且在时间输入框中显示对应的字符
    if (now > meetingBody.beginTime) {
      return {
        showStartTimeLessThanNowPopCard: true,
        startTimeLessThanNow: true,
      };
    }
    let body = {
      ...s.meetingData.body,
      ...s.editingDetail,
    };
    let contents = [] as string[];
    if (meetingBody.repeatType !== undefined) {
    } else {
      contents = checkConflictMeetings(s, body);
    }
    if (contents.length > 0) {
      return {
        showMeetingListTimeConflictPopCard: true,
        startTimeLessThanNow: false,
        conflictContents: contents,
      };
    }
    //如果没有冲突，就发出预约
    setTimeout(() => {
      Meeting.sendSchedule({});
    });
    return {
      startTimeLessThanNow: false,
    };
  },
  sendSchedule: function*(s, a) {
    const meetingBody = s.editingDetail;
    yield {
      meetingPage: {
        loading: {
          ...s.meetingPage.loading,
          schedule: 1,
        },
      },
    };
    message.destroy();
    message.loading("预约发出中，请稍后");
    const snap = [...S.Meeting.grab().meetingSnapshot];
    if (meetingBody.repeatType !== undefined) {
      //是重复会议
      let body = {} as createRepeatMeetingTypes.body;
      body = {
        subject: meetingBody.subject,
        content: meetingBody.content,
        beginTime: U.formDate.hourMinute(meetingBody.beginTime),
        endTime: U.formDate.hourMinute(meetingBody.endTime),
        address: meetingBody.address,
        repeatStartTime: meetingBody.repeatStartTime || 0,
        repeatEndTime: meetingBody.repeatEndTime || 0,
        repeatType: meetingBody.repeatType || 0,
        repeatValue: meetingBody.repeatValue || "",
        members: s.meetingData.body.members,
        peopleNum: 10,
        roomId: meetingBody.roomId || "",
        type: 6,
        scope: 1,
      };
      const res:
        | checki<createRepeatMeetingTypes.response>
        | checki<any> = yield auto.createRepeatMeeting(
        {},
        {
          data: body,
        }
      );
      if (resOK(res)) {
        const scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
        res.value.meetings.sort((param1, param2) => {
          return param1.beginTime <= param2.beginTime ? -1 : 1;
        });
        let reponseMeetingId = res.value.meetings[0]._id;
        scheduleMeetingDraft.meetingData.meetingId = reponseMeetingId;
        scheduleMeetingDraft.meetingData.repeatMeetingId = res.value._id;
        scheduleMeetingDraft.meetingData.status = "waiting";
        scheduleMeetingDraft.meetingData.body = {
          ...s.meetingData.body,
          ...s.editingDetail,
        };
        scheduleMeetingDraft.meetingData.attendingList.map(d => {
          d.invitationStatus = "wait";
        });
        snap.push(scheduleMeetingDraft);
        yield {
          sign: ["readSnapshot"],
          aimAtMeetingId: reponseMeetingId,
          meetingSnapshot: snap,
          scheduleMeetingDraft: {
            scheduleMeeting: false,
          },
        };
        Meeting.fetchMeetingList({});
        Meeting.fetchAimMeeting({ aimId: reponseMeetingId });
      } else {
        //冲突
        if (res.code === 400403002) {
          yield {
            meetingPage: {
              loading: {
                ...s.meetingPage.loading,
                schedule: 0,
              },
            },
          };
          yield {
            showMeetingBeUsedPopCard: true,
            meetingBeUsed: true,
          };
        } else {
          // wrong response
          message.error(res.message);
        }
      }
    } else {
      //不是重复会议
      let body = {
        ...s.meetingData.body,
        ...s.editingDetail,
      };
      let attachments = [] as string[];
      for (let i in s.meetingPage.uploadFiles) {
        attachments.push(s.meetingPage.uploadFiles[i].id);
      }
      for (let i in s.meetingPage.viewFiles) {
        attachments.push(s.meetingPage.viewFiles[i].id);
      }
      body.attachments = attachments;
      const res:
        | checki<scheduleMeetingTypes.response>
        | checki<any> = yield auto.scheduleMeeting(
        {},
        {
          data: body,
        }
      );
      if (resOK(res)) {
        // 使用服务器指定的meeting id
        const newId = res.value._id;
        const scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
        scheduleMeetingDraft.meetingData.meetingId = newId;
        scheduleMeetingDraft.meetingData.shareId = res.value.shareId;
        scheduleMeetingDraft.meetingData.shareKey = res.value.accessKey;
        scheduleMeetingDraft.meetingData.status = "waiting";
        scheduleMeetingDraft.meetingData.body = body;
        scheduleMeetingDraft.meetingData.body.orderNo = res.value.order;
        scheduleMeetingDraft.meetingData.attendingList.map(d => {
          d.invitationStatus = "wait";
        });
        snap.push(scheduleMeetingDraft);
        yield {
          sign: ["readSnapshot"],
          aimAtMeetingId: newId,
          meetingSnapshot: snap,
          scheduleMeetingDraft: {
            scheduleMeeting: false,
          },
        };
        Meeting.fetchAimMeeting({ aimId: newId });
      } else {
        //冲突
        if (res.code === 400403002) {
          yield {
            meetingPage: {
              loading: {
                ...s.meetingPage.loading,
                schedule: 0,
              },
            },
          };
          yield {
            showMeetingBeUsedPopCard: true,
            meetingBeUsed: true,
          };
        } else {
          // wrong response
          message.error(res.message);
        }
      }
    }
    message.destroy();
    yield {
      meetingPage: {
        loading: {
          ...s.meetingPage.loading,
          schedule: 0,
        },
      },
    };
  },
  removeScheduleMember: (s, a) => {
    const attendingList = [...s.meetingData.attendingList];
    let find: AttendingPersonInfo | undefined;
    const filtedAttendingList = attendingList.filter(onep => {
      if (onep.id === a.id) {
        find = onep;
        return false;
      } else {
        return true;
      }
    });

    if (find) {
      const found = find;
      const members = s.meetingData.body.members;
      const ids = members.ids.filter(id => id === a.id);
      const emails = members.emails.filter(
        email => email !== found.personalMessage.email
      );
      const mobiles = members.mobiles.filter(
        phone => phone !== found.personalMessage.phone
      );
      return {
        meetingData: {
          attendingList: filtedAttendingList,
          body: {
            members: {
              emails,
              mobiles,
              ids,
            },
          },
        },
      };
    } else {
      return {};
    }
  },
  // 添加会议内容的
  addMeetingContent: (s, a) => {
    if (s.meetingData.status === "schedule") {
      let scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
      let scheduleContent = a.data;
      if (a.data && a.data.length > 3000) {
        scheduleContent = a.data.slice(0, 3000);
      }
      scheduleMeetingDraft.meetingData.body.content = scheduleContent;
      return {
        scheduleMeetingDraft,
        editingDetail: {
          content: a.data,
        },
      };
    } else {
      return {
        editingDetail: {
          content: a.data,
        },
      };
    }
  },
  cancelSchedule: (s, a) => {
    return {
      scheduleMeetingDraft: {
        ...MeetingTypes.createOneMeetingSnapshot(),
        scheduleMeeting: false,
      },
      editingDetail: {
        content: "",
        subject: "",
        beginTime: 0,
        endTime: 0,
        address: "",
      },
      aimAtMeetingId: "",
      meetingData: MeetingTypes.createOneMeetingData("none"),
    };
  },
  checkAndSetRepeatDate: function*(s, a) {
    let roomId = "";
    if (s.meetingData.status === "schedule") {
      roomId = s.meetingData.body.roomId;
    } else if (s.meetingData.body.orderNo !== "") {
      const res: checki<any> = yield meetingLoader.orderNoGetInfo({
        orderNo: s.meetingData.body.orderNo,
      });
      if (resOK(res)) {
        roomId = res.value.roomId;
      }
    }
    if (roomId !== "") {
      let startTime = moment(s.editingDetail.beginTime).format(
        "YYYY-M-D HH:mm"
      );
      let endTime = moment(s.editingDetail.endTime).format("YYYY-M-D HH:mm");
      let repeatType = 1 as 1 | 2;
      if (a.date.repeatType === 0) {
        repeatType = 1;
      } else if (a.date.repeatType === 1) {
        repeatType = 2;
      }
      let repeatEndDate = "";
      if (a.date.repeatType === undefined) {
        repeatEndDate = moment(s.editingDetail.endTime).format("YYYY-M-D");
      } else {
        repeatEndDate = a.date.repeatEndTime
          ? moment(a.date.repeatEndTime).format("YYYY-M-D")
          : "";
      }
      const res: checki<any> = yield meetingLoader.meetingConflict({
        roomId: roomId,
        startTime: startTime,
        endTime: endTime,
        repeat: repeatType,
        repeatDate: a.date.repeatValue || "",
        repeatEndDate: repeatEndDate,
      });
      if (resOK(res)) {
        let conflict = checkAddressConflict(s, res);
        if (conflict === true) {
          yield {
            updateInfo: {
              updateRepeatEndTime: a.date.repeatEndTime,
              updateRepeatType: a.date.repeatType,
              updateRepeatValue: a.date.repeatValue,
            },
            showMeetingAddressConflictPopCard: true,
          };
          return;
        }
      }
    }
    //如果没有冲突，就直接设置重复会议的内容
    yield {
      editingDetail: {
        repeatEndTime: a.date.repeatEndTime,
        repeatType: a.date.repeatType,
        repeatValue: a.date.repeatValue,
      },
    };
  },
  checkAndSetDate: function*(s, a) {
    const thirtyDay = 30 * 24 * 60 * 60 * 1000;
    let beginTime = U.formDate.getTimeStick(a.date.day, a.date.startTime);
    //重复会议开始时间和结束时间超过30天，或者开始时间大于结束时间
    if (s.editingDetail.repeatType !== undefined) {
      let endTime =
        s.editingDetail.repeatEndTime === undefined
          ? 0
          : s.editingDetail.repeatEndTime;
      let overThirtyDay = endTime - beginTime > thirtyDay ? true : false;
      let beginOverEnd = beginTime - s.editingDetail.endTime > 0 ? true : false;
      if (overThirtyDay || beginOverEnd) {
        yield {
          updateInfo: {
            updateStartTime: moment(beginTime),
            updateEndTime: a.date.endTime,
          },
          showRepeatTimeOverThirtyDayPopCard: true,
        };
        return;
      }
    }
    let roomId = "";
    if (s.meetingData.status === "schedule") {
      roomId = s.meetingData.body.roomId;
    } else if (s.meetingData.body.orderNo !== "") {
      const res: checki<any> = yield meetingLoader.orderNoGetInfo({
        orderNo: s.meetingData.body.orderNo,
      });
      if (resOK(res)) {
        roomId = res.value.roomId;
      }
    }
    //如果预定了会议室，并且修改了时间，就需要查看时间上面是否冲突
    if (roomId !== "") {
      const body = s.editingDetail;
      let startTime = moment(beginTime).format("YYYY-M-D HH:mm");
      let endTime = moment(body.endTime).format("YYYY-M-D HH:mm");
      let repeatType = 1 as 1 | 2;
      if (body.repeatType === 0) {
        repeatType = 1;
      } else if (body.repeatType === 1) {
        repeatType = 2;
      }
      let repeatEndDate = "";
      if (body.repeatType === undefined) {
        repeatEndDate = moment(body.endTime).format("YYYY-M-D");
      } else {
        repeatEndDate = body.repeatEndTime
          ? moment(body.repeatEndTime).format("YYYY-M-D")
          : "";
      }
      const res: checki<any> = yield meetingLoader.meetingConflict({
        roomId: roomId,
        startTime: startTime,
        endTime: endTime,
        repeat: repeatType,
        repeatDate: body.repeatValue || "",
        repeatEndDate: repeatEndDate,
      });
      if (resOK(res)) {
        let conflict = checkAddressConflict(s, res);
        if (conflict === true) {
          yield {
            updateInfo: {
              updateStartTime: moment(beginTime),
              updateEndTime: a.date.endTime,
            },
            showMeetingAddressConflictPopCard: true,
          };
          return;
        }
      }
    }
    //如果有冲突的都return了，没有冲突就可以直接设置时间
    Meeting.setMeetingBaseMessage({ date: a.date });
  },
  setMeetingBaseMessage: function*(s, a) {
    let editingDetail: MeetingTypes.EditingDetail = { ...s.editingDetail };
    // 设置会议主题
    if (a.name != undefined) {
      editingDetail.subject = a.name || "";
    }
    // 设置日期
    if (a.date) {
      if (a.date.day && a.date.startTime) {
        editingDetail.beginTime = U.formDate.getTimeStick(
          a.date.day,
          a.date.startTime
        );
      } else {
        editingDetail.beginTime = 0;
      }
      if (a.date.day && a.date.endTime) {
        editingDetail.endTime = U.formDate.getTimeStick(
          a.date.day,
          a.date.endTime
        );
      } else {
        editingDetail.endTime = 0;
      }
      if (s.startTimeLessThanNow === true) {
        yield {
          startTimeLessThanNow: false,
        };
      }
    }
    // 设置 room;
    if (a.room != undefined) {
      editingDetail.address = a.room || "";
      editingDetail.repeatEndTime = undefined;
      editingDetail.repeatStartTime = undefined;
      editingDetail.repeatType = undefined;
      editingDetail.repeatValue = undefined;
      //手动编辑地点，就得把roomId置空
      editingDetail.roomId = "";
    }

    if (s.meetingData.status === "schedule") {
      let scheduleMeetingDraft = { ...s.scheduleMeetingDraft };
      scheduleMeetingDraft.meetingData.body = {
        ...s.scheduleMeetingDraft.meetingData.body,
        ...editingDetail,
      };
      yield {
        editingDetail: editingDetail,
        scheduleMeetingDraft,
      };
      return;
    } else {
      yield {
        editingDetail: editingDetail,
      };
    }
  },
  setAddressSelector: (s, a) => {
    if (a.show === false) {
      return {
        addressSelectorTimestamp: Date.now(),
        showAddressSelectorPopCard: a.show,
      };
    } else {
      return {
        showAddressSelectorPopCard: a.show,
      };
    }
  },
  setRepeatSelector: (s, a) => {
    if (a.show === false) {
      return {
        showRepeatTimeSelectorPopCard: false,
      };
    } else {
      return {
        showRepeatTimeSelectorPopCard: true,
      };
    }
  },
});

//res是访问会议室冲突接口返回的内容，res.value的内容为
// [
//   {
//     "orderNo","roomId","userId","userName","startTime","endTime","scope",
//     "theme","peopleNum","description","status","createdDate","updatedDate","repeatMeetingId"
//   }
// ]
function checkAddressConflict(s: MeetingTypes.InitState, res: any) {
  let conflict = true;
  if (res.value.length && res.value.length > 0) {
    if (res.value.length === 1) {
      //如果不是预约中的会议，并且结果只有一个，那么很有可能冲突的是当前自己的会议。
      //如果冲突的自己的会议，那就不要当做冲突处理
      if (
        s.meetingData.status !== "schedule" &&
        s.meetingData.body.orderNo === res.value[0].orderNo
      ) {
        conflict = false;
      }
    } else if (s.meetingData.body.repeatType !== undefined) {
      //如果是重复会议，判断所有的repeatMeetingId是否相同，如果相同，也说明不存在冲突
      for (let i in res.value) {
        if (res.value[i].repeatMeetingId === s.meetingData.repeatMeetingId) {
          conflict = false;
        } else {
          conflict = true;
          break;
        }
      }
    }
  } else {
    conflict = false;
  }
  return conflict;
}

//除了选择时间，只要预约会议填写了任何内容，就会触发草稿的弹窗
function checkAddScheduleContent(s: MeetingTypes.InitState) {
  let addContent = false;
  let body = s.scheduleMeetingDraft.meetingData.body;
  if (body.address && body.address.length > 0) {
    addContent = true;
  } else if (body.content && body.content.length > 0) {
    addContent = true;
  } else if (body.subject && body.subject.length > 0) {
    addContent = true;
  } else if (s.scheduleMeetingDraft.meetingData.attendingList.length > 1) {
    addContent = true;
  } else if (s.scheduleMeetingDraft.meetingPage.viewFiles.length > 0) {
    addContent = true;
  } else if (s.scheduleMeetingDraft.meetingPage.uploadFiles.length > 0) {
    addContent = true;
  }
  return addContent;
}

function checkConflictMeetings(s: MeetingTypes.InitState, body: any) {
  let contents = [] as string[];
  for (let i in s.meetingSnapshot) {
    if (
      s.meetingSnapshot[i].meetingData.body.beginTime > body.beginTime &&
      s.meetingSnapshot[i].meetingData.body.beginTime < body.endTime
    ) {
      contents.push(s.meetingSnapshot[i].meetingData.body.subject);
    } else if (
      s.meetingSnapshot[i].meetingData.body.endTime > body.beginTime &&
      s.meetingSnapshot[i].meetingData.body.endTime < body.endTime
    ) {
      contents.push(s.meetingSnapshot[i].meetingData.body.subject);
    } else if (
      s.meetingSnapshot[i].meetingData.body.beginTime === body.beginTime &&
      s.meetingSnapshot[i].meetingData.body.endTime === body.endTime
    ) {
      contents.push(s.meetingSnapshot[i].meetingData.body.subject);
    }
  }
  return contents;
}
