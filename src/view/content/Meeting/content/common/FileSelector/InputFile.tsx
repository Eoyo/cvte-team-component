import * as React from "react";
import "./InputFile.scss";
import { mimeConfig } from "src/utils/File/fileType";
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
          // .jpg,.jpeg,.png,.bmp,.gif, .svg,.ico,
          // .txt,.md,.rst,.ts,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.zip,.rar
          accept={[
            mimeConfig.pptx,
            mimeConfig.ppt,
            mimeConfig.txt,
            mimeConfig.doc,
            mimeConfig.docx,
            mimeConfig.xls,
            mimeConfig.xlsx,
            mimeConfig.imgae,

            // xmind 的媒体类型为zip
            mimeConfig.zip,
            mimeConfig.rar,
            ".rar",
          ].join(",")}
          onChange={this.onChange}
          className="file-input"
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