import * as React from "react";
import { AttendingListProps, AttendingPersonInfo } from "./AttendingListTypes";
import "./AttendingList.scss";
import { S } from "../../../../../stores";
import { avatarType, Avatar } from "../../../../common/component/Avatar/Avatar";
import { MeetingConnect } from "../../../../../pivot/Meeting/Actor/MeetingActor";
import { AnimateBox } from "../../../../common/component/AnimateBox/AnimateBox";
import { PersonMessagePopover } from "src/view/content/Contact/content/teams/GroupMessage/Piece/MemberList/PersonMessagePopCard";
import { Hinger } from "src/stores/DataHinger/DataHingerActor";
import { DataHingerTool } from "src/stores/DataHinger/DataHingerTool";
import { HingerTypes } from "src/stores/DataHinger/DataHingerTypes";
type AttendingPersonInfoProps = AttendingPersonInfo;

export const AttendingPerson: React.SFC<AttendingPersonInfoProps> = p => {
  let showName = p.name;
  let avatarInfo: avatarType = {
    name: p.name,
    members: [
      {
        name: p.name,
        avatarUrl: p.avatar,
      },
    ],
  };
  let className = "";
  let showFont;
  switch (p.invitationStatus) {
    case "accept":
      showFont = (
        <p className="attending-person-status-text attending-accept">已加入</p>
      );

      break;
    case "reject":
      showFont = (
        <p className="attending-person-status-text attending-reject">已拒绝</p>
      );
      break;
    case "wait":
      showFont = (
        <p className="attending-person-status-text attending-wait">待加入</p>
      );
      break;
    case "prepare":
      //   // className = "attending-person-prepare";
      //   showFont = (
      //     <a
      //       className="attending-person-close"
      //       onClick={e => {
      //         if (removeParticipateCallback) {
      //           removeParticipateCallback();
      //         }
      //       }}
      //     >
      //       <Icon type="close-circle-o" />
      //     </a>
      //   );
      break;
    default:
      showFont = null;
      break;
  }
  if (p.participationStatus === "master" && p.status !== "schedule") {
    showFont = (
      <p className="attending-person-status-text attending-master">发起者</p>
    );
  }

  let hingState = Hinger.grab();
  let onep: HingerTypes.person | undefined = undefined;
  if (hingState.self.id === p.id) {
    onep = undefined;
  } else {
    onep = DataHingerTool.findOnePerson(hingState, p.id);
  }
  return (
    <PersonMessagePopover
      onep={
        onep
          ? {
              name: onep.remark || onep.displayName,
              headIconUrl: onep.avatar,
              registed: true,
              hasTrueId: true,
              id: onep.id,
              userPersonalMessage: {
                ...onep.personalMessage,
              },
              isFriend: onep.isFriend,
            }
          : {
              name: p.name,
              headIconUrl: p.avatar,
              registed: true,
              hasTrueId: true,
              id: p.id,
              userPersonalMessage: {
                ...p.personalMessage,
                department: p.department,
                jobTitle: p.jobTitle,
              },
              isFriend: false,
            }
      }
    >
      <div className="attending-person">
        <Avatar avatarUrl={p.avatar} className={`middle-avatar`}>
          {p.invitationStatus === "prepare" ? (
            <i
              onClick={e => {
                if (p.removeParticipateCallback) {
                  p.removeParticipateCallback();
                }
              }}
              className="teams-icon icon-error"
            />
          ) : null}
        </Avatar>
        <div className="attending-person-right-side-text">
          <div className={`attending-person-name ${className}`}>{showName}</div>
          {showFont ? (
            <div className="attending-person-status-info">{showFont}</div>
          ) : null}
        </div>
      </div>
    </PersonMessagePopover>
  );
};

// 参加会议的人员列表.
export const C_AttendingList = MeetingConnect<AttendingListProps>(s => {
  let personList = [...s.meetingData.attendingList];
  return {
    status: s.meetingData.status,
    personList: personList.sort((a, b) => {
      if (a.participationStatus === "master") {
        return -1;
      } else if (b.participationStatus === "master") {
        return 1;
      } else {
        return 0;
      }
    }),
    onDeletePerson:
      s.meetingData.status === "schedule"
        ? id => {
            S.Meeting.removeScheduleMember({ id });
          }
        : undefined,
  };
})(p => {
  return (
    <div className="attending-list">
      {p.personList.map(perInfo => {
        // 绑定取消人员的回调
        if (p.onDeletePerson) {
          perInfo.removeParticipateCallback = () => {
            p.onDeletePerson && p.onDeletePerson(perInfo.id);
          };
        }
        return (
          <AttendingPerson {...perInfo} key={perInfo.id} status={p.status} />
        );
      })}
    </div>
  );
});
