# redux-actor

## 1. 结构说明

### /utils :

1.  工具函数放这里
2.  Fusion: 用 TS 包装了一下 connect, 规范使用 connect.
3.  Redux: 用 TS 包装了一下 Redux, 使用 redux.Ac 创建 actor, actor 放在./actor 目录下.

### /actor :

1.  在这里编写一个独立的 actor, 包装了对 store 的直接使用;
2.  编写完成后在 ./export.ts 文件编写导出;
3.  在 export.ts 编写导出后, TS 会提示是否和其他的模块有命名冲突.

## 2. 设计思路

### redux.Ac(stateInit, actionsInit, reducers);  redux.Ac()返回的值称为 actor,

### Actor, 相当于 redux.Ac 的高阶函数版本. Actor(stateInit)(actionsInit)(reducers);

1.  redux.Ac 接受三个参数;

    1.  stateInit 为 redux 中创建 store 时的原始值.
    2.  actoinsInit 会为设计的 action 函数提供默认值
    3.  reducers, 用于规约的小函数的集合.
        ```typescript
        // 代码 1.0
        const actor = redux.Ac(
          {},
          // actionsInit
          {
            getName: {
              id: "1234",
              name: "lium"
            }
          }
          // reducers
          {
            getName(s, d) { // @ReduceGetName
              return {...s};
            }
          }
        );
        ```

2.  actoinsInit:

    1.  定义了接收怎样的 actions

        ```typescript
          /* actionsInit */
         {
            getName: {
              id: "1234",
              name: "刘淼"
            }
          }
        ```

        相当于 **允许** 一个如下的形式的 action:

        ```typescript
        /* 类比使用redux的store的情形 */
        const action = {
          type: "getName",
          id: "4321",
          name: "徐涛",
        };
        store.dispatch(action);
        ```

    2.  actionsInit 的  中 getName 定义了 action 的 type,

    3.  actionsInit 的 getName 后紧接了一个 object 值,  这个值提供两个作用:
        1.  让 TS 推断出类型, 让 TS 知道了 action 传了 type: 'getName'后, 剩下的应该是那些类型的值;
        2.  用于 actor 的 getName 函数的默认值, (4.actor 讲解)

3.  reducers:

    1.  getName 是一个归约小函数, 函数名'getName' 会用于 Redux 的 action 的 type 的匹配.
    2.  redux.Ac 在 reducers 中定义了特殊的 reducer 接口 -- always,

        ```typescript
          /* reducers */
          {
            getName(s, d) {
              return {...s};
            },
            awalys(s) {
              return s;
            }
          }
        ```

        1.  always 定义的 reducer 总是执行, 用于检查和数据保持一致.
        2.  其他 reducer 执行完了归约返回一个新的状态, 这个状态会  直接传给 always reducer 处理一遍, 再把新状态返回, 整个归约过程才完成.

4.  actor, Redux.Ac 返回的对象
    1.  actor 的属性全是函数, 这些函数的名字会和 actionsInit 中的保持一致;
        ```typescript
        actor.getName({
          id: "4321",
          name: "徐涛",
        });
        /* actor.getName(...) 相当于在内部执行如下的操作 */
        /* store为actor内部的store */
        store.dispatch({
          type: "getName",
          id: "4321",
          name: "徐涛",
        });
        ```
    2.  actionsInit 的值会在  归约  的过程中用到. 如果 actor 的 函数只传了一部分值, 剩下的部分会在归约的时候用 actionsInit 的值补全. (如何归约可以看源码...). 总之可以`actor.getName({id: '4321'})`; 归约时`name的值为'刘淼'`

5)  TypeScript 约束

    1.  actionsInit 和 reducers 的键名是一一对应的, 例如代码 1.0 中`actionsInit的getName`和`reducers的getName对应`
    2.  reducer 必须把 state 返回;

# fusion, react-redux 的 connect 包装;

例子:[fusion-demo.tsx](../components/demo/fusion-demo.tsx);
