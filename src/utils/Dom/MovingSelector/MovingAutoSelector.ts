import { MovingSelector } from "./MovingSelector";
import { Lensor } from "../MovingLensor/MovingLensor";
import _ from "lodash";
import { WheelEvent } from "react";
import { start } from "repl";
export function MovingAutoSelector(p: {
  offset: number;
  scrollOffset: number;
  lensWindow: [number, number];
  onSelect(key: number): void;
  fps(ele: HTMLElement, scaleSize: (num: number) => number): void;
}) {
  let MovingTop = 0; // 控制滚动内容的整体的top
  let startIndex = 0;
  const selector = MovingSelector({
    offset: p.offset,
    // 直接控制内容的top, 控制滚动.
    topSetter: {
      setTop(container, scrollTop, isWheeling) {
        let newMovingTop = -scrollTop;
        let ele = selector.getEle();
        let lastOne = ele[ele.length - 1];

        MovingTop = newMovingTop;

        // 查看开始和结束的ele的位置是否合理.
        lensor(
          [
            ele[startIndex].offsetTop + newMovingTop,
            ele[startIndex].offsetTop +
              ele[startIndex].offsetHeight +
              newMovingTop,
          ],
          direc => {
            if (direc > 0) {
              MovingTop = newMovingTop - direc;
            }
          }
        );

        lastOne &&
          lensor(
            [
              lastOne.offsetTop + newMovingTop,
              lastOne.offsetTop + lastOne.offsetHeight + newMovingTop,
            ],
            direc => {
              if (direc < 0) {
                MovingTop = newMovingTop - direc;
              }
            }
          );

        // 设置top
        $(container).css({
          top: MovingTop,
        });

        //
        lensorForEle(ele, isWheeling);
      },
      getTop(ele) {
        return -MovingTop;
      },
    },
  });
  const lensor = Lensor(p.lensWindow);
  p.scrollOffset = Math.abs(p.scrollOffset);

  // 计算每一个ele 的聚焦状态
  function lensorForEle(ele: HTMLElement[], isWheeling?: boolean) {
    ele.forEach((one, i) => {
      let scaler = lensor([
        one.offsetTop + MovingTop,
        one.offsetTop + one.offsetHeight + MovingTop,
      ]);

      let scaleSize = scaler(1.3);
      if (scaleSize >= 0.5 * 0.3 + 1) {
        // onSelect
        isWheeling && diffSelect(i);
      }
      p.fps(one, scaler);
    });
  }

  let lastI = -1;
  function diffSelect(i: number) {
    if (i !== lastI) {
      lastI = i;
      p.onSelect(i);
    }
  }

  let autoSelect = false; // 控制auto
  let debounceAutoSelect = _.debounce((key: number) => {
    autoSelect && selector.selectKey(key);
  }, 300);

  // let wheelingCheckTime = 0;
  // function checkWheeling(start: Boolean) {
  //     wheelingCheckTime = Date.now() - wheelingCheckTime;
  //     if (wheelingCheckTime > 30) {
  //       return false;
  //     } else{
  //       return true
  //     }
  // }
  const rus = {
    ...selector,
    // 数据组件是夸业务的
    // 重写selector 的select 为autoSelect; TODO: 使用Neuron的思想构建selector.
    selectKey: (key: number) => {
      autoSelect && debounceAutoSelect(key);
    },
    quickSelectKey(key: number) {
      autoSelect = false;
      selector.selectKey(key, () => {
        autoSelect = true;
      });
    },
    stopAutoSelect() {
      autoSelect = false;
    },
    startAutoSelect(key: number) {
      autoSelect = true;
      rus.selectKey(key);
    },
    onWheeling: (ev: WheelEvent<HTMLDivElement>) => {
      if (Math.abs(ev.deltaY) > 1) {
        rus.setWheelDeltaY((ev.deltaY / 100) * 36);
      }
      ev.preventDefault();
    },
    setStartIndex(start: number) {
      startIndex = start;
    },
  };
  return rus;
}
