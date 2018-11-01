import { Actor } from "../Actor/actor";
/**
 * 计数器例子
 */
const initState = {
  number: 0,
  show: false,
};
export type counter = typeof initState;
export const counter = Actor(initState)(
  /**
   * actions init, 例子中: increase相当于type: 'increase';,
   * increase后面的值为action函数参数的默认值
   */
  {
    decrease: {
      step: 1,
    },
    increase: {}, // 参数为空使用空的object
  }
)(
  // reducers,
  {
    increase(s, d) {
      return {
        ...s,
        number: s.number + 1,
      };
    },
    decrease(s, d) {
      setTimeout(() => {
        counter.increase({});
      }, 1000);
      return {
        ...s,
        number: s.number - d.step,
      };
    },
  }
);
