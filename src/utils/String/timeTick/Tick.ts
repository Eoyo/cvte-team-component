import moment from "moment";

let time = 0;

export const timeValue = {
  minute: 60000,
  hour: 3600000,
  day: 3600000 * 24,
};

function minSize(size: number) {
  return (num: number) => {
    let hStr = num + "";
    let len = hStr.length;
    while (len < size) {
      hStr = "0" + hStr;
      len += 1;
    }
    return hStr;
  };
}

function getHour(size = 0) {
  //1000 * 60 * 60
  return minSize(size)((time / timeValue.hour) | 0);
}
function getMinute(size = 0) {
  return minSize(size)(((time % timeValue.hour) / timeValue.minute) | 0);
}

const TickOperate = {
  getHour,
  getMinute,
};
export function Tick(newTime: number) {
  time = newTime;
  return TickOperate;
}
