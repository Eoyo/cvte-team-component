/**
 * 1. note 在meeting list 中获取的, 判断loading.noteEditor实现只加载一次的. (以后要有note. version)
 * 2. 会议详情查完了后才会结束页面中的loading
 */
import { MeetingTypes } from "../MeetingTypes";
import { Act } from "../../../../stores/Actor/actor";
import { U } from "../../../../utils";
import { S } from "../../../../stores";
import { checki } from "../../../../utils/checkOperator";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { resLog } from "../Tools/log";
import { findSnapshot, dumpMeeting } from "../Tools/findSnapshot";
import {
  AttendingPersonInfo,
  invitationStatus,
} from "../../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
import { app } from "../../../../stores/app/app";
import { checkTimeDelay } from "../Tools/checkDateDelay";
import {
  getMeetingListTypes,
  auto,
  searchMeetingMessageTypes,
  getMeetingSummaryTypes,
} from "../../../../services/auto/spore";
import { Meeting } from "../MeetingActor";
import { fileLoader } from "../../../../services/file/file";
import { getFileType } from "../../../../view/content/Meeting/content/FileListViewer/FileList/analyFIleType";
const Base64 = require("js-base64").Base64;

export const polling = Act<MeetingTypes.InitState>()({
  fetchAimMeeting: { aimId: "" },
  circleFetchAll: {},
  fetchMeetingList: {},
  fetchMeetingDetail: { aimId: "" },
  fetchMeetingSummary: { aimId: "" },
  fetchMeetingFile: { aimId: "" },
  circleFetchFile: {},
})({
  //拉取指定meetingId的会议内容，可以不是当前展示的会议
  fetchAimMeeting: function*(s, a) {
    let aimId = a.aimId;
    //如果还在预约会议中，就不应该拉取数据
    if (s.meetingData.status === "schedule") {
      return;
    }
    Meeting.fetchMeetingDetail({ aimId });
    Meeting.fetchMeetingSummary({ aimId });
    Meeting.fetchMeetingFile({ aimId });
    yield {};
  },
  // 轮询的周期为无限长
  circleFetchAll: function*(s, a) {
    do {
      Meeting.fetchMeetingList({});
      // 获取会议详情
      const { aimAtMeetingId: aimId, meetingData } = S.Meeting.grab();
      if (!aimId || meetingData.status === "schedule") {
        yield U.time(60 * 1000);
        continue;
      }
      Meeting.fetchMeetingDetail({ aimId });
      Meeting.fetchMeetingSummary({ aimId });
      Meeting.fetchMeetingFile({ aimId });
      yield U.time(60 * 1000);
    } while (true);
  },
  circleFetchFile: function*(s, a) {
    do {
      let aimId = s.aimAtMeetingId;
      if (aimId) {
        Meeting.fetchMeetingFile({ aimId });
      }
      yield U.time(1000);
    } while (true);
  },
  fetchMeetingFile: function*(s, a) {
    //获取会议文件
    if (!s.meetingData.shareId) {
      return;
    }
    const fileRes: checki<any> = yield fileLoader.fetchShareFiles(
      {
        shareId: s.meetingData.shareId,
      },
      {
        headers: {
          "X-Share-Key": Base64.encode(s.meetingData.shareKey),
        },
      }
    );
    if (resOK(fileRes)) {
      const snap = [...S.Meeting.grab().meetingSnapshot];
      const oneSnap = findSnapshot(snap, a.aimId);
      if (oneSnap) {
        const {
          meetingPage: { uploadFiles, viewFiles },
        } = S.Meeting.grab();
        let newViewFiles = [...viewFiles];
        newViewFiles = [];
        for (let i in fileRes.value) {
          let value = fileRes.value[i];
          //目前不支持目录的形式
          if (value.contentType !== "folder") {
            let viewFile: MeetingTypes.OneFile = {
              id: value.itemId,
              downloadUrl: value.url,
              card: {
                can: {
                  remove: s.meetingData.status === "schedule",
                },
                menuCan: {
                  delete: false,
                  view: false,
                  upload: false,
                  download: false,
                  remove: false,
                },
                fileName: value.name,
                fileType: getFileType(value.contentType),
                totalSizeStr: getFileSize(value.size),
                uploadSizeStr: "0",
                loadingType: 0,
                loadingSizePercentage: 100,
              },
            };
            newViewFiles.push(viewFile);
          }
        }
        let uploadingFiles: any[] = [];
        for (let i in uploadFiles) {
          if (uploadFiles[i].card.loadingType === 1) {
            uploadingFiles.push(uploadFiles[i]);
          }
        }
        oneSnap.meetingPage.uploadFiles = uploadingFiles;
        oneSnap.meetingPage.viewFiles = newViewFiles;
        yield {
          meetingSnapshot: snap,
          sign: ["readSnapshot"],
        };
      }
    }
  },
  fetchMeetingSummary: function*(s, a) {
    // 获取会议纪要
    let currentState = Meeting.grab();
    // 当加载过了 或 没有提交过summary => 停止纪要获取.
    if (
      currentState.meetingData.status !== "justEnd" ||
      currentState.meetingPage.isSummaryLoad ||
      !currentState.meetingPage.isSummarySend
    ) {
      return;
    }
    const summaryRes:
      | checki<getMeetingSummaryTypes.response>
      | checki<getMeetingSummaryTypes.ominous> = yield auto.getMeetingSummary({
      meetingId: a.aimId,
    });

    if (resOK(summaryRes)) {
      // 获取到了ok的summary
      if (summaryRes.value.state === 1) {
        const snap = [...S.Meeting.grab().meetingSnapshot];
        const oneSnap = findSnapshot(snap, a.aimId);
        if (oneSnap) {
          oneSnap.meetingData.summary = summaryRes.value.content;
          oneSnap.meetingPage.isSummarySend = true;
          oneSnap.meetingPage.isSummaryLoad = true;
          yield {
            meetingSnapshot: snap,
            sign: ["readSnapshot"],
          };
        }
      }
    }
  },
  fetchMeetingList: function*(s, a) {
    // 获取会议列表
    const meetingRes:
      | checki<getMeetingListTypes.response>
      | checki<any> = yield auto.getMeetingList({
      userId: app.get("userData")._id,
      state: 1,
      page: 1,
      row: 1,
    });
    // 异步后轮询态可能改变, 得判断
    if (resOK(meetingRes)) {
      const list = meetingRes.value;
      const snapshot = resolveMeetingListToSnapshot(list);
      yield {
        sign: ["readSnapshot"],
        meetingSnapshot: snapshot,
      };
    }
    resLog(meetingRes);
  },
  fetchMeetingDetail: function*(s, a) {
    let aimId = a.aimId;
    const loadings = readLoadingState(S.Meeting.grab().meetingSnapshot);
    const meetingDetailRes:
      | checki<searchMeetingMessageTypes.response>
      | checki<any> = yield auto.searchMeetingMessage({
      meetingId: aimId,
    });
    if (resOK(meetingDetailRes)) {
      const snap = [...S.Meeting.grab().meetingSnapshot];
      const oneSnap = findSnapshot(snap, aimId);
      // meetingDetail只能获取到会议相关的数据
      let resolveMeetingData = resolveMeetingSearchResToMeetingData(
        meetingDetailRes.value
      );
      //如果本来就有该会议，那么正在编辑的内容不能使用rest拉取到的数据
      if (oneSnap) {
        // @不覆盖summary的编辑
        resolveMeetingData.summary = oneSnap.meetingData.summary;
        resolveMeetingData.fromName = oneSnap.meetingData.fromName;
        resolveMeetingData.fromAvatar = oneSnap.meetingData.fromAvatar;
        resolveMeetingData.body.updateMeeting =
          oneSnap.meetingData.body.updateMeeting;
        resolveMeetingData.body.members = oneSnap.meetingData.body.members;
        //如果之前有repeat的数据，就设置之前的数据
        resolveMeetingData.body.repeatEndTime =
          oneSnap.meetingData.body.repeatEndTime ||
          resolveMeetingData.body.repeatEndTime;
        resolveMeetingData.body.repeatStartTime =
          oneSnap.meetingData.body.repeatStartTime ||
          resolveMeetingData.body.repeatStartTime;
        resolveMeetingData.body.repeatType =
          oneSnap.meetingData.body.repeatType ||
          resolveMeetingData.body.repeatType;
        resolveMeetingData.body.repeatValue =
          oneSnap.meetingData.body.repeatValue ||
          resolveMeetingData.body.repeatValue;

        // 使用新的meetingData;
        oneSnap.meetingData = resolveMeetingData;

        // @@!! 使用轮询控制loading的结束.
        const newLoading = loadings.getEndLoading(aimId);
        // 如果aimId 有对应的loading;
        newLoading && (oneSnap.meetingPage.loading = newLoading);
      } else {
        //如果没有该会议。那么就得把该会议放到会议集合中
        let one = {
          ...MeetingTypes.createOneMeetingSnapshot(),
          meetingData: resolveMeetingData,
        };
        snap.push(one);
      }

      yield {
        meetingSnapshot: snap,
        sign: ["readSnapshot"],
      };
      if (
        meetingDetailRes.value.repeatMeeting &&
        resolveMeetingData.body.repeatStartTime === undefined
      ) {
        //由于异步，必须传aimid，然后内部通过findsnap找到对应的会议，进行修改
        //否则会造成数据的错乱
        Meeting.fetchRepeatMeeting({
          repeatMeeting: meetingDetailRes.value.repeatMeeting,
          aimId: aimId,
        });
      }
    } else {
      const { code } = meetingDetailRes;
      //如果拒绝了该会议，则会收到该返回码
      if (code === 40306302) {
        yield {
          ...dumpMeeting(s, aimId),
          sign: ["readSnapshot"],
        };
      }
    }

    resLog(meetingDetailRes);
  },
});

// 会议详情的映射, 设置了masterId, 判断了角色
function resolveMeetingSearchResToMeetingData(
  r: searchMeetingMessageTypes.response
) {
  let member = r.members.find(param => {
    return param.user._id === app.get("userData")._id;
  });
  let inviteState = 0;
  if (member) {
    inviteState = member.state;
  }
  const status = getMeetingStatus(
    inviteState,
    r.state,
    r.master === app.get("userData")._id ? "compere" : "attendee"
  );
  const personList = S.Hinger.grab().personList;
  const rus: MeetingTypes.oneMeeting = {
    orderStatus: r.orderState,
    body: {
      subject: r.subject,
      content: r.content,
      updateMeeting: false,
      address: r.address,
      beginTime: +r.beginTime,
      endTime: +r.endTime,
      members: {
        mobiles: [],
        emails: [],
        ids: [],
      },
      roomId: "",
      orderNo: r.order,
      attachments: [],
    },
    attendingList: r.members.map(ren => {
      let user = ren.user;
      let person = personList.find(param => {
        return param.id === user._id;
      });
      let masterId = r.master;
      const rus: AttendingPersonInfo = {
        avatar: user.avatar,
        name:
          (person && person.remark) ||
          user.displayName ||
          user.mobile ||
          user.email,
        id: user._id,
        participationStatus: user._id === masterId ? "master" : "participant",
        // 映射预约的状态
        invitationStatus: attendingMemeberList[ren.state],
        personalMessage: {
          phone: ren.user.mobile,
          email: ren.user.email,
        },
        department: ren.user.department,
        jobTitle: ren.user.jobTitle,
      };
      return rus;
    }),
    repeatMeetingId: r.repeatMeeting,
    // 使用会议列表的状态
    status: status,
    meetingId: r._id,
    summary: "@polling, 无",
    shareId: r.shareId,
    shareKey: r.accessKey,
    masterId: r.master,
    fromName: "@polling none",
    fromAvatar: "@polling none",
    rightClickMenu: false,
  };
  return rus;
}

// 拉取会议列表.
function resolveMeetingListToSnapshot(v: getMeetingListTypes.response) {
  const currentSnapshot = S.Meeting.grab().meetingSnapshot;

  // 保持meetingSnapshot 的数量和拉取的数据一致, 保留预约的会议
  const newMeetingSnapshot: MeetingTypes.OneMeetingSnapshot[] = currentSnapshot.filter(
    snap => {
      if (snap.meetingData.meetingId.includes("schedule")) {
        return true;
      } else {
        return false;
      }
    }
  );
  v.forEach(onep => {
    const m = onep.meeting;
    const status = getMeetingStatus(
      onep.inviteState,
      onep.meeting.state,
      onep.meeting.master === app.get("userData")._id ? "compere" : "attendee"
    );
    if (status === "none") return;
    const oneMeeting: MeetingTypes.oneMeeting = {
      orderStatus: onep.meeting.orderState,
      rightClickMenu: false,
      masterId: onep.meeting.master,
      fromName: onep.invitor && onep.invitor.displayName,
      fromAvatar: onep.invitor && onep.invitor.avatar,
      status,
      shareId: onep.meeting.shareId,
      shareKey: onep.meeting.accessKey,
      meetingId: onep.meeting._id,
      repeatMeetingId: onep.meeting.repeatMeeting,
      summary: "",
      body: {
        subject: m.subject,
        beginTime: +m.beginTime,
        endTime: +m.endTime,
        content: m.content,
        address: m.address,
        updateMeeting: false,
        members: {
          mobiles: [],
          emails: [],
          ids: [],
        },
        roomId: "",
        orderNo: onep.meeting.order,
        attachments: [],
      },
      attendingList: [],
    };
    let one = findSnapshot(currentSnapshot, m._id);
    if (one) {
      // 部分使用原来的信息, attendingList, summary;
      oneMeeting.body.members = one.meetingData.body.members;
      oneMeeting.attendingList = one.meetingData.attendingList;
      oneMeeting.body.updateMeeting = one.meetingData.body.updateMeeting;
      oneMeeting.body.repeatEndTime = one.meetingData.body.repeatEndTime;
      oneMeeting.body.repeatStartTime = one.meetingData.body.repeatStartTime;
      oneMeeting.body.repeatType = one.meetingData.body.repeatType;
      oneMeeting.body.repeatValue = one.meetingData.body.repeatValue;
      // 会议纪要是单独的接口
      oneMeeting.summary = one.meetingData.summary;
      // 更新快照中的meetingData;
      one.meetingData = oneMeeting;

      newMeetingSnapshot.push(one);
    } else {
      one = {
        ...MeetingTypes.createOneMeetingSnapshot(),
        meetingData: oneMeeting,
      };

      newMeetingSnapshot.push(one);
    }
    // 判断会议纪要
    if (onep.summaryState === 1 || onep.meeting.state === 4) {
      // 判断会议纪要是否发出了.
      one.meetingPage.isSummarySend = true;
    } else {
      one.meetingPage.isSummarySend = false;
    }

    if (one.meetingPage.isSummarySend && !one.meetingPage.isSummaryLoad) {
      one.meetingData.summary = "未加载";
    }

    // 判断会议笔记
    if (onep.noteContent && one.meetingPage.loading.noteEidt === 0) {
      one.meetingPerson.noteStr = onep.noteContent;
      one.meetingPage.loading.noteEidt = 2;
    }
    // 判断是否延时
    checkTimeDelay(one);
  });
  return newMeetingSnapshot;
}

function readLoadingState(snap: MeetingTypes.OneMeetingSnapshot[]) {
  const loadings: {
    [x: string]: MeetingTypes.loading;
  } = {};
  snap.forEach(d => {
    loadings[d.meetingData.meetingId] = {
      ...d.meetingPage.loading,
    };
  });

  return {
    getEndLoading(id: string) {
      let rus!: MeetingTypes.loading;
      let focus = loadings[id];
      if (focus) {
        rus = {} as any;
        // 如果发出轮询的时候是loading, 用轮询的结果结束loading.
        // 使loading 状态保持了一个轮询周期
        // 如果发出的时候不是loading, 那就不管当前的loading状态.
        for (const key in focus) {
          if (focus[key] === 1) {
            rus[key] = 0;
          } else {
            rus[key] = focus[key];
          }
        }
        return rus;
      } else {
        return;
      }
    },
  };
}

const meetingStatus: {
  [x: string]: MeetingTypes.MeetingStatus;
} = {
  0: "waiting",
  1: "inMeeting",
  3: "justEnd",
  4: "justEnd",
};

const attendingMemeberList: {
  [x: string]: invitationStatus;
} = {
  0: "wait",
  1: "reject",
  2: "accept",
};

function getMeetingStatus(
  inviteState: number,
  meetingState: number,
  role: "compere" | "attendee"
): MeetingTypes.MeetingStatus {
  let status = meetingStatus[meetingState];
  // 判断是否是邀请的会议
  // compere 的状态一直为0;
  if (inviteState === 0 && role === "attendee") {
    status = "inviting";
  } else if (inviteState === 1) {
    status = "none";
  } else {
    status = meetingStatus[meetingState];
  }
  return status;
}

const units = ["b", "kb", "M", "G", "T"];
const oneUnitSize = 1000;
function getFileSize(size: number) {
  for (let i = 0; i < units.length; i++) {
    let transSize = size / oneUnitSize;
    if (transSize < 1) {
      if (i <= 1) {
        return Math.round(size) + units[i];
      } else {
        return size.toFixed(1) + units[i];
      }
    } else {
      size = transSize;
    }
  }
  return "to Big!!";
}
