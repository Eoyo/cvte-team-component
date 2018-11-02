import { scheduleMeetingTypes } from "../../../services/auto/spore";
import { AttendingPersonInfo } from "../../../view/content/Meeting/content/AttendingList/AttendingListTypes";
import { OneFileCardData } from "../../../view/content/Meeting/content/FileListViewer/FileList/OneFileCard";
import { Canceler } from "axios";
import { AddGroupTypes } from "../../../view/content/AddGroup/AddGroupTypes";
import { mergeObj } from "../../../stores/Actor/tool";
import * as moment from "moment";

export type MeetingProps = {
  status: MeetingTypes.MeetingStatus;
};
export type cardStatus = "editable" | "editing" | "notEditable";

export namespace MeetingTypes {
  export type MeetingStatus =
    | "schedule"
    | "inviting"
    | "waiting"
    | "inMeeting"
    | "justEnd"
    | "none";

  //订单状态，0为没有预约会议室，1为预约，2为签到，3为结束，4为取消
  export type MeetingOrderStatus = 0 | 1 | 2 | 3 | 4;

  export type memberMessage = {
    id: string;
    phone?: string;
    email?: string;
  };

  export type RepeatMeetingType = 0 | 1;

  export type MeetingResult = MeetingTypes.MeetingFilter & {
    action: "book" | "cancel-book";
    data: any;
    filter: MeetingTypes.MeetingFilter;
  };

  export type EditingDetail = {
    content: string; //会议内容
    subject: string; // 会议标题
    beginTime: number; // 会议开始时间，unix时间戳，单位毫秒
    endTime: number; // 会议结束时间，unix时间戳，单位毫秒
    address: string; // 会议地点
    repeatEndTime?: number;
    repeatStartTime?: number;
    repeatType?: RepeatMeetingType;
    repeatValue?: string;
    roomId?: string;
  };

  export type meetingDetail = {
    body: scheduleMeetingTypes.body & {
      orderNo: string;
      updateMeeting: boolean; //创建者是否更新了会议，如果本人是创建人，不会设置该变量
      repeatEndTime?: number;
      repeatStartTime?: number;
      repeatType?: RepeatMeetingType;
      repeatValue?: string;
    };
    attendingList: AttendingPersonInfo[];
  };
  export type BookMeeting = {
    action: string;
    filter: MeetingFilter;
    orderNo: string;
  };
  //预约会议室的选项
  export type MeetingFilter = {
    search: string;
    park: {
      area: string;
      floor: string[];
      text: string;
    };
    date: Date;
    timeLimit: [Date, Date];
    repeat: {
      type: 0 | 1 | 2; //0表示不重复，1表示每日，2表示每周
      repeatDateArr: number[]; //type = 2才会用到
      repeatEndDate: string | null;
      skipConflict: 0 | 1; //是否跳过冲突，0--不跳过，1--跳过
    };
    other: string[];
  };
  export function createMeetingDetail(): meetingDetail {
    return {
      body: {
        subject: "",
        content: "",
        address: "",
        updateMeeting: false,
        beginTime: 0,
        endTime: 0,
        members: {
          mobiles: [],
          emails: [],
          ids: [],
        },
        orderNo: "",
        roomId: "",
        attachments: [],
        repeatEndTime: undefined,
        repeatStartTime: undefined,
        repeatType: undefined,
        repeatValue: undefined,
      },
      attendingList: [],
    };
  }
  export type oneMeeting = meetingDetail & {
    orderStatus: MeetingOrderStatus;
    status: MeetingStatus;
    meetingId: string;
    repeatMeetingId?: string;
    summary: string;
    shareId: string;
    shareKey: string;
    masterId: string; // 发起人的Id!!
    fromName: string; // 发起人的名字
    fromAvatar: string; //发起人的头像
    rightClickMenu: boolean; //是否打开右键菜单
  };
  export function createOneMeetingData(status: MeetingStatus): oneMeeting {
    return {
      orderStatus: 0,
      status,
      meetingId: "",
      shareId: "",
      repeatMeetingId: "",
      shareKey: "",
      summary: "",
      masterId: "",
      fromName: "",
      fromAvatar: "",
      rightClickMenu: false,
      ...createMeetingDetail(),
    };
  }

  export type PersonRole = "compere" | "attendee";

  export type MeetingPersonal = {
    noteStr: string; // htmlStr
    isNoteFirst: boolean; // 是否是新建的note.
    role: PersonRole;
    detailEdit: cardStatus;
  };

  export function createMeetingPersonal(): MeetingPersonal {
    return {
      noteStr: "",
      isNoteFirst: true,
      role: "attendee",
      detailEdit: "notEditable",
    };
  }

  export type loading = {
    schedule: loadingCode;
    attending: loadingCode;
    detailEditing: loadingCode; // 详情的编辑状态
    summary: loadingCode;
    noteEidt: loadingCode;
  };

  export type OneFile = {
    id: string;
    downloadUrl: string;
    card: OneFileCardData;
  };

  export type UploaderFile = OneFile & {
    file: File;
    cancel?: Canceler;
  };

  export class filePopshow {
    tooBig = false;
    tooMany = false;
    someWrong = false;
    wrongType = false;
  }

  // 状态的寄存
  export type OneMeetingPage = {
    uploadFiles: UploaderFile[]; //uploadFiles为上传的文件，会携带File属性，并且可以有中途可以取消上传的属性
    viewFiles: OneFile[]; //viewFiles不是上传的文件，并且所有的uploadFiles在上传后如果刷新界面也都会转换为viewFiles
    waitingTime: number;
    consistentTime: number;
    showAddGroup: boolean;
    isSummarySend: boolean; //纪要是否已经发送
    isSummaryLoad: boolean; //纪要是否已经加载
    isSummaryEdit: boolean; //纪要是否正在编辑
    isSummaryFocus: boolean; //纪要是否聚焦了
    selectedPerson: AddGroupTypes.PersonSelector[];
    loading: loading;
    inviteFrom: string; // 邀请人的名字.
    messageShow: filePopshow;
    isDelay: boolean; // 是否延时
  };
  export function createOneMeetingPage(): OneMeetingPage {
    return {
      isSummarySend: false,
      isSummaryLoad: false,
      isSummaryEdit: false,
      isSummaryFocus: false,
      isDelay: false,
      showAddGroup: false,
      waitingTime: 0,
      consistentTime: 0,
      selectedPerson: [],
      inviteFrom: "",
      uploadFiles: [],
      viewFiles: [],
      messageShow: new filePopshow(),
      loading: {
        attending: 0,
        schedule: 0,
        detailEditing: 0,
        summary: 0,
        noteEidt: 0,
      },
    };
  }
  export type OneMeetingSnapshot = {
    meetingData: oneMeeting;
    meetingPerson: MeetingPersonal;
    meetingPage: OneMeetingPage;
  };
  export function createOneMeetingSnapshot(
    status?: MeetingStatus
  ): OneMeetingSnapshot {
    return {
      meetingData: createOneMeetingData(status || "none"),
      meetingPerson: createMeetingPersonal(),
      meetingPage: createOneMeetingPage(),
    };
  }
  export type MeetingListRightClickPopCard = {
    meetingId: string;
    clickType: MeetingRightClick;
    showRightClickPopCard: boolean;
    title: string;
    content: string;
    onConfirm(): void;
    onCancel(): void;
  };

  export type MeetingRightClick =
    | "cancel"
    | "delete"
    | "stop"
    | "attending"
    | "reject"
    | "exit";

  // 0 : static; 1 : loading; 2: success; 3: message ;4: error;
  export type loadingCode = 0 | 1 | 2 | 3 | 4;
  export type InitState = {
    sign: ("readSnapshot" | "emitMeetingPageScroll" | "startNote")[];
    // 会议的数据
    aimAtMeetingId: string; // 当前聚焦的会议
    deleteFileId: string;
    meetingData: oneMeeting;
    meetingPerson: MeetingPersonal;
    meetingPage: OneMeetingPage;
    editingDetail: EditingDetail;
    scheduleMeetingDraft: {
      meetingData: oneMeeting;
      meetingPerson: MeetingPersonal;
      meetingPage: OneMeetingPage;
      scheduleMeeting: boolean;
    };
    showDeleteFilePopCard: boolean; //删除文件的modal是否打开
    showSendSummaryPopCard: boolean; //同步参会人弹框
    showMeetingTimePickerPopCard: boolean; // 填写会议时间弹窗
    showSchedulePopCard: boolean;
    showMeetingBeUsedPopCard: boolean;
    meetingSnapshot: OneMeetingSnapshot[];
    meetingBeUsed: boolean;
    showCancelRepeatPopCard: boolean;
    showModifyRepeatPopCard: boolean;
    showRepeatTimeSelectorPopCard: boolean; //重复时间选择弹框
    showAddressSelectorPopCard: boolean; //会议室管理弹框
    showStartTimeLessThanNowPopCard: boolean;
    startTimeLessThanNow: boolean;
    showMeetingListTimeConflictPopCard: boolean; //和本地会议列表比较，冲突弹出的卡片
    showRepeatTimeOverThirtyDayPopCard: boolean; //判断重复会议时间间隔是否大于30天,大于30天弹出的卡片
    showMeetingAddressConflictPopCard: boolean; //和会议室列表比较，冲突弹出的卡片
    updateInfo?: {
      updateStartTime?: number;
      updateEndTime?: number;
      updateRepeatType?: RepeatMeetingType;
      updateRepeatValue?: string;
      updateRepeatEndTime?: number;
    };
    conflictContents: string[];
    addressSelectorTimestamp: number;
    meetingListRightClickInfo: MeetingListRightClickPopCard;
  };

  export function createInitState(): InitState {
    return {
      sign: [],
      aimAtMeetingId: "",
      meetingBeUsed: false,
      editingDetail: {
        content: "",
        subject: "",
        beginTime: 0,
        endTime: 0,
        address: "",
      },
      showMeetingBeUsedPopCard: false,
      showMeetingTimePickerPopCard: false, // 填写会议时间弹窗
      showMeetingListTimeConflictPopCard: false,
      showRepeatTimeOverThirtyDayPopCard: false,
      showMeetingAddressConflictPopCard: false,
      conflictContents: [],
      ...createOneMeetingSnapshot(),
      scheduleMeetingDraft: {
        ...createOneMeetingSnapshot(),
        scheduleMeeting: false,
      },
      showSchedulePopCard: false,
      meetingSnapshot: [],
      showCancelRepeatPopCard: false,
      showRepeatTimeSelectorPopCard: false,
      showAddressSelectorPopCard: false,
      addressSelectorTimestamp: Date.now(),
      showSendSummaryPopCard: false,
      showModifyRepeatPopCard: false,
      showDeleteFilePopCard: false,
      showStartTimeLessThanNowPopCard: false,
      startTimeLessThanNow: false,
      deleteFileId: "",
      meetingListRightClickInfo: {
        meetingId: "",
        clickType: "cancel",
        showRightClickPopCard: false,
        title: "",
        content: "",
        onConfirm: () => {},
        onCancel: () => {},
      },
    };
  }
  export type merge = mergeObj<InitState>;
}
