import styled from "styled-components";
import * as React from "react";
import { ContentViewer } from "../../common/EditorPro/ContentViewer";
import { MeetingConnect } from "../../../../../../pivot/Meeting/Actor/MeetingActor";
import { U } from "../../../../../../utils";
import * as moment from "moment";
import { flex } from "../../../../../common/ts-styled/flex";
import { Popover } from "antd";
import "./MeetingDetailShower.scss";
/**
 * 展示时的
 */

export const S_OneMes = styled("div")`
  --styled: "S_OneMes";
  margin-bottom: 10px;
  ${flex.rowLeft};
  display: inline-flex;
  align-items: flex-start;
  width: 100%;
`;
const KeyName = styled("span")`
  --styled: "KeyName";
  font-size: 14px;
  color: #1e1e1e;
  letter-spacing: 0;
  display: inline-block;
  line-height: 20px;
  margin-right: 10px;
  font-weight: normal;
  width: 28px;
  height: 20px;
`;
const Value = styled("span")`
  font-size: 14px;
  color: #767676;
  display: inline-block;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

// 一条key value 数据.
export class OneMes extends React.Component<{
  keyName: string;
  value: any;
  popOver?: boolean;
}> {
  id = "value" + this.props.keyName;
  state = { popShow: false };
  componentDidMount() {
    let ele = document.getElementById(this.id);
    //如果正好等于最大的长度，说明需要显示
    if (ele && ele.clientWidth === 240) {
      if (this.props.popOver === true) {
        this.setState({
          popShow: true,
        });
      }
    }
  }
  render() {
    const p = this.props;
    return (
      <S_OneMes>
        <KeyName>{p.keyName}</KeyName>
        {this.state.popShow ? (
          <Popover
            style={{ padding: "5px" }}
            placement="bottom"
            overlayClassName="meeting-address-popover"
            content={
              <div className="meeting-address-popover-content">{p.value}</div>
            }
            trigger="hover"
          >
            <Value id={this.id}>{p.value}</Value>
          </Popover>
        ) : (
          <Value id={this.id}>{p.value}</Value>
        )}
      </S_OneMes>
    );
  }
}

export const OneLine = styled("div")`
  --styled: "OneLine";
  ${Value} {
    width: calc(100% - 38px);
    .content-viewer {
      width: 100%;
    }
  }
`;

// 会议内容的标题.
export const Title = styled("div")`
  font-size: 14px;
  font-weight: normal;
  color: #1e1e1e;
  letter-spacing: 0;
  margin-bottom: 10px;
`;

// 展示会议内容
export const C_MeetingContentShower = MeetingConnect(s => {
  // let content = null as JSX.Element | null;
  // if (s.meetingData.body.content !== "") {
  //   content = (
  //     <>
  //       <Title>会议内容</Title>
  //       <ContentViewer
  //         htmlStr={s.meetingData.body.content}
  //         type={"dangerous"}
  //       />
  //     </>
  //   );
  // }
  return {
    content: s.meetingData.body.content,
  };
})(p => (
  <OneLine>
    {p.content && (
      <OneMes
        keyName={"议程"}
        value={<ContentViewer htmlStr={p.content} type={"dangerous"} />}
      />
    )}
  </OneLine>
));

// 展示状态的
export const MeetingDetailShower = MeetingConnect(s => {
  const body = s.meetingData.body;
  let repeatType = 0 as 0 | 1 | 2;
  if (body.repeatType === 0) {
    repeatType = 1;
  } else if (body.repeatType === 1) {
    repeatType = 2;
  }
  let repeatDateArr = [] as number[];
  if (repeatType === 2 && body.repeatValue) {
    let arr = body.repeatValue.split(",");
    for (let i in arr) {
      repeatDateArr.push(parseInt(arr[i]));
    }
  }
  let repeatEndDate = moment(body.repeatEndTime || 0).format("YYYY-M-D");
  let repeatString = "";
  //每周重复
  if (repeatType === 2) {
    repeatDateArr.sort((param1, param2) => {
      return param1 > param2 ? 1 : -1;
    });
    for (let i = 0; i < repeatDateArr.length; ++i) {
      if (i !== repeatDateArr.length - 1) {
        repeatString +=
          "周" + U.formDate.numberTransToWeek(repeatDateArr[i]) + "，";
      } else {
        repeatString += "周" + U.formDate.numberTransToWeek(repeatDateArr[i]);
      }
    }
  } else {
    repeatString += "每天";
  }
  repeatString += "，截至";
  repeatString += repeatEndDate;
  let timeAddressClassName = "";
  let repeatClassName = "";
  let repeatMeeting = s.meetingData.repeatMeetingId ? true : false;
  if (s.meetingData.body.content === "") {
    if (repeatMeeting) {
      repeatClassName = "one-line-without-margin-bottom";
    } else {
      timeAddressClassName = "one-line-without-margin-bottom";
    }
  }
  return {
    time: U.formDate.getTimeStr(body.beginTime, body.endTime),
    meetingRoom: body.address || "待定",
    repeatMeeting: repeatMeeting,
    repeatString: repeatString,
    timeAddressClassName: timeAddressClassName,
    repeatClassName: repeatClassName,
  };
})(p => (
  <>
    <OneLine className={p.timeAddressClassName}>
      <OneMes keyName={"时间"} value={p.time} />
    </OneLine>
    <OneLine>
      <OneMes keyName={"地点"} value={p.meetingRoom} popOver={true} />
    </OneLine>
    {p.repeatMeeting ? (
      <OneLine className={p.repeatClassName}>
        <OneMes keyName={"重复"} value={p.repeatString} />
      </OneLine>
    ) : null}
    <C_MeetingContentShower />
  </>
));
