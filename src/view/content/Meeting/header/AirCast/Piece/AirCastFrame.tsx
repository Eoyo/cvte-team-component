/*
 * @File:  投屏大框
 * @Date: 2018-08-16 22:28:52 
 * @Last Modified by: xutao@cvte.com
 * @Last Modified time: 2018-08-24 17:54:52
 */
import * as React from "react";
import { Modal } from "antd";
import { InputContainer } from "./InputContainer/InputContainer";
import { OperationContainer } from "./OperationContainer/OperationContainer";
import "./AirCastFrame.scss";

import { TypeAirCast } from "../AirCastState";
import { ConnectStatusContainer } from "./ConnectStatusContainer/Index";
import { stepStatus } from "../AirCastState";
import { FusionPro } from "../../../../../../stores/utils/fusion";
import { S } from "../../../../../../stores";
import { closeMaskToCloseModal } from "../../../../../../utils/Dom/antd-modal-close";

export const AirCastFusion = FusionPro(
  S.AirCastActor.getStore(),
  (s, ownProps: {}) => {
    return {
      show: s.show,
      step: s.step,
      // step: "status",
      status: s.status,
      errorCode: s.errorCode,
      pincode: s.pincode,
      isPinCodevalid: s.isPinCodevalid,
      isConfirmToConnect: s.isConfirmToConnect,
      mode: s.mode,
    };
  },
  props => {
    const { show, step, status } = props;
    const airCast = () => {
      S.AirCastActor.showModal({});
    };
    closeMaskToCloseModal(".airCast-modal", show, () => {
      S.AirCastActor.closeModal({});
    });
    return (
      <div id="airCast-wrapper">
        <div
          onClick={() => airCast()}
          className="main-content-header__nav-item"
        >
          <i className="teams-icon icon-air-cast" />
          镜像投屏
        </div>
        <Modal
          wrapClassName={"airCast-wrapper"}
          visible={show}
          footer={null}
          closable={false}
          getContainer={() =>
            document.querySelector("#airCast-wrapper") || document.body
          }
          className="airCast-modal"
        >
          <div className="airCast-container-frame">
            {step2Vies(step, props)}
          </div>
        </Modal>
      </div>
    );
  }
);

const step2Vies = (status: string, props: TypeAirCast) => {
  switch (status) {
    case stepStatus.INPUT: {
      return (
        <InputContainer
          pincode={props.pincode}
          isPinCodevalid={props.isPinCodevalid}
          isConfirmToConnect={props.isConfirmToConnect}
          show={props.show}
        />
      );
    }
    case stepStatus.STATUS: {
      return <ConnectStatusContainer connectStatus={props.status} />;
    }
    case stepStatus.MODE: {
      return <OperationContainer />;
    }
    default: {
      return;
    }
  }
};
