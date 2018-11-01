// 使用了octopus 的模式实现的
// import { Bezier } from "./animate";

// /**
//  * 通过控制滚动 让container中的ele显示在当前屏幕.
//  */
// export function MovingSelector() {
//   const closure = {
//     ele: [] as HTMLElement[],
//     container: null as HTMLElement | null,
//     offset: 0,
//   };

//   const bezier = new Bezier(0, 0, 300);
//   const octopus = {
//     //高阶触手函数,
//     setEle(key: number | string) {
//       return (ele: HTMLElement | null) => {
//         if (ele) {
//           closure.ele[key] = ele;
//         }
//         return octopus;
//       };
//     },
//     setContainer(ele: HTMLElement | null) {
//       if (ele) {
//         closure.container = ele;
//       }
//     },

//     selectKey(key: string) {
//       if (closure.container && closure.ele[key]) {
//         bezier
//           .update(
//             closure.ele[key].offsetTop + closure.offset,
//             $(closure.container).scrollTop()
//           )
//           .animate(currentTop => {
//             closure.container &&
//               $(closure.container)
//                 .scrollTop(currentTop)
//                 .trigger("scroll");
//           });
//       }
//     },
//     gotoTop() {
//       closure.container &&
//         $(closure.container).css({
//           scrollTop: 0,
//         });
//     },
//     setOffset(offset?: number | "center") {
//       if (typeof offset === "number") {
//         closure.offset = offset || 0;
//       } else {
//         //TODO: center 语义化的setOffset??
//       }
//     },
//   };
//   return octopus;
// }
