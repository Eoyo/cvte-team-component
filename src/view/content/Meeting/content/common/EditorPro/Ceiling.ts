import { Fix } from "./FixPlace";

/**
 * 设置某个dom相对某个dom 吸附顶端
 * 1. 控制吸附的时机.
 * 2. 控制结束吸附的时机. stopEle.
 * 3. 局部归约: 将滚动的数据归约成吸附元素或结束元素的位置状态.
 * 4. 数据采集:
 *    1. container, ceilingEle[], stopEle.
 *    2. scrollingTop,
 */

export const Ceilling = () => {
  const eyes = {
    container: null as HTMLElement | (() => HTMLElement) | null,
    ceillEle: [] as ELEValue[],
    fixEle: [] as ELEValue[],
    stopEle: null as ELEValue,
  };

  const octopus = {
    eyes,
    onScroll() {
      // 计算stop 元素是否到顶了.
      let stop = false;

      // @@!! bug, resize 导致了ceilEle 0size了;

      // @@!! 每次都要Reveal一下!!.
      const eyes = Reveal(octopus.eyes, HTMLElement);
      let stopOffset = { top: 0, left: 0 };

      if (eyes.stopEle && eyes.container) {
        stopOffset = getOffset(eyes.stopEle, eyes.container);
        if (stopOffset.top <= 0) {
          stop = true;
        }
      }

      eyes.ceillEle.forEach((ele, i) => {
        if (ele && eyes.container) {
          if (!stop) {
            const offset = getOffset(ele, eyes.container);
            if (offset.top <= 0) {
              $(ele).addClass("fixed");

              // 容器中需要被定位的元素
              const fixEle = eyes.fixEle[i];
              if (fixEle) {
                // @liumiao 实现置顶元素的挤出效果.
                // @liumiao 补充调试吸顶样式

                // 因为 fix 而遮住的高度.
                const fixHeight = fixEle.offsetHeight;
                let top;

                if (eyes.stopEle) {
                  if (stopOffset.top < fixEle.offsetHeight) {
                    stop;
                  }
                }

                Fix(fixEle).toEle(eyes.container, {
                  top: 0,
                });
              }
            } else {
              $(ele).removeClass("fixed");
            }
          } else {
            $(ele).removeClass("fixed");
          }
        }
      });
    },
  };

  const brain = {
    startListenScroll() {
      const container = octopus.eyes.container;

      if (container) {
        $(container).on("scroll", octopus.onScroll);
        $(window).on("resize", octopus.onScroll);
      }
    },
    endListendScroll() {
      const container = octopus.eyes.container;

      if (container) {
        $(container).unbind("scroll", octopus.onScroll);
        $(window).unbind("resize", octopus.onScroll);
      }
    },
  };
  const head = {
    ...brain,
    ...Growtentacle(eyes),
  };

  return head;
};

function getOffset(
  ele: HTMLElement,
  parentEle: HTMLElement
): {
  top: number;
  left: number;
} {
  const eleRect = ele.getBoundingClientRect();
  const parentRect = parentEle.getBoundingClientRect();
  return {
    top: eleRect.top - parentRect.top,
    left: eleRect.left - parentRect.left,
  };
}

type ELEValue = HTMLElement | null | (() => HTMLElement | null);

// 计算待计算的map
function Reveal<
  T extends { [x: string]: any },
  I extends new (...args: any[]) => any
>(c: T, ins: I) {
  type Result = InstanceType<I> | null;
  const rus: {
    [x in Extract<keyof T, string>]: T[x] extends any[] ? Result[] : Result
  } = {} as any;
  function setValueToRus(value: any, rus: any, x: string | number) {
    if (value instanceof ins) {
      rus[x] = value;
    } else {
      rus[x] = null as any;
    }
  }
  for (const x in c) {
    const onep = c[x];
    if (typeof onep === "function") {
      setValueToRus(onep(), rus, x);
    } else if (Array.isArray(onep)) {
      rus[x] = [] as any;
      onep.forEach((o, i) => {
        if (typeof o === "function") {
          setValueToRus(o(), rus[x], i);
        } else {
          setValueToRus(o, rus[x], i);
        }
      });
    } else {
      setValueToRus(onep, rus, x);
    }
  }
  return rus;
}

type TypeName<T> = T extends object
  ? object
  : T extends (...args: any[]) => any ? ReturnType<T> : never;

type T10 = Extract<string | (() => void), object>;

// 构建触手函数的通用方案.
function Growtentacle<
  Eyes extends {
    [x: string]: ELEValue | (ELEValue[]);
  }
>(
  eyes: Eyes
): {
  [x in keyof Eyes]: Eyes[x] extends ELEValue
    ? ((ele: ELEValue) => void)
    : (Eyes[x] extends ELEValue[]
        ? (index: number) => ((ele: ELEValue) => void)
        : any)
} {
  let rus = {} as any;
  for (const i in eyes) {
    if (!Array.isArray(eyes[i])) {
      rus[i] = (ele: ELEValue) => {
        ele && (eyes[i] = ele);
      };
    } else {
      rus[i] = (index: number) => {
        return (ele: ELEValue) => {
          const arr = eyes[i];
          if (Array.isArray(arr)) {
            ele && (arr[index] = ele);
          } // else {}
        };
      };
    }
  }
  return rus;
}

type getEle = (ele: ELEValue) => void;
type getEleArray = (index: number) => getEle;

type GetEleAt<keys extends string> = { [x in keys]: getEle };
type GetEleArrayAt<keys extends string> = { [x in keys]: getEleArray };

type EleBrain<E extends string> = Record<E, ELEValue>;
type EleArrayBrain<E extends string> = Record<E, ELEValue[]>;
type Brain<E extends string = "", AE extends string = ""> = EleBrain<E> &
  EleArrayBrain<AE>;
