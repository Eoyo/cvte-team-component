import * as moment from "moment";
// 特定的date
export const formDate = {
  normalDay(timestick: number) {
    return moment(timestick).format("YYYY-MM-D");
  },
  //数字转换为星期几,如1转换为一，7转换为七
  numberTransToWeek(num: number) {
    if (num === 1) {
      return "一";
    } else if (num === 2) {
      return "二";
    } else if (num === 3) {
      return "三";
    } else if (num === 4) {
      return "四";
    } else if (num === 5) {
      return "五";
    } else if (num === 6) {
      return "六";
    } else if (num === 7) {
      return "日";
    }
    return "";
  },
  normalDay2(timestick: number) {
    return moment(timestick).format("YYYY-M-D");
  },
  calendarDay(timestick: number) {
    let year = moment(timestick).format("YYYY");
    let nowYear = moment(new Date().getTime()).format("YYYY");
    let formatDate = "MM月DD";
    if (year !== nowYear) {
      formatDate = "YYYY年MM月DD";
    }
    return moment(timestick).calendar(undefined, {
      sameDay: "[今天]",
      nextDay: "[明天]",
      lastDay: "[昨天]",
      nextWeek: formatDate,
      lastWeek: formatDate,
      sameElse: formatDate
    });
  },
  hourMinute(timestick: number) {
    return moment(timestick).format("HH:mm");
  },
  remainTime(timestick: number) {
    const allMinute = (timestick / 60000) | 0;
    const data = {
      hour: ((allMinute / 60) | 0) % 24,
      minute: allMinute % 60,
      day: (allMinute / 60 / 24) | 0
    };
    let rus = "";
    if (data.day > 0) {
      rus += ` ${data.day} 天`;
      return rus;
    }
    if (data.hour > 0) {
      rus += ` ${data.hour} 小时`;
    }
    if (data.minute) {
      rus += ` ${data.minute} 分钟`;
    }
    rus = rus || "小于1分钟";
    return rus;
  },
  // 合并日期和时间
  getTimeStick(day: moment.Moment, time: moment.Moment) {
    return moment(
      day.format("YYYY-M-D") + "/" + time.format("HH:mm"),
      "YYYY-M-D/HH:mm"
    ).valueOf();
  },
  getTimeStr(start: number, end: number) {
    const day = moment(start).format("YYYY-MM-DD");
    const startTime = moment(start).format("HH:mm");
    const endTime = moment(end).format("HH:mm");
    return day + " " + startTime + "~" + endTime;
  }
};

export const timeOut = (time: number) => {
  return new Promise(res => {
    setTimeout(() => {
      res();
    }, time);
  });
};

export function time(number: number) {
  return new Promise(res => {
    setTimeout(res, number);
  });
}
