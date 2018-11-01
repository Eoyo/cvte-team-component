import { timeValue, Tick } from "./Tick";

function getOffset(offset: number) {
  return (num: number) => {
    if (num % offset) {
      return num - (num % offset) + offset;
    } else {
      return num;
    }
  };
}

export function getTimeArray(offset: number, key?: keyof typeof timeValue) {
  let diff = offset;
  if (key) {
    diff = offset * timeValue[key];
  }

  const getFromTime = getOffset(diff);

  return (fromTime: number, toTime: number) => {
    let arr: string[] = [];
    for (let i = getFromTime(fromTime); i <= toTime; i += diff) {
      arr.push(Tick(i).getHour(2) + " : " + Tick(i).getMinute(2));
    }
    return arr;
  };
}
