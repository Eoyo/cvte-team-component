import {
  Action,
  applyMiddleware,
  createStore,
} from "redux";
import logger from "redux-logger";
import { Various } from "./various";
type mergeObj<T> = {
  [P in keyof T]?: Partial<T[P]>
};
function Merge<T extends object>(
  srcObj: T,
  obj: mergeObj<T>
): T {
  if (typeof srcObj === "object") {
    // @ts-ignore; extends object can't use {...}??
    const newSrc = { ...srcObj };
    for (const x in obj) {
      if (typeof obj[x] === "object") {
        newSrc[x] = Object.assign(
          {},
          newSrc[x],
          obj[x]
        );
      } else {
        newSrc[x] = obj[x] as any;
      }
    }
    return newSrc;
  } else {
    return srcObj;
  }
}
// Store Utils,
// tslint:disable-next-line:no-namespace
export namespace redux {
  /**
   * 包装Redux的createStore, 统一中间件, 设置默认值
   */
  export function create<S, A extends Action>(
    obj: S,
    re: (s: S, a: A) => S
  ) {
    return createStore<S, A, {}, {}>(
      (s: S = obj, a: A) => {
        return re(s, a);
      },
      applyMiddleware(logger)
    );
  }

  interface Unsubscribe {
    (): void;
  }

  export const AcSpore = <A, S>(obj: {
    actions: A;
    reducers: {
      [x in keyof A]: (
        s: S,
        d: A[x] & { type: x }
      ) => S
    };
  }) => {
    return obj;
  };

  export function AcSs<S>() {
    return function Actions<A>(actions: A) {
      return function Reducers(
        reducers: {
          [x in keyof A]: (
            s: S,
            d: A[x] & { type: x }
          ) => S
        }
      ) {
        return {
          reducers,
          actions,
        };
      };
    };
  }
  /**
   * 用于生成触发器
   */
  export const Ac = <
    StateInit extends object,
    ActionInit extends { [x: string]: object }
  >(
    state: StateInit,
    actions: ActionInit,
    reducers: {
      [x in keyof ActionInit]: (
        s: StateInit,
        d: { type: x } & ActionInit[x]
      ) => StateInit
    } & { always?: (s: StateInit) => StateInit }
  ) => {
    type ActorReserve = {
      getStore(): typeof store;
      merge(obj: mergeObj<StateInit>): void;
      grab: {
        <T>(graber: (obj: StateInit) => T): T;
        (): StateInit;
      };
      update(): void; //强制更新
      subscribe(
        follower: (obj: StateInit) => void
      ): Unsubscribe;
    };
    type Actor = {
      [x in keyof ActionInit]: (
        pro: Partial<ActionInit[x]>
      ) => void
    } &
      ActorReserve;
    // 创建store;
    const CreateStore = () => {
      // 返回时被always函数包装;
      if (typeof reducers.always === "function") {
        return redux.create(state, (s, d) => {
          if (d.type === "redux-actor-merge") {
            const newState = Merge<StateInit>(
              s,
              // @ts-ignore; 用于merge的action
              d.mergeState
            );
            // @ts-ignore; merge函数创建了newState;
            return reducers.always(newState);
          } else if (
            d.type === "redux-actor-update"
          ) {
            // @ts-ignore; always 肯定有;
            return reducers.always(
              Various(s)(s => s)
            );
          }
          if (
            typeof reducers[d.type] === "function"
          ) {
            // 在reduce 的过程中使用默认值.
            // always 的reducer为兜底的reducer;
            // @ts-ignore
            return reducers.always(
              reducers[d.type](s, Object.assign(
                {},
                actions[d.type],
                d
              ) as any)
            );
          } else {
            // @ts-ignore;
            return reducers.always(s);
          }
        });
      } else {
        // 没有always的reducer;
        return redux.create(state, (s, d) => {
          if (d.type === "redux-actor-merge") {
            return Merge<StateInit>(
              s,
              // @ts-ignore; 用于merge的action
              d.mergeState
            );
          } else if (
            d.type === "redux-actor-update"
          ) {
            return Various(s)(s => s);
          } // else {}
          if (
            typeof reducers[d.type] === "function"
          ) {
            return reducers[d.type](
              s,
              Object.assign(
                {},
                actions[d.type],
                d
              ) as any
            );
          } else {
            return s;
          }
        });
      }
    };

    // 定义为any, rus 指用于返回的对象;
    const rus = {
      getStore() {
        return store;
      },
      merge(obj: mergeObj<StateInit>) {
        store.dispatch({
          type: "redux-actor-merge",
          // @ts-ignore
          mergeState: obj,
        });
      },
      grab(graber?: (obj: StateInit) => void) {
        if (graber) {
          return graber(store.getState());
        } else {
          return store.getState();
        }
      },
      update() {
        store.dispatch({
          type: "redux-actor-update",
        });
      },
      subscribe(
        follower: (obj: StateInit) => void
      ) {
        return store.subscribe(() => {
          const state = store.getState();
          follower(state);
        });
      },
    } as ActorReserve;

    // 闭包store;
    const store = CreateStore();

    // 构造action函数;
    Object.getOwnPropertyNames(actions).map(d => {
      rus[d] = (pro: any) => {
        store.dispatch({
          type: d,
          ...pro,
        });
      };
    });

    return rus as Actor;
  };
}

// @example, 触发器(使用S.Ac构建的action函数集合)
/*

// counter 是一个触发器; 他提供一系列的action函数触发内部的store的状态更新;
const counter = S.counter;

// decrease具有参数step;
counter.decrease({
    step: 4
});

//Partical类型允许我们只填满 **部分的参数** , 这时使用默认的参数值
counter.decrease({});

// 空参数传入空的object;
counter.increase({});

// 获取到redux 中的store对象;
const store = counter.getStore();

*/
