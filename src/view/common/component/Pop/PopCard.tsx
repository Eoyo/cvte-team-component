/**
 * PopCard,
 */
import "./PopCard.scss";
import * as React from "react";
import { arrCss } from "../../../../utils/export";
export type PopCardProps = {
  backgroundClassName?: string;
  popContentClassName?: string;
  visible: boolean;

  onClickBg?: () => void;
};

// sfc
export const PopCard: React.SFC<PopCardProps> = p => {
  return (
    <div className={arrCss(["pop-card", p.visible ? "show" : "hidden"])}>
      <div
        className={arrCss(["pop-background", p.backgroundClassName])}
        onClick={() => {
          p.onClickBg && p.onClickBg();
        }}
      />
      <div className={arrCss(["pop-content", p.popContentClassName])}>
        {p.children}
      </div>
    </div>
  );
};
