// @@test, for more arr data; 用于测试大量的数组数据
export function expandArr(arr: any[], num: number) {
  let rus: any[] = [];
  let one: any = {};
  if (arr.length <= 0) {
    return arr;
  }
  if (arr.length < num) {
    for (let i = 0; i < num; i += 1) {
      if (arr[i]) {
        one = arr[i];
      } else {
        one = JSON.parse(JSON.stringify(one));
        one.id = one.id ? one.id + 1 : 0;
      }
      rus.push(one);
    }
    return rus;
  } else {
    return arr;
  }
}
