/**
 * 实现通过拖拽的方式实现文件的输入.
 */
import * as React from "react";
import { U } from "../../../../../../utils";
import "./DragDrop.scss";
import _ from "lodash";
export type DragDropProps = {
  allowDragDrop: boolean; //是否允许拖拽文件
  onInputFiles(files: FileList): void;
  onChangeDragState(evType: "over" | "leave"): void;
};

export type DragDropArgs = {
  isEmpty?: boolean;
  placeHolder?: any;
};
export class DragDrop extends React.Component<
  DragDropProps & DragDropArgs,
  { inDrag: boolean }
> {
  state = {
    inDrag: false,
  };
  data = {
    eventType: "" as "over" | "leave" | "drop" | "",
    container: null as null | HTMLElement,
  };
  getProps() {
    const p = this.props;
  }
  changeDragState(b: boolean) {
    this.setState(s => {
      if (b !== this.state.inDrag) {
        this.props.onChangeDragState(b ? "over" : "leave");
      }
      return {
        ...s,
        inDrag: b,
      };
    });
  }
  showDraging = (ev: React.DragEvent<any>) => {
    ev.preventDefault();
    if (this.props.allowDragDrop) {
      if (this.data.eventType !== "over") {
        this.data.eventType = "over";
        this.changeDragState(true);
      }
    }
  };
  closeDraging = (ev: React.DragEvent<any>) => {
    if (this.props.allowDragDrop) {
      this.data.eventType = "leave";
      // 延时检查是否要关闭
      setTimeout(() => {
        this.onCloseDrag();
      }, 100);
    }
  };
  onCloseDrag = _.debounce(() => {
    // 当leave后没有触发over就关闭.
    if (this.data.container) {
      if (this.data.eventType === "over") {
        return;
      } else {
        this.changeDragState(false);
      }
    }
  }, 100);
  getDrop = (ev: React.DragEvent<any>) => {
    ev.preventDefault();
    if (this.props.allowDragDrop) {
      console.log("drop");
      this.data.eventType = "drop";

      // 读取文件
      const files = ev.dataTransfer.files;
      this.props.onInputFiles(files);

      this.changeDragState(false);
    }
  };

  render() {
    const p = this.props;
    const s = this.state;
    //如果允许拖拽，并且当前没有文件就显示虚线边框
    let showBox = p.allowDragDrop && p.isEmpty;
    return (
      <div
        className="drag-drop"
        onDrop={this.getDrop}
        onDragOver={this.showDraging}
        onDragLeave={this.closeDraging}
        ref={ele => {
          this.data.container = ele;
        }}
      >
        <div
          className={U.arrCss([
            "drag-content",
            p.isEmpty && "is-empty",
            s.inDrag && "show", //如果文件正在拖拽到内部，就设置当前的拖拽区域颜色
            !s.inDrag && showBox && "dashed-box-border", //如果文件没有拖入框，就设置框为虚线
            s.inDrag && showBox && "org-box-border", //如果文件拖入框，就设置框为实线
          ])}
        >
          {p.isEmpty && p.allowDragDrop && p.placeHolder}
          {this.props.children}
        </div>
      </div>
    );
  }
}
