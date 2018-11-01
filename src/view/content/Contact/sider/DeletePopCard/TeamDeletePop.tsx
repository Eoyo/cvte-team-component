import * as React from "react";
import { message } from "antd";
import "./TeamDeletePop.scss";
import { S } from "../../../../../stores";
import { Fusion } from "../../../../../stores/Actor/fusion";
import { http } from "../../../../../services/http";
import { isResOK } from "../../../../../utils/Restful";
import { app } from "../../../../../stores/app/app";
import { Ele } from "../../../../common/ts-styled/ele";
import { PopCard } from "../../../../common/component/Pop/PopCard";

export const C_TeamDeletePop = Fusion(S.contactListOperation.getStore())(s => {
  return {
    deleteTeamPopCard: s.deleteTeamPopCard,
    id: s.rightClickTeamId,
  };
})(function GroupMessageView(p) {
  return (
    <PopCard
      visible={p.deleteTeamPopCard}
      onClickBg={() => {
        S.contactListOperation.merge({
          deleteTeamPopCard: false,
        });
      }}
      popContentClassName={"delete-group-pop-content"}
    >
      <div className="delete-group-title">退出团队</div>
      <div className="delete-group-message">确定要退出该团队吗</div>
      <div className="delete-group-btn-group">
        <Ele.secondBtn
          onClick={() => {
            S.contactListOperation.merge({
              deleteTeamPopCard: false,
            });
          }}
        >
          取消
        </Ele.secondBtn>
        <div className="btn-space" />
        <Ele.secondBtn
          type={"primary"}
          onClick={() => {
            http.group
              .exitTeam({
                teamId: p.id,
                userId: app.get("userData")._id,
              })
              .then(d => {
                message.destroy();
                if (isResOK(d)) {
                  message.success("已经退出团队");
                  window.location.hash = "/contact/teams";
                  S.Hinger.removeTeam({
                    groupId: p.id,
                  });
                  S.contactListOperation.merge({
                    deleteTeamPopCard: false,
                  });
                } else {
                  message.error("退出失败");
                }
              });
          }}
        >
          确认
        </Ele.secondBtn>
      </div>
    </PopCard>
  );
});
