export function table<T extends string>(
  dimensionality: T[],
  cells: { [x: string]: string }
) {
  const codeMap: { [x: string]: number } = {};
  const len = dimensionality.length;
  for (let i = 0; i < len; i += 1) {
    codeMap[dimensionality[i]] = i;
  }
  return (booleanObj: { [x in T]: boolean }) => {
    const defaultPosition = ZeroStringArray(len);

    // 映射出结论地址
    Object.getOwnPropertyNames(booleanObj).forEach(name => {
      defaultPosition[codeMap[name]] = booleanObj[name] ? "1" : "0";
    });

    return cells[defaultPosition.join("")] || "";
  };
}

export function ZeroStringArray(length: number) {
  const rus: string[] = [];
  while (length--) {
    rus.push("0");
  }
  return rus;
}

export function And<T, A = {}, B = {}>(a: A[], b: B[]) {
  return (judege: (code: number[]) => T) => {
    const code = [0, 0];
    return (x: A, y: B): T => {
      let xi = a.indexOf(x);
      let yi = b.indexOf(y);
      if (xi < 0 || yi < 0) {
        code[0] = code[1] = -1;
      } else {
        code[0] = xi;
        code[1] = yi;
      }
      return judege(code);
    };
  };
}
