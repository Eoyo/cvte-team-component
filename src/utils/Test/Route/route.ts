/**
 * 当访问特定的路由时, 才开始执行用户的特定代码.
 */

const RanFuncSet = new Set();

export const once = (
  route: string,
  func: () => any
) => {
  window.addEventListener(
    "hashchange",
    function hashEventhandler() {
      if (
        window.location.hash ===
        "#/tes/" + route
      ) {
        if (!RanFuncSet.has(func)) {
          const rus = func();
          let log =
            "(@test) " +
            name +
            " process exit whith result of:";
          RanFuncSet.add(func);
          console.log(log, rus);
        } else {
          window.removeEventListener(
            "hashchange",
            hashEventhandler
          );
        }
      }
    }
  );
};
