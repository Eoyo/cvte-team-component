export function getPostFix(str: string): string {
  const arr = str.split(".");
  if (arr.length > 0) {
    return arr.pop() || "";
  } else {
    return "";
  }
}

function createFileTypeMapper<
  T extends {
    [x: string]: string[];
  },
  Arr extends string
>(config: T, ...cArr: Arr[]) {
  return function getFileTypeFromName(fileName: string) {
    fileName = fileName.toLowerCase();
    const postFix = getPostFix(fileName);
    for (const x in config) {
      if (config[x].indexOf(postFix) >= 0) {
        return x;
      }
    }

    let i = cArr.indexOf(postFix as any);
    if (i >= 0) {
      return cArr[i];
    }
    return "unknown";
  };
}

export function UTF8(str: string) {
  return decodeURIComponent(encodeURIComponent(str));
}

export const getFileType = createFileTypeMapper(
  {
    pic: ["jpg", "jpeg", "png", "bmp", "gif", "svg", "ico"],
    txt: ["txt", "md", "rst", "ts"],
    word: ["doc", "docx"],
    excel: ["xls", "xlsx"],
    ppt: ["ppt", "pptx"],
  },
  "pdf",
  "zip",
  "rar"
);

const rusType = getFileType("");
export type FileMaybeType = typeof rusType;
