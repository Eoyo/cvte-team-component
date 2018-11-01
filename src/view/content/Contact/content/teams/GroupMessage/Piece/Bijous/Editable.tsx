import * as React from "react";
import { message } from "antd";
import { http } from "../../../../../../../../services/http";
import { Blot } from "../../../../../../../../utils/Dom/EventBlot";
import { S } from "../../../../../../../../stores";
import { isResOK } from "../../../../../../../../utils/Restful";
import { app } from "../../../../../../../../stores/app/app";
import { Iconsvg } from "src/view/common/component/Iconsvg";
import styled from "styled-components";
import { Ele } from "src/view/common/ts-styled/ele";
import "./Editable.scss";

const leak = Blot.LeakClick();
const ValidIcon = styled(Iconsvg)`
  height: 24px;
  width: 24px;
  margin: 1px 2px 3px;
`;

export class Editable extends React.Component<{
  isEditable: boolean;
  description: string;
  id: string;
}> {
  state = {
    oldInputStr: "",
    currentInput: "",
  };
  cancelEdit = () => {
    this.endEdit();
    this.setName(this.state.oldInputStr);
  };
  endEdit = () => {
    S.GroupMessage.merge({
      groupMessage: {
        isEditable: false,
        lastEditName: "",
      },
    });
  };
  edit = (ev: any) => {
    S.GroupMessage.merge({
      groupMessage: {
        isEditable: true,
        lastEditName: this.props.description,
      },
    });
    this.setState({
      oldInputStr: this.props.description,
      currentInput: this.props.description,
    });
  };
  setName = (groupName: string) => {
    S.GroupMessage.merge({
      groupMessage: {
        groupName,
      },
    });
  };
  changeInput = (ev: any) => {
    const groupName = ev.currentTarget.value;
    this.setState({ currentInput: groupName });
  };
  confirmEdit = () => {
    if (!this.state.currentInput) {
      message.error("团队名称不能为空");
      return;
    }

    if (this.state.oldInputStr === this.state.currentInput) {
      this.endEdit();
    } else {
      //先设置为修改后的数据，如果修改成功则不用更改，如果修改失败，就要修改回去
      S.GroupMessage.merge({
        groupMessage: {
          groupName: this.state.currentInput,
        },
      });
      message.loading("正在修改");
      http.group
        .patchTeam(
          { teamId: this.props.id },
          {
            data: {
              name: this.state.currentInput,
            },
            headers: {
              "x-user-id": app.get("userData")._id,
            },
          }
        )
        .then(res => {
          message.destroy();
          if (isResOK(res)) {
            const groupName = this.state.currentInput;
            S.Hinger.updateTeamProperty({
              groupId: this.props.id,
              changeProperty: {
                groupName,
              },
            });
            // message.success("成功修改为:" + groupName);
            message.success("修改成功");
            this.endEdit();
          } else {
            message.error("修改失败" + res.message);
            S.GroupMessage.merge({
              groupMessage: {
                groupName: this.state.oldInputStr,
              },
            });
            this.cancelEdit();
          }
        });
    }
  };

  render() {
    const p = this.props;
    const s = this.state;
    // listenWhile的表现不合预期 TODO: 优化leakClick的listenWhile;
    leak.setLeakClick(this.cancelEdit).listenWhile(p.isEditable);
    // 点击除了leak.setEle 标记的ele , 触发leakClick事件
    return (
      <div className="team-name-editable">
        {p.isEditable ? (
          <div className="editing" ref={leak.setEle(0)}>
            <Ele.input
              className="editRemark-input team-name-input"
              value={s.currentInput}
              onChange={this.changeInput}
              maxLength={30}
              onKeyUp={ev => {
                //如果按了回车，就认为编辑成功
                if (ev.keyCode === 13) {
                  this.confirmEdit();
                  S.GroupMessage.merge({
                    groupMessage: {
                      isEditable: false,
                      lastEditName: "",
                    },
                  });
                }
              }}
              onBlur={() => {
                this.confirmEdit();
                S.GroupMessage.merge({
                  groupMessage: {
                    isEditable: false,
                    lastEditName: "",
                  },
                });
              }}
              autoFocus={true}
            />
          </div>
        ) : (
          <div className="not-edit">
            <div className="descript">{p.description}</div>
            <div
              className="option"
              onClick={ev => {
                this.edit(ev);
              }}
              ref={leak.setEle(1)}
            >
              <i className="teams-icon icon-edit" />
            </div>
          </div>
        )}
      </div>
    );
  }
}
