import * as React from "react";
import "./NoteEditor.scss";
import { ReactEditorPro, ReactEditorProProps } from "./ReactEditorPro";

export type NoteEditorProps = {
  noteStr: string;
  simditor: ReactEditorProProps;
  saving: boolean;
};
export class NoteEditor extends React.Component<NoteEditorProps> {
  componentDidMount() {
    window.addEventListener("unload", this.stopClose);
  }
  componentWillUnmount() {
    window.removeEventListener("unload", this.stopClose);
  }
  stopClose = (ev: Event) => {
    const p = this.props;
    if (p.saving) {
      const leave = confirm("笔记尚在保存中, 是否要离开?");
      if (leave) {
        return true;
      } else {
        ev.preventDefault();
        return false;
      }
    } else {
      return true;
    }
  };
  render() {
    const p = this.props;
    p.simditor.defaultText = p.noteStr;
    return (
      <div className="note-editor">
        <div className="note-editor-title">
          笔记
          {/* <span className={"saving-toast"}>
            ({p.saving ? "保存中.." : "已经保存"})
          </span> */}
        </div>
        <ReactEditorPro {...p.simditor} placeHolder="请输入您的笔记……" />
      </div>
    );
  }
}
