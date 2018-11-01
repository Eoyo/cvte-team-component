import { U } from "../../../../../../utils";
import { refElement } from "../../../../../../pivot/Meeting/Actor/CommonTypes";

type dragEvents = "dragover" | "dragenter" | "dragleave" | "drop";
type eventListener = (eventType: string, ev: any) => {};
const dragger = (() => {
  const closure = {
    eventListener: ((evType, ev) => {
      console.log(evType, ev);
    }) as eventListener,
    ele: null as refElement,
  };

  const setter = buildSetter(closure);
  const octopus = {
    ...setter,
  };

  //
  octopus.ele = ele => {
    if (ele !== closure.ele) {
      if (closure.ele) {
      }
    }
    setter.ele(ele);
  };

  return octopus;
})();

function buildSetter<T extends object>(obj: T) {
  const rus = {} as { [x in keyof T]: (args: T[x]) => void };

  U.getNames(obj).forEach(x => {
    rus[x] = oneArg => {
      obj[x] = oneArg;
    };
  });

  return rus;
}
