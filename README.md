# teams 项目中的公共组件

公共组件使用 typescript 和 React 编写, 目前还没文档

1. TimePicker3, 选择天, 开始时间和结束时间

ts 类型:

```typescript
export declare function TimePicker3Render(
  ele: HTMLElement
): (p: ScheduleTimePickProps) => (p: Partial<ScheduleTimePickProps>) => void;
```

使用用例:

```typescript
let ele = document.getElementById("root");
// 引入默认的TimePicker样式
TimePicker3Style();

if (ele) {
  // TimePicker3Render 在初始化后返回了一个更新函数
  // 更新函数赋给了tpicker3, 使用tpicker3可以控制组件的渲染.
  let tpicker3 = TimePicker3Render(ele)({
    action: "setDefault",
    dateValue: {
      date: moment(Date.now()),
      startTime: moment(Date.now()),
      endTime: moment(Date.now())
    },
    onChange(data) {
      // 使用tpicker3更新组件.
      tpicker3({
        action: "setValue",
        dateValue: data
      });
    }
  });
}
```

todo

<!-- [ ] 修改选择颜色 -->
<!-- [ ] 处理 niceScroll 模块化 -->
