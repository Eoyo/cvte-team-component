export function OnInit<Op>(p: Op) {
  let op = p;
  let FuncPool: any[] = [];

  return {
    trigger(p: Partial<Op>) {
      Object.assign(op, p);
      FuncPool.forEach(oneFunc => {
        oneFunc(op);
      });
    },
    on(func: (op: Op) => void) {
      FuncPool.push(func);
    },
  };
}
