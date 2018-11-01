import { Component } from "react";
import * as React from "react";
import "./AddressSelector.scss";
import {
  nativeLogMessage,
  utilsLog,
} from "../../../../../../../services/native";
import { MeetingTypes } from "../../../../../../../pivot/Meeting/Actor/MeetingTypes";
import { ModalClose } from "../../../../../common/MainContentModal/ModalClose";
import {
  Meeting,
  MeetingConnect,
} from "../../../../../../../pivot/Meeting/Actor/MeetingActor";
import { PopCard } from "../../../../../../common/component/Pop/PopCard";
import { Fusion } from "../../../../../../../stores/Actor/fusion";
import { S } from "../../../../../../../stores";
import * as moment from "moment";
import { app } from "../../../../../../../stores/app/app";

class AddressSelector extends Component<
  MeetingTypes.BookMeeting & {
    token: string;
    iframeSrc: string;
    timestamp: number;
  }
> {
  componentDidMount() {
    // window.addEventListener("message", this.reciveMessage);
    window.onmessage = this.reciveMessage;
  }
  componentWillUnmount() {
    window.onmessage = () => {};
    // window.removeEventListener("message", this.reciveMessage);
  }

  state = {
    message: "",
    clickClose: false,
  };
  addSelectorIframe: any = null;
  reciveMessage = (ev: any) => {
    console.log("revice postmessage in teams =>", ev);
    nativeLogMessage("revice postmessage in teams", ev.data);
    let data: MeetingTypes.MeetingResult = ev.data;
    if (data.action === "book" || data.action === "cancel-book") {
      Meeting.setAddressSelector({ show: false });
    } else if (data.action === "error") {
      utilsLog({
        msg: `address selector error: ${JSON.stringify(ev.data)}`,
      });
    }
    Meeting.setMeetingFilter({ content: data });
  };
  render() {
    let config = {
      onClickClose: () => {
        Meeting.setAddressSelector({ show: false });
      },
      className: "address-selector-close",
    };
    const p = this.props;
    console.log("iframesrc: ", this.props.iframeSrc);
    let src = p.iframeSrc
      ? this.props.iframeSrc +
        `?token=${this.props.token}&timeStamp=${
          this.props.timestamp
        }&apiProxyServerName=${app.get("server_name")}`
      : "";
    console.log("iframe url: ", { src });
    nativeLogMessage("iframe url: ", { src });
    return (
      <div className="address-selector-container">
        <div className="address-selector-top">
          <h1 className="address-selector-title">会议室预约</h1>
          <ModalClose {...config} />
        </div>
        <hr className="address-selector-divider" />
        {p.iframeSrc && (
          <iframe
            className="address-selector-iframe"
            ref={ele => {
              this.addSelectorIframe = ele;
            }}
            name=""
            sandbox={"allow-scripts allow-top-navigation allow-same-origin"}
            onLoad={() => {
              this.addSelectorIframe.contentWindow.postMessage(
                { ...this.props },
                "*"
              );
            }}
            onError={() => {
              nativeLogMessage("iframe load error");
              utilsLog({ level: "error", msg: "iframe load error" });
            }}
            src={src}
            scrolling={"false"}
            id="addselector-iframe"
          />
        )}
      </div>
    );
  }
}

// connect
export const C_AddressSelectorPop = Fusion(S.Meeting.getStore())(s => {
  return {
    visible: s.showAddressSelectorPopCard,
    onClickBg() {
      Meeting.setAddressSelector({ show: false });
    },
  };
})(p => {
  return (
    <PopCard visible={p.visible} popContentClassName={"address-selector-pop"}>
      <C_AddressSelector />
    </PopCard>
  );
});

export const C_AddressSelector = MeetingConnect(s => {
  // from app data
  const mrbsServer = app.get("mrbsServer");
  const body = s.editingDetail;
  let date = new Date();
  date.setTime(body.beginTime);
  let beginDate = new Date();
  beginDate.setTime(body.beginTime);
  let endDate = new Date();
  endDate.setTime(body.endTime);
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
  let repeatEndDate = body.repeatEndTime
    ? moment(body.repeatEndTime).format("YYYY-M-D")
    : "";
  let filter = {} as MeetingTypes.MeetingFilter;
  filter = {
    search: "",
    park: {
      area: "",
      floor: [],
      text: "",
    },
    date: date,
    timeLimit: [beginDate, endDate],
    repeat: {
      type: repeatType,
      repeatDateArr: repeatDateArr,
      repeatEndDate: repeatEndDate,
      skipConflict: 0,
    },
    other: [],
  };
  let configInfo = {
    action: "test",
    token: app.get("access_token"),
    filter: filter,
    orderNo: s.meetingData.body.orderNo,
    addressSelectorShow: s.showAddressSelectorPopCard,
    // @ts-ignore
    iframeSrc: s.showAddressSelectorPopCard ? mrbsServer + "/teams/#/" : "",
    timestamp: s.addressSelectorTimestamp,
  };
  return {
    configInfo: configInfo,
  };
})(p => {
  return p.configInfo.addressSelectorShow === true ? (
    <AddressSelector {...p.configInfo} />
  ) : null;
});
