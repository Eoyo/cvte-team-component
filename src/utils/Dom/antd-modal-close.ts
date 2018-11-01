let triggerEles: any = {};
let antdModalClicks: any = {};
let evFuncs: any = {};
let showModals: any = {};

//每一个selector对应一个click处理事件
//对于在一个组件中的selector名字不能一样
export const closeMaskToCloseModal = (
  modalEleSelector: string,
  show: boolean,
  closeHandler: Function
) => {
  setTimeout(() => {
    // 关闭弹窗时间绑定
    if (triggerEles[modalEleSelector]) {
      //remove的listener必须和add的listener是同一个
      window.removeEventListener("click", evFuncs[modalEleSelector]);
      triggerEles[modalEleSelector] = null;
    }
    evFuncs[modalEleSelector] = (ev: any) => {
      let inside = false;
      let triggerEle = triggerEles[modalEleSelector];
      if (triggerEle) {
        inside =
          triggerEle.offsetLeft < ev.clientX &&
          triggerEle.offsetLeft + triggerEle.clientWidth > ev.clientX &&
          triggerEle.offsetTop < ev.clientY &&
          triggerEle.offsetTop + triggerEle.clientHeight > ev.clientY;
      }
      if (!inside && showModals[modalEleSelector]) {
        antdModalClicks[modalEleSelector]();
      }
    };
    showModals[modalEleSelector] = show;
    window.addEventListener("click", evFuncs[modalEleSelector]);
    triggerEles[modalEleSelector] =
      document.querySelector(modalEleSelector) || document.body;
    antdModalClicks[modalEleSelector] = closeHandler;
  });
};
