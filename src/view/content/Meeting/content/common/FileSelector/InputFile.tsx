import * as React from "react";
import "./InputFile.scss";

/**
 * 通过输入框选择文件.
 */
export type InputFileProps = {
  // 选择一次代表添加一次
  onAddFile(files: FileList): void;
};
export class InputFile extends React.Component<InputFileProps> {
  static fileInputCount = 0;
  static getUniqFileInputId() {
    InputFile.fileInputCount += 1;
    return "file-input-" + InputFile.fileInputCount;
  }
  idStr = InputFile.getUniqFileInputId();
  onChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    ev.target.files && this.props.onAddFile(ev.target.files);
    let ele: any = document.getElementById(this.idStr);
    if (ele) {
      ele.value = "";
    }
  };
  render() {
    return (
      <div className="input-file">
        <input
          type="file"
          id={this.idStr}
          accept=".jpg,.jpeg,.png,.bmp,.gif,.svg,.ico,.txt,.md,.rst,.ts,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.zip,.rar"
          onChange={this.onChange}
          className="file-input"
          multiple={true}
        />
        <label htmlFor={this.idStr}>
          <AddSomethingBtn words="" />
        </label>
      </div>
    );
  }
}

export const AddSomethingBtn = (p: { words: string }) => (
  <div className="add-file-btn">
    <i className="add-members-icon" />
    <span className="add-file-word">{p.words}</span>
  </div>
);
