import * as React from "react";
import styled, { css } from "styled-components";
import { MovingAutoSelector } from "src/utils/Dom/MovingSelector/MovingAutoSelector";
import { Ele } from "src/view/common/ts-styled/ele";
export const NumLi = styled("li")`
  --styled: "NumLi";
  height: 25px;
  width: 67px;
  margin: 0px 24px 11px;
  text-align: center;
  user-select: none;
  border-radius: 15px;
  line-height: 25px;
  cursor: pointer;
  ${(p: { visible?: boolean }) => {
    if (p.visible === true) {
      return css`
        visibility: visible;
      `;
    } else {
      return css`
        visibility: hidden;
      `;
    }
  }};
`;
export const NumUl = styled(Ele.ul)`
  --styled: "NumUl";
  padding-top: 15px;
  padding: 0px;
  position: absolute;
  width: 100%;
`;
export const NumberWindow = styled("div")`
  --styled: "NumberWindow";
  height: 276px;
  width: 115px;
  background: white;
  border-left: 1px solid #e9e9e9;
  overflow: hidden;
  position: relative;
`;
type NumberPickerProps = {
  arr: string[];
  pick: number;
  onPick(num: number): void;
  forceMove?: boolean; //
  noPlaceHolder?: boolean;
  enableWindow?: [number, number];
};
export class NumberPicker extends React.Component<NumberPickerProps> {
  moving = MovingAutoSelector({
    offset: 126,
    scrollOffset: 100,
    onSelect: key => {
      this.onSetPick(key);
    },
    lensWindow: [0, 20].map(s => s + 129) as [number, number],
    fps: (ele, scaler) => {
      let size = scaler(0);
      let rgb = [205, 238, 239].map(one => {
        if (size > 0.7) {
          return 255;
        } else {
          return (scaler(one / 255) * 255) | 0;
        }
      });
      $(ele).css({
        transform: `scale(${scaler(1.3)})`,
        background: `rgb(${rgb[0]},${rgb[1]},${rgb[2]})`,
      });
      $(ele)
        .find(".time-number-span")
        .css({
          transform: `scale(${scaler(0.9)})`,
          fontWeight: `${size > 0.7 ? "200" : "bold"}`,
        });
    },
  });
  pick = 0;
  componentDidMount() {
    this.moving.quickSelectKey(this.props.pick);
    this.pick = this.props.pick;
  }
  componentWillReceiveProps(nextProps: NumberPickerProps) {
    let newPick = nextProps.pick;
    let enableWindow = nextProps.enableWindow;

    if (enableWindow) {
      if (newPick < nextProps[0]) {
        newPick = nextProps[0];
      } else if (newPick > nextProps[1]) {
        newPick = nextProps[1];
      }
      this.moving.setStartIndex(enableWindow[0]);
    } else {
      this.moving.setStartIndex(0);
    }

    if (newPick !== this.pick) {
      this.setInPick(newPick);
    }
  }

  // movingselector 内部通知出来的.
  onSetPick(i: number) {
    this.pick = i;

    // 如果不是外部强制滚动的, 就触发Pick事件.
    if (!this.props.forceMove) {
      this.props.onPick(i);
      this.moving.selectKey(i);
    } else {
      // 如果是强制move 对内部的事件不理会.
    }

    // 自动延时, 自动处理冲突的selectKey;
  }

  // react 触发出去的
  setOutPick(i: number) {
    //
    if (!this.props.forceMove) {
      this.props.onPick(i);
      this.pick = i;
      this.moving.quickSelectKey(i);
    }
  }

  // 接受props控制的
  setInPick(i: number) {
    this.pick = i;
    this.moving.quickSelectKey(i);
  }

  render() {
    const p = this.props;
    return (
      <NumberWindow onWheel={this.moving.onWheeling}>
        <NumUl
          innerRef={ele => {
            this.moving.setContainer(ele);
          }}
        >
          <NumLi
            innerRef={this.moving.setEle(0)}
            onClick={() => {
              this.setOutPick(0);
            }}
            visible={
              p.enableWindow
                ? p.enableWindow[0] <= 0 && 0 <= p.enableWindow[1]
                : true
            }
          >
            {"-  -"}
          </NumLi>
          {p.arr.map((num, i) => {
            return (
              <NumLi
                key={i}
                innerRef={this.moving.setEle(i + 1)}
                onClick={() => {
                  this.setOutPick(i + 1);
                }}
                visible={
                  p.enableWindow
                    ? p.enableWindow[0] <= i + 1 && i + 1 <= p.enableWindow[1]
                    : true
                }
              >
                <span
                  className="time-number-span"
                  style={{
                    display: "inline-block",
                  }}
                >
                  {num}
                </span>
              </NumLi>
            );
          })}
        </NumUl>
      </NumberWindow>
    );
  }
}
