/**
 * 控制页面的滚动的, 参数分两部分使用的类似curry化的函数
 */

import * as React from "react";
import "./ContentScroll.scss";
import { MovingSelector } from "src/utils/Dom/MovingSelector/MovingSelector";

export type ContentScrollProps = {
  selected: number;
  shouldBeTop?: boolean;
  shouldScrolling: boolean;
};

export type ContentScrollArgs<T extends number> = {
  getContainer?(ele: HTMLElement | null): HTMLElement | null;
  contents: {
    key: T;
    ele: JSX.Element | null;
  }[];
  offset?: number;
};

// ! 通过类型升级, 构建使用时类型自定义

export class ContentScroll extends React.Component<
  ContentScrollProps & ContentScrollArgs<number>
> {
  container: HTMLElement | null;
  moving = MovingSelector({ offset: this.props.offset || 0 });
  componentDidMount() {
    if (this.props.getContainer) {
      this.moving.setContainer(this.props.getContainer(this.container));
    }
  }
  getContainer = (ele: HTMLElement | null) => {
    if (!this.props.getContainer) {
      this.moving.setContainer(ele);
    } else {
      this.container = ele;
    }
  };
  render() {
    const p = this.props;
    if (p.shouldBeTop) {
      this.moving.gotoTop();
    } else {
      p.shouldScrolling && this.moving.selectKey(p.selected);
    }
    return (
      <div className="content-scroll" ref={this.getContainer}>
        {p.contents.map(onep => {
          return (
            <div
              className="content-scroll-block"
              key={onep.key}
              ref={this.moving.setEle(onep.key)}
            >
              {onep.ele}
            </div>
          );
        })}
      </div>
    );
  }
}
