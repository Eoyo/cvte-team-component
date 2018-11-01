import { message } from "antd";
import "./ContactDeletePop.scss";
import * as React from "react";
import { FusionPro } from "../../../../../stores/utils/fusion";
import { S } from "../../../../../stores";
import { Ele } from "../../../../common/ts-styled/ele";
import { PopCard } from "../../../../common/component/Pop/PopCard";
import { app } from "../../../../../stores/app/app";
import { http } from "../../../../../services/http";
import { isResOK } from "../../../../../utils/Restful";

export const C_ContactDeletePop = FusionPro(
  S.contactListOperation.getStore(),
  s => {
    return {
      deleteContactPopCard: s.deleteContactPopCard,
      id: s.rightClickContactId,
    };
  },
  function(c) {
    //删除联系人的rest操作
    function deleteContact(deleteId: string) {
      let data = app.get("userData");
      message.loading("", 0);
      //获取联系人列表
      http.contacts
        .deleteContact(
          {
            urluserId: data._id,
            urlpersonId: deleteId,
          },
          {
            headers: {
              "x-user-id": data._id,
            },
          }
        )
        .then(d => {
          if (isResOK(d)) {
            //让等待的全局提示消失
            message.destroy();
            S.contactInfomationCardOperation.removeOperation({
              id: deleteId,
            });
            S.contactListOperation.merge({
              deleteContactPopCard: false,
            });

            message.success("删除成功");
          } else {
            message.error("请检查网络后重试");
          }
        });
    }

    return (
      <PopCard
        visible={c.deleteContactPopCard}
        onClickBg={() => {
          S.contactListOperation.merge({
            deleteContactPopCard: false,
          });
        }}
        popContentClassName={"delete-contact-pop-content"}
      >
        <div className="delete-contact-title">删除联系人</div>
        <div className="delete-contact-message">确定删除此联系人吗？</div>
        <div className="delete-contact-btn-group">
          <Ele.secondBtn
            onClick={() => {
              S.contactListOperation.merge({
                deleteContactPopCard: false,
              });
            }}
          >
            取消
          </Ele.secondBtn>
          <div className="btn-space" />
          <Ele.secondBtn
            type={"primary"}
            onClick={() => {
              deleteContact(c.id);
            }}
          >
            确认
          </Ele.secondBtn>
        </div>
      </PopCard>
    );
  }
);
