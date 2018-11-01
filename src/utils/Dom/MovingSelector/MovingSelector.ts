import { Bezier } from "../animate";
// 异步的数据难以管理, 使用状态管理器Actor 实现函数式
export function MovingSelector(p: {
  offset: number;
  topSetter?: {
    getTop(ele: HTMLElement): number;
    setTop(ele: HTMLElement, top: number, isWheeling?: boolean): any;
  };
}) {
  let ele: HTMLElement[] = [];
  let lastSelectKey = 0;
  let container: HTMLElement | null = null;
  let offset = p.offset;
  let bezier = new Bezier(0, 0, 500);
  let defaultTopgetter = {
    getTop(ele: HTMLElement) {
      return $(ele).scrollTop() || 0;
    },
    setTop(ele: HTMLElement, top: number, isWheeling?: boolean) {
      return $(ele)
        .scrollTop(top)
        .trigger("scroll");
    },
  };

  if (p.topSetter) {
    Object.assign(defaultTopgetter, p.topSetter);
  }

  const rus = {
    setContainer: (ele: HTMLElement | null) => {
      if (ele) {
        container = ele;
      }
    },
    getContainer() {
      return container;
    },
    getEle() {
      return ele;
    },
    setEle(key: number) {
      return (oneEle: HTMLElement | null) => {
        if (oneEle) {
          ele[key] = oneEle;
        }
        return this;
      };
    },
    gotoTop() {
      container &&
        $(container).css({
          scrollTop: 0,
        });
    },
    selectKey(key: number, onEnd?: () => void) {
      if (container && ele[key]) {
        lastSelectKey = key;
        bezier
          .update(
            ele[key].offsetTop - offset,
            defaultTopgetter.getTop(container)
          )
          .animate(currentTop => {
            if (container) {
              defaultTopgetter.setTop(container, currentTop);
            }
          }, onEnd);
      }
    },
    setWheelDeltaY(deltaY: number) {
      if (container) {
        defaultTopgetter.setTop(
          container,
          defaultTopgetter.getTop(container) + deltaY,
          true
        );
        // if (ele) {
        //   ele.forEach((onep, i) => {

        //   })
        // }
      }
    },
    selectNext(seed: number) {
      if (seed > 0) {
        lastSelectKey += 1;
      } else {
        lastSelectKey -= 1;
      }

      if (lastSelectKey < 0) {
        lastSelectKey = 0;
      } else if (lastSelectKey >= ele.length) {
        lastSelectKey = ele.length - 1;
      }
      rus.selectKey(lastSelectKey);
      return lastSelectKey;
    },
  };
  return rus;
}

/* 
Neuron 的继承问题?

const Neuron : any = {};

class MovingSelectorState  extends Neuron{
  ele: HTMLElement[] = [];
  selectKey: string | number;
  container: HTMLElement | null = null;
  offset: number = 0;

  setContainer(s, a ) { 
      return {container : a};
    }
  setKey(s, a) { 
      
      return {};
    }
}

const Neuron: any = {};
const app = Neuron(class {})({});

const a = class {
  bo = "bood";
};
const b: InstanceType<typeof a> = new a();

function ClassWrapper<
  T extends {
    new (...args: any[]): any;
  }
>(func: T): InstanceType<T> {
  return new func();
}

const aa = ClassWrapper(a);

class Actor extends class {} {}
/**
 * TODO: 
 */
