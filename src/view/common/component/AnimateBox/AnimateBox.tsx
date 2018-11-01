/**
 * 使用缓动动画撑开的元素
 * 1. 使用初始化动画还是更新动画??.
 */
import "./AnimateBox.scss";
import * as React from "react";
import { arrCss } from "../../../../utils/export";
export class AnimateBox extends React.Component<{
  animate?: boolean;
  className?: string;
}> {
  ref = {
    card: null as HTMLElement | null,
    div: null as HTMLElement | null,
  };
  runCount = 0;
  toResize = () => {
    if (this.runCount === 0) {
      setTimeout(() => {
        const ref = this.ref;
        if (ref.div && ref.card) {
          ref.card.style.height = ref.div.offsetHeight + "px";
          console.log(ref.card, ref.div);
        }
        this.runCount = 0;
      }, 200);
      this.runCount += 1;
    }
  };

  render() {
    const p = this.props;
    this.toResize();

    return (
      <div
        ref={ele => {
          ele && (this.ref.card = ele);
        }}
        className={arrCss(["animate-box", p.className])}
      >
        <div
          ref={ele => {
            ele && (this.ref.div = ele);
          }}
        >
          {p.children}
        </div>
      </div>
    );
  }
}
