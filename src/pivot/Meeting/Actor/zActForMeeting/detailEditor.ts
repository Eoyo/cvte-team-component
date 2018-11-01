import { MeetingTypes, cardStatus } from "../MeetingTypes";
import { message } from "antd";
import { Meeting } from "../MeetingActor";
import { Act } from "../../../../stores/Actor/actor";
import { resOK } from "../../../../utils/DataControl/ApiHelper";
import { U } from "../../../../utils";
import { auto } from "../../../../services/auto/spore";

export const detailEditor = Act<MeetingTypes.InitState>()({
  setDetailStatus: {
    status: "notEditable" as cardStatus,
  },
  resetMessage: {},
  cancelModifyDetail: {},
})({
  cancelModifyDetail: (s, a) => {
    return {
      meetingPerson: {
        detailEdit: "notEditable",
      },
    };
  },
  setDetailStatus: (s, a) => {
    return {
      meetingPerson: {
        detailEdit: a.status,
      },
      editingDetail: (() => {
        if (a.status === "editing") {
          return {
            content: s.meetingData.body.content,
            address: s.meetingData.body.address,
            beginTime: s.meetingData.body.beginTime,
            endTime: s.meetingData.body.endTime,
            subject: s.meetingData.body.subject,
            repeatEndTime: s.meetingData.body.repeatEndTime,
            repeatStartTime: s.meetingData.body.repeatStartTime,
            repeatType: s.meetingData.body.repeatType,
            repeatValue: s.meetingData.body.repeatValue,
          };
        } else {
          return {};
        }
      })(),
    };
  },
  resetMessage: function*(s, a) {
    //判断是否有改变，如果有，再进行后面的操作
    let change = changeInfo(s);
    if (!change) {
      yield {
        meetingPerson: {
          detailEdit: "notEditable",
        },
      };
      return;
    }

    if (s.meetingData.repeatMeetingId) {
      Meeting.showModifyPopCard({ view: true });
    } else {
      yield {
        meetingPerson: {
          detailEdit: "editing",
        },
        meetingPage: {
          loading: {
            ...s.meetingPage.loading,
            detailEditing: 1,
          },
        },
      };
      const b = s.editingDetail;

      // @auto, 发起会议修改
      const res = yield auto.modifyMeetingMeesage(
        {
          meetingId: s.aimAtMeetingId,
        },
        {
          data: {
            subject: b.subject,
            content: b.content,
            beginTime: b.beginTime as any,
            endTime: b.endTime as any,
            address: b.address,
            roomId: b.roomId || "",
          },
        }
      );

      message.destroy();
      if (resOK(res)) {
        message.success("修改成功!");
        yield {
          meetingPerson: {
            detailEdit: "notEditable",
          },
          meetingPage: {
            loading: {
              ...s.meetingPage.loading,
              detailEditing: 0,
            },
          },
          meetingData: {
            body: {
              subject: s.editingDetail.subject,
              content: s.editingDetail.content,
              beginTime: s.editingDetail.beginTime,
              endTime: s.editingDetail.endTime,
              address: s.editingDetail.address,
              repeatStartTime: s.editingDetail.repeatStartTime,
              repeatEndTime: s.editingDetail.repeatEndTime,
              repeatValue: s.editingDetail.repeatValue,
              repeatType: s.editingDetail.repeatType,
              roomId: s.editingDetail.roomId,
            },
          },
        };
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
          message.error(res.message);
        }
      }
    }
  },
});

function changeInfo(s: MeetingTypes.InitState) {
  let change = false;
  if (s.meetingData.body.address !== s.editingDetail.address) {
    change = true;
  } else if (s.meetingData.body.beginTime !== s.editingDetail.beginTime) {
    change = true;
  } else if (s.meetingData.body.endTime !== s.editingDetail.endTime) {
    change = true;
  } else if (s.meetingData.body.content !== s.editingDetail.content) {
    change = true;
  } else if (s.meetingData.body.subject !== s.editingDetail.subject) {
    change = true;
  }
  return change;
}
