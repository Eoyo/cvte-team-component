/**
 * <<约定>>  某一个事件用于
 */

import { EventBinder, eventHandler } from "./EventBinder";
// 没有函数式解决不了的
// 构建局部的数据, 返回对局部数据操作的函数, 通过接收函数参数的方式来操作内部的数据.
// 多返回需要定义组织形式. neuron是大型的函数式组织形式

export function EventTypeBinder<K extends keyof HTMLElementEventMap>(
  eventType: K
) {
  // 私有的变量
  let pLastEle: any;
  let pLastBinder: any;
  let pLastRemoveEvent: any;

  return <ELE extends HTMLElement>(ele: ELE, func: eventHandler<ELE, K>) => {
    function init() {
      pLastEle = ele;
      pLastBinder = EventBinder(ele, eventType);
      pLastRemoveEvent = pLastBinder(func);
    }

    if (pLastEle) {
      if (pLastEle === ele) {
        // 更新绑定的函数.
        pLastRemoveEvent();
        pLastBinder(func);
      } else {
        // 清楚对ele 的事件绑定, 新建一个绑定
        pLastRemoveEvent();
        init();
      }
    } else {
      init();
    }
  };
}
