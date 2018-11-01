/**
 * 漏掉的click, 当点击了不在ele[]中的元素时触发leakClick;
 */
import { eleContain } from "./DomTool";

export function LeakClick() {
  const closure = {
    leakClick: () => {},
    ele: [] as HTMLElement[],
    bindClick: (ev: any) => {
      if (!eleContain(closure.ele, ev.target)) {
        closure.leakClick();
      }
    },
  };

  const octopus = {
    setLeakClick(func: () => any) {
      closure.leakClick = func;
      return octopus;
    },

    //高阶触手函数, 设置可以点击的区域
    setEle(n: number) {
      return (ele: HTMLElement | null) => {
        if (ele) {
          closure.ele[n] = ele;
        }
        return octopus;
      };
    },
    clearListener() {
      window.removeEventListener("click", closure.bindClick);
      return octopus;
    },
    setListener() {
      window.addEventListener("click", closure.bindClick);
      return octopus;
    },
    listenWhile(tValue: boolean) {
      tValue ? octopus.setListener() : octopus.clearListener();
      return octopus;
    },
  };

  octopus.setListener();
  return octopus;
}
