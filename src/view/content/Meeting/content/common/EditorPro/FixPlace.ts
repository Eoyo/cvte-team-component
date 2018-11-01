/**
 * 将某个dom元素fix到某个dom元素的位置.
 * dom 的性能问题在嵌套和重绘, 重绘在于布局计算.
 * 重绘的复杂度在O(n)即可显著提高
 */

type placeValue = number | "center";
type verticalValue = placeValue;
type horizontalValue = placeValue;
type fixValue =
  | {
      top?: verticalValue;
      bottom?: number;
      left?: horizontalValue;
      right?: number;
    }
  | number;

type positionValue = number | "auto";
type topLeft = {
  top: positionValue;
  left: positionValue;
};

/**
 * 返回相对于screen的px;
 */
function getFix(ele: HTMLElement): topLeft {
  const offset = ele.getBoundingClientRect();
  if (offset) {
    return offset;
  } else {
    return {
      top: 0,
      left: 0,
    };
  }
}

/**
 * 设置fix时的top left;
 */
function getPx(px: number | string) {
  return typeof px === "number" ? px + "px" : px;
}
function setFix(ele: HTMLElement, tf: topLeft): boolean {
  $(ele).css({
    top: getPx(tf.top),
    left: getPx(tf.left),
  });
  return true;
}

type PlaceTo = {
  (ele: HTMLElement): FixRus;
  (ele: HTMLElement, fix: fixValue): FixRus;
};
type FixRus = {
  toEle: PlaceTo;
  to(fix: fixValue): FixRus;
  setContainer(ele: HTMLElement | null): void;
};

// simple flyweight Fix;
// simple flyweight 函数Fix返回的是共享的对象.
export const Fix = (() => {
  function toEle(ele: HTMLElement): FixRus {
    if (c.ele) {
      rus.setContainer(ele);
      setFix(c.ele, getFix(ele));
    }
    return rus;
  }
  function toFix(fix: fixValue): FixRus {
    if (!c.eleContainer) {
      c.eleContainer = document.body;
    }

    if (c.ele && c.eleContainer) {
      const hcontainer = c.eleContainer.offsetHeight;
      const hceill = c.ele.offsetHeight;
      const wcontainer = c.eleContainer.offsetWidth;
      const wceill = c.ele.offsetWidth;
      const rect = c.eleContainer.getBoundingClientRect();

      if (typeof fix === "number") {
        setFix(c.ele, {
          top: fix,
          left: "auto",
        });
      } else {
        let top: positionValue, left: positionValue;

        // top, left 不设置初始值, 依赖ts检查是否覆盖完全.
        if (fix.top !== undefined) {
          if (fix.bottom === undefined) {
            // 使用top 定位
            if (typeof fix.top === "number") {
              top = fix.top;
            } else {
              switch (fix.top) {
                case "center":
                  /**
                   * vertical center position;
                   */
                  top = (hcontainer - hceill) / 2;
                  break;
                default:
                  top = "auto";
              }
            }
          } else {
            // 使用bottom 的定位.
            top = hcontainer - hceill - fix.bottom;
          }
        } else {
          top = "auto";
        }

        // 和top 处理采用一致的逻辑.
        if (fix.left !== undefined) {
          if (fix.right === undefined) {
            // 使用left 定位
            if (typeof fix.left === "number") {
              left = fix.left;
            } else {
              switch (fix.left) {
                case "center":
                  /**
                   * vertical center position;
                   */
                  left = (wcontainer - wceill) / 2;
                  break;
                default:
                  left = "auto";
              }
            }
          } else {
            // 使用 right 定位
            left = wcontainer - wceill - fix.right;
          }
        } else {
          left = "auto";
        }

        if (typeof top === "number") {
          top = rect.top + top;
        }

        if (typeof left === "number") {
          left = rect.left + left;
        }

        setFix(c.ele, {
          top,
          left,
        });
      }
    }
    return rus;
  }
  const rus: FixRus = {
    toEle(ele: any, fix?: fixValue) {
      // 实现PlaceTo的重载的逻辑
      if (ele instanceof HTMLElement) {
        if (fix) {
          rus.setContainer(ele);
          return toFix(fix);
        } else {
          return toEle(ele);
        }
      } else {
        console.error("toEle", ele, "?, excepted : HTMLElemet");
      }
      return rus;
    },
    to(fix) {
      return toFix(fix);
    },
    setContainer(ele) {
      c.eleContainer = ele;
      return rus;
    },
  };

  // closure;
  const c = {
    ele: null as HTMLElement | null,
    eleContainer: null as HTMLElement | null,
  };

  return function Fix(ele: HTMLElement, fix?: string) {
    c.ele = ele;
    c.eleContainer = null;
    return rus;
  };
})();
