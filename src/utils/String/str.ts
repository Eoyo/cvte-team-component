export function arrCss(arr: (string | undefined | false | null | number)[]) {
  return arr
    .filter(d => {
      if (d) {
        return true;
      } else {
        return false;
      }
    })
    .join(" ");
}

export function getHTMlContent(htmlStr: string) {
  return StrictRemoveTag(htmlStr);
}

/**
 * 严格的过滤掉标签.
 * 将<> 内的东西全部过滤掉
 * 得到的纯文本使用innerText插入.
 */

function StrictRemoveTag(str: string = "") {
  const len = str.length;
  let isTag = false;
  let txt = "";
  for (let i = 0; i < len; i += 1) {
    if (isTag) {
      if (str[i] === ">") {
        isTag = false;
      }
    } else {
      if (str[i] === "<") {
        isTag = true;
      } else {
        txt += str[i];
      }
    }
  }
  return txt;
}
