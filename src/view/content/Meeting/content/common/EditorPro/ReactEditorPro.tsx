/**
 * 笔记编写的simditor
 */

import * as React from "react";
import "./ReactEditorPro.scss";
import "./ReactEditorProToolBar.scss";
import { Ceilling } from "./Ceiling";
import styled from "styled-components";
import { pageContent } from "./getContainer";
import { eleContain } from "../../../../../../utils/Dom/DomTool";
import _ from "lodash";
import { arrCss } from "src/utils/export";
import { ContentViewer } from "./ContentViewer";
import { message } from "antd";
import { U } from "src/utils";
export type ReactEditorProProps = {
  defaultText?: string;
  placeHolder?: string;
  maxLength?: number; // 最多输入的字符
  onValueChange?: (str: string) => void;
  onEditorBuild?: (editor: any) => void;
  onFocus?(type: boolean, lastFocus: boolean): void;
  autoFocus?: boolean; // 用于控制didmoment的时候是否触发focus
  stopAutoResize?: boolean; // 用于控制是否自动改变大小
};

export const EditorPlaceHolderStyled = styled("div")`
  --styled: "EditorPlaceHolderStyled";
  color: #b2b2b2;
  font-size: 12px;
  line-height: 17px;
  position: absolute;
  padding: 0px;
  top: 0px;
  left: 0px;
`;

declare const Simditor: any;
export class ReactEditorPro extends React.Component<ReactEditorProProps> {
  editor: any = null;
  ele: HTMLElement | null = null;
  textEle: HTMLElement | null;
  placeHolder: HTMLElement | null;
  lastFocus = false;
  data = {
    value: "",
  };
  state = {
    editing: false,
  };
  autoFixCeilling = Ceilling();
  componentDidMount() {
    this.editor = new Simditor({
      textarea: this.textEle,
      toolbar: [
        "title",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "color",
        "|",
        "ol",
        "ul",
        "table",
        "hr",
        "|",
        // "image",
        // "fontScale",
        // "blockquote",
        // "code",
        // "link",
        "indent",
        "outdent",
        "alignment",
      ],
    });

    // 接收初始化的setValue 触发的valuechanged; 所以要把事件监听放在前面
    this.editor.on("valuechanged", this.onValueChange);
    this.setValue();

    if (this.ele) {
      const ceil = this.autoFixCeilling;
      ceil.container(() => {
        const ele = pageContent(this.ele);
        if (ele) {
          const messageLine = $(ele).find(".message-line-bottom")[0];
          if (messageLine) {
            return messageLine;
          } // else {}
        } // else{}
        return ele;
      });
      ceil.ceillEle(0)($(this.ele).find(".simditor-toolbar")[0]);
      ceil.fixEle(0)($(this.ele).find(".simditor-toolbar > ul")[0]);
      ceil.startListenScroll();
      this.simditorEle = $(this.ele).find(".simditor")[0];
      this.closeNoteUtils();
      window.addEventListener("mousedown", this.onCheckMouseDown);
      this.props.autoFocus &&
        !this.props.defaultText &&
        setTimeout(() => {
          this.showNoteUtils();
        });
    }
  }
  componentWillUnmount() {
    this.autoFixCeilling.endListendScroll();
    if (this.editor instanceof Simditor) {
      this.editor.destroy();
      this.editor = null;
    }
    window.removeEventListener("mousedown", this.onCheckMouseDown);
  }

  simditorEle: HTMLElement | null;
  simditorViewer: HTMLElement | null;

  onCheckMouseDown = (ev: MouseEvent) => {
    if (this.simditorEle && this.simditorViewer) {
      if (
        eleContain([this.simditorEle, this.simditorViewer], ev.target as any)
      ) {
        this.showNoteUtils();
      } else {
        this.closeNoteUtils();
      }
    } else {
      this.closeNoteUtils();
    }
  };
  onValueChange = () => {
    const value = this.editor.getValue();
    const d = this.data;
    if (this.props.maxLength) {
      if (value.length > this.props.maxLength) {
        let contentValue = U.getHTMlContent(value);
        if (contentValue.length > this.props.maxLength) {
          message.info("字数不可以超过:" + this.props.maxLength);
          this.editor &&
            this.editor.setValue(contentValue.slice(0, this.props.maxLength));
          return false;
        }
      }
    }

    // 判断值是否更新
    if (value !== d.value) {
      d.value = value;
      this.props.onValueChange && this.props.onValueChange(value);
      return true;
    } else {
      return false;
    }
  };
  setValue = () => {
    if (this.editor) {
      // props.defaultText 的值不一样时触发simditor的写入.
      if (this.props.defaultText == this.data.value) {
        return;
      } else {
        this.editor.setValue(this.props.defaultText);
        this.data.value = this.props.defaultText || "";
      }
    }
  };
  componentDidUpdate() {
    this.setValue();
    if (this.placeHolder) {
      if (this.data.value) {
        $(this.placeHolder).css({
          display: "none",
          // visibility: "hidden",
        });
      } else {
        $(this.placeHolder).css({
          display: "block",
          // visibility: "hidden",
        });
      }
    }
  }
  showNoteUtils = () => {
    if (this.ele && this.state.editing === false) {
      setTimeout(() => {
        // 自动resize的时候需要触发聚焦
        if (!this.props.stopAutoResize) {
          this.editor && this.editor.focus();
        }
        this.ele &&
          $(this.ele)
            .find(".simditor-toolbar")
            .css({
              // visibility: "visible",
              display: "block",
              animation: "ShowRightMessage .3s ease",
            });
        $(".scrollbar-base").trigger("scroll");
      }, 100);
      // 触发focus 事件.
      this.props.onFocus && this.props.onFocus(true, this.lastFocus);
      this.lastFocus = true;
      this.setState({
        editing: true,
      });
    }
  };
  closeNoteUtils = () => {
    if (this.ele) {
      $(this.ele)
        .find(".simditor-toolbar")
        .css({
          display: "none",
          // visibility: "hidden",
          animation: "none",
        });
      this.onBlur();
      this.editor && this.editor.blur();
      this.setState({
        editing: false,
      });
    }
  };
  onBlur = () => {
    this.props.onFocus && this.props.onFocus(false, this.lastFocus);
    this.lastFocus = false;
  };
  render() {
    const p = this.props;
    const s = this.state;
    const displayEditing = s.editing || !!p.stopAutoResize;
    return (
      <div
        className="react-editor"
        ref={ele => {
          ele && (this.ele = ele);
        }}
      >
        {p.placeHolder && (
          <EditorPlaceHolderStyled
            innerRef={(ele: any) => {
              this.placeHolder = ele;
            }}
          >
            {p.placeHolder}
          </EditorPlaceHolderStyled>
        )}

        {/* bm编辑时*/}
        <div
          style={{
            display: displayEditing ? "block" : "none",
          }}
        >
          <textarea
            name="simditor"
            id={"simditor-editor"}
            className={arrCss([this.state.editing && "editing-simditor"])}
            ref={ele => {
              this.textEle = ele;
            }}
          />
        </div>

        <div
          style={{
            display: displayEditing ? "none" : "block",
          }}
          ref={ele => {
            ele && (this.simditorViewer = ele);
          }}
        >
          <ContentViewer
            htmlStr={this.data.value}
            type={"dangerous"}
            noPlaceholder={true}
          />
        </div>
        <div className="fix-stop" ref={this.autoFixCeilling.stopEle} />
      </div>
    );
  }
}
