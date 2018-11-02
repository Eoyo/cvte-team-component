import { Component } from "react";
import * as React from "react";
import { message } from "antd";
import { app } from "../../../../../../../stores/app/app";
import { http } from "../../../../../../../services/http";
import { isResOK } from "../../../../../../../utils/DataControl/ApiHelper";
import { S } from "../../../../../../../stores";
import { SearchInput } from "../../../../../common/SearchInput/SearchInput";

interface EditRemarkState {
  style?: React.CSSProperties;
  id: string;
  name: string;
  remark?: string;
  editResult?: boolean; //编辑备注名的结果
}

class EditRemarkComponents extends Component<EditRemarkState> {
  constructor(props: any) {
    super(props);
  }
  async changeRemark(newRemark: string) {
    if (this.props.remark !== newRemark) {
      message.loading("", 0);
      let data = app.get("userData");
      let res = await http.contacts.changeRemark(
        {
          userId: data._id,
          personId: this.props.id,
        },
        {
          data: {
            remark: newRemark,
          },
          headers: {
            "x-user-id": data._id,
          },
        }
      );
      message.destroy();
      if (isResOK(res)) {
        message.success("修改成功");
        S.contactInfomationCardOperation.updateRemarkOperation({
          remark: this.state.value,
        });
        S.Hinger.updateContactProperty({
          id: this.props.id,
          changeProperty: {
            remark: this.state.value,
          },
        });
      } else {
        message.error("请检查网络后重试");
      }
    } else {
      S.contactInfomationCardOperation.cancelEditRemarkOperation({});
    }
  }
  saveRemark = async () => {
    if (this.state.value.length > 16) {
      S.contactInfomationCardOperation.setEditRemarkStateOperation({
        state: false,
      });
    } else {
      await this.changeRemark(this.state.value);
    }
  };

  //ts的state必须要初始化
  state = {
    value: this.props.remark || "",
  };

  lastId = "";

  public render() {
    //如果本次渲染的id和上一次渲染的id不一致，那么就需要
    //把备注名重新改变，并且取消编辑模式
    if (this.lastId && this.lastId !== this.props.id) {
      this.state.value = !this.props.remark ? "" : this.props.remark;
      S.contactInfomationCardOperation.cancelEditRemarkOperation({});
    }
    this.lastId = this.props.id;
    return (
      <div className="editRemark-container" style={{ ...this.props.style }}>
        <SearchInput
          clear={() => {
            this.setState({ value: "" });
          }}
          maxLength={16}
          onBlur={() => {
            this.saveRemark();
          }}
          placeholder={"请输入备注名称"}
          className="editRemark-input lighter-input"
          keyword={this.state.value}
          onKeyDown={ev => {
            if (ev.keyCode === 13) {
              this.saveRemark();
            }
          }}
          onChange={ev => {
            //限定输入数字，英文，汉字，下划线(_)，空格(\s)
            let value = ev.target.value.replace(
              /[^a-zA-Z0-9\u4E00-\u9FA5\s_'"]/g,
              ""
            );
            this.setState({ value: value });
            if (this.props.editResult === false) {
              //如果内容有改变，并且当前状态是失败，则让对勾btn显示
              S.contactInfomationCardOperation.setEditRemarkStateOperation({
                state: true,
              });
            }
          }}
        />
      </div>
    );
  }
}

export { EditRemarkComponents };
