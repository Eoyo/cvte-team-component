export type eventHandler<ELE, K extends keyof HTMLElementEventMap> = (
  this: ELE,
  ev: HTMLElementEventMap[K]
) => any;

// EventBinder 的类型重载
export function EventBinder<
  ELE extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(
  ele: ELE,
  eventType: K,
  bindType: "once"
): (func: eventHandler<ELE, K>) => void;
export function EventBinder<
  ELE extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(ele: ELE, eventType: K): (func: eventHandler<ELE, K>) => (() => void);
export function EventBinder<
  ELE extends HTMLElement,
  K extends keyof HTMLElementEventMap
>(ele: ELE, eventType: K, bindType?: "once") {
  let lastFunc: any;

  return (func: eventHandler<ELE, K>) => {
    if (bindType === "once") {
      lastFunc && ele.removeEventListener(eventType, lastFunc);
      lastFunc = func;
      return;
    } else {
      ele.addEventListener(eventType, func);
      return () => {
        ele.removeEventListener(eventType, func);
      };
    }
  };
}
