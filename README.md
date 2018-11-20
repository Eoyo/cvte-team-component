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
const ele = document.getElementById("root");
if (ele) {
  // TimePicker3Render 在初始化后返回了一个更新函数
  // 使用update可以控制组件的渲染.
  const update = TimePicker3Render(ele)({
    defaultValue: {
      day: moment(Date.now()),
      endTime: moment(Date.now()).add(13, "h"),
      startTime: moment(Date.now()).add(10, "h")
    },
    showClear: true,
    onChange(data) {
      update({
        defaultValue: data
      });
    },

    onClose() {
      // 点击`确定`或`取消`将会触发关闭的事件
      // tslint:disable-next-line:no-console
      console.log("to close");
    }
  });

  // 传参的使用用例
  let time = moment(moment(Date.now()).format("YYYY-MM-DD"), "YYYY-MM-DD");
  setInterval(() => {
    time = time.add(1, "d").add(15, "m");

    // !!! 每次传值, 不要穿引用!!!
    let data = {
      day: time.clone(),
      startTime: time.clone().add(15, "m"),
      endTime: time.clone().add(30, "m")
    };
    update({
      defaultValue: data
    });
  }, 1000);
}
```

todo

<!-- [ ] 修改选择颜色 -->
<!-- [ ] 处理 niceScroll 模块化 -->
