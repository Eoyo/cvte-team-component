/**
 * 滑动的变大器
 *
 * @input
 * 开始缩放的区间, 传入对象区间,
 *
 * @output
 * 缩放的系数, 0 ~ 1; => 缩放比例;
 */

// 默认的缩放比例为2, 放大两倍.
export function Lensor(winArr: [number, number]) {
  // if (winArr[1] < winArr[0]) {
  //   return false;
  // }
  let winSize = Math.abs(winArr[1] - winArr[0]);

  return function analyzer(
    aimArr: [number, number],
    getDirection?: (direc: number) => void
  ) {
    // if (aimArr[1] < aimArr[0]) {
    //   return false;
    // }

    let aimSize = Math.abs(aimArr[1] - aimArr[0]);

    let aimCenter = (aimArr[0] + aimArr[1]) / 2;
    let winCenter = (winArr[0] + winArr[1]) / 2;

    let diff = Math.abs(winCenter - aimCenter);

    getDirection && getDirection(aimCenter - winCenter);

    // 计算diff比例
    let i = 1 - diff / (aimSize + winSize);

    if (i < 0) {
      i = 0;
    } else if (i > 1) {
      i = 1;
    }

    // 返回缩放比例
    return (size: number) => 1 + (size - 1) * i;
  };
}
