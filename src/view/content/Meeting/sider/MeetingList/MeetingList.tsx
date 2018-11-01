/**
 * 会议列表
 */
import * as React from "react";
import { Menu } from "antd";
import { OneMeeting, MeetingDateArr, PerMeetingDate } from "./MeetingListTypes";
import { MeetingListCard } from "./MeetingListCard/MeetingListCard";
import "./MeetingList.scss";
import { U } from "../../../../../utils";
const SubMenu = Menu.SubMenu;
const DEFAULT_OPEN_KEYS = ["今天", "昨天"];
export class MeetingList extends React.Component<{
  meetings: OneMeeting[];
  selectedKeys: string[];
}> {
  public state = {
    openKeys: DEFAULT_OPEN_KEYS as string[],
    selectedKeys: DEFAULT_OPEN_KEYS as string[],
  };
  public meetingDateArr: MeetingDateArr = [];
  setOpenKeys(ids: string[]) {
    const shouldOpenKeys = new Set(this.state.openKeys);
    for (let id of ids) {
      for (let oneDay of this.meetingDateArr) {
        // 找到meeting数据; 判断这个会议是不是属于这个日期.
        let meeting = oneDay.meetings.find(param => {
          return param.meetingId === id;
        });
        if (meeting) {
          shouldOpenKeys.add(oneDay.date);
        }
      }
    }
    this.state.openKeys = [...shouldOpenKeys];
  }
  getProps() {
    this.meetingDateArr = MeetingsToDateArr(this.props.meetings);
    const shouldOpenSelected = [] as string[];
    const lastSelected = this.state.selectedKeys;

    //如果本次的selectKeys和上一次的一样的，就不要更新了
    //选出和上一次不一样的，进行更新
    for (let i in this.props.selectedKeys) {
      if (lastSelected.indexOf(this.props.selectedKeys[i]) < 0) {
        shouldOpenSelected.push(this.props.selectedKeys[i]);
      }
    }

    this.setOpenKeys(shouldOpenSelected);
    this.state.selectedKeys = this.props.selectedKeys;
  }
  render() {
    this.getProps();
    return (
      <div className="meeting-list">
        {this.meetingDateArr.length === 0 ? (
          <div className="meeting-list-empty-content">暂无会议记录</div>
        ) : (
          <Menu
            defaultOpenKeys={DEFAULT_OPEN_KEYS}
            defaultSelectedKeys={DEFAULT_OPEN_KEYS}
            mode="inline"
            openKeys={this.state.openKeys}
            selectedKeys={this.state.selectedKeys}
            onOpenChange={(openKeys: string[]) => {
              this.setState({ openKeys });
            }}
            style={{
              width: 240,
              position: "relative",
            }}
          >
            {this.meetingDateArr.map(perMeetingDate => {
              let num = 0;
              //判断会议列表中是否有被邀请的会议，如果有，就需要设置会议数量的文字颜色为红色
              let hasInvitingMeeting = false;
              //预约的会议不记录
              for (let i in perMeetingDate.meetings) {
                let status = perMeetingDate.meetings[i].status;
                if (status !== "schedule") {
                  ++num;
                }
                if (status === "inviting" || status === "inviting-conflict") {
                  hasInvitingMeeting = true;
                }
              }
              return (
                <SubMenu
                  key={perMeetingDate.date}
                  title={
                    <div className="meeting-list-submenu">
                      <div className="meeting-list-submenu-day">
                        {perMeetingDate.date}
                      </div>
                      <div
                        className={
                          hasInvitingMeeting
                            ? "meeting-list-submenu-num-has-inviting"
                            : "" + " meeting-list-submenu-num"
                        }
                      >
                        {num}
                      </div>
                    </div>
                  }
                >
                  {perMeetingDate.meetings.map(m => {
                    return (
                      <Menu.Item
                        className={`meeting-list-menu-item ${m.status}`}
                        key={m.meetingId}
                      >
                        <MeetingListCard {...m} />
                        <hr className="meeting-list-menu-divider" />
                      </Menu.Item>
                    );
                  })}
                </SubMenu>
              );
            })}
          </Menu>
        )}
      </div>
    );
  }
}

//目前只有被邀请状态才会有冲突
function findConflictMeetings(meetings: MeetingDateArr) {
  for (let i = 0; i < meetings.length; ++i) {
    for (let j = 0; j < meetings[i].meetings.length; ++j) {
      let perMeeting = meetings[i].meetings[j];
      if (perMeeting.role === "attendee" && perMeeting.status === "inviting") {
        //向后查找，把后面的endTime和当前会议的startTime作对比
        //endTime大于startTime，说明有冲突
        for (let k = j + 1; k < meetings[i].meetings.length; ++k) {
          if (!meetings[i].meetings[k].endTime || !perMeeting.startTime) {
            continue;
          }
          let isJoinMeeting = true;
          //未确认加入的会议不用标注在冲突时间中
          if (
            meetings[i].meetings[k].status === "inviting" ||
            meetings[i].meetings[k].status === "inviting-conflict"
          ) {
            isJoinMeeting = false;
          }
          if (
            isJoinMeeting &&
            meetings[i].meetings[k].endTime > perMeeting.startTime
          ) {
            perMeeting.status = "inviting-conflict";
            let conflictMeeting = meetings[i].meetings[k];
            perMeeting.conflictMeetings.push({
              title: conflictMeeting.title,
              startTime: conflictMeeting.startTime,
              endTime: conflictMeeting.endTime,
              meetingId: conflictMeeting.meetingId,
            });
          }
        }

        //向前查找（前面的是时间靠后的），如果前面的startTime小于当前会议的endTime
        //说明有冲突
        for (let k = j - 1; k >= 0; --k) {
          if (!meetings[i].meetings[k].startTime || !perMeeting.endTime) {
            continue;
          }
          let isJoinMeeting = true;
          if (
            meetings[i].meetings[k].status === "inviting" ||
            meetings[i].meetings[k].status === "inviting-conflict"
          ) {
            isJoinMeeting = false;
          }
          if (
            isJoinMeeting &&
            meetings[i].meetings[k].startTime < perMeeting.endTime
          ) {
            perMeeting.status = "inviting-conflict";
            let conflictMeeting = meetings[i].meetings[k];
            perMeeting.conflictMeetings.push({
              title: conflictMeeting.title,
              startTime: conflictMeeting.startTime,
              endTime: conflictMeeting.endTime,
              meetingId: conflictMeeting.meetingId,
            });
          }
        }
      }
    }
  }
}

// 映射成日期的集合
function MeetingsToDateArr(meetings: OneMeeting[]): MeetingDateArr {
  let meetingDateArr: MeetingDateArr = [];

  function pushMeetingToDate(date: string, onep: OneMeeting) {
    let perMeetingDate: PerMeetingDate = {
      date: date,
      meetings: [],
    };
    let index = meetingDateArr.findIndex(param => {
      return param.date === date;
    });

    //如果在数组中没有找到对应日期的集合，就创建一个
    if (index < 0) {
      meetingDateArr.push(perMeetingDate);
    } else {
      perMeetingDate = meetingDateArr[index];
    }

    perMeetingDate.meetings.push(onep);
  }

  for (let onep of meetings) {
    if (onep.startTime && onep.endTime && onep.status !== "schedule") {
      let date = U.formDate.calendarDay(onep.startTime);
      pushMeetingToDate(date, onep);
    } else {
      //如果是预约会议，就默认为今天的menu
      if (onep.status === "schedule") {
        let now = new Date().getTime();
        let date = U.formDate.calendarDay(now);
        pushMeetingToDate(date, onep);
      } else {
        pushMeetingToDate(U.formDate.normalDay(onep.startTime), onep);
      }
    }
  }
  //每一天的会议根据h+m进行排序，时间越在后面的，排序越在前面
  for (let i in meetingDateArr) {
    meetingDateArr[i].meetings = meetingDateArr[i].meetings.sort(
      (param1, param2) => {
        let now = new Date().getTime();
        let startTime1 = param1.startTime || now;
        let startTime2 = param2.startTime || now;
        if (param1.status === "schedule") {
          return -1;
        } else if (param2.status === "schedule") {
          return 1;
        } else if (startTime1 < startTime2) {
          return 1;
        } else {
          return -1;
        }
      }
    );
  }
  //所有的日期进行排列，时间越后面的，排序越在前面
  meetingDateArr = meetingDateArr.sort((param1, param2) => {
    let now = new Date().getTime();
    let startTime1 = param1.meetings[0].startTime || now;
    let startTime2 = param2.meetings[0].startTime || now;
    if (startTime1 < startTime2) {
      return 1;
    } else {
      return -1;
    }
  });
  findConflictMeetings(meetingDateArr);
  return meetingDateArr;
}
