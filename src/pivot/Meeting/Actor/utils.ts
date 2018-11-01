import { MeetingTypes } from "./MeetingTypes";

// meeting 的权限问题是由于
// 6个环境, (如下字符串的数组的每个位置为一个环境)
// 2个角色, (每个字符串表示两个角色在那个环境下的权限)
const config = {
  view: ["00", "01", "11", "11", "11", "11"],
  upload: ["10", "00", "11", "11", "11", "00"],
  delete: ["10", "00", "11", "11", "00", "00"],
  download: ["00", "00", "11", "11", "11", "11"],
};

// 映射权限的函数.
export function Authority<character, situation, T extends string>(
  character: character[],
  situation: situation[]
) {
  return function getConfig(config: { [x in T]: string[] }) {
    return (c: character, s: situation) => {
      const obj: { [x in T]: boolean } = {} as any;
      for (const x in config) {
        const i = character.indexOf(c);
        const j = situation.indexOf(s);

        if (j >= 0 && i >= 0) {
          obj[x] = config[x][j][i] === "1";
        } else {
          obj[x] = false;
        }
      }
      return obj;
    };
  };
}

export const getFileMenuCan = Authority<
  MeetingTypes.PersonRole,
  MeetingTypes.MeetingStatus | "summary",
  "view" | "upload" | "delete" | "download"
>(
  ["compere", "attendee"],
  ["schedule", "inviting", "waiting", "inMeeting", "justEnd", "summary"]
)(config);

export function getMeetingStatus(s: MeetingTypes.InitState) {
  let status: MeetingTypes.MeetingStatus | "summary" = s.meetingData.status;
  if (s.meetingPage.isSummarySend && status === "justEnd") {
    status = "summary";
  }
  return status;
}
