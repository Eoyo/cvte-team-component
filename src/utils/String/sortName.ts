//@ts-ignore
import pinyin from "pinyin/lib/index";

//获取名字的开头的第一个字母，汉字和英语会转换为小写字母，其他内容会转换为#
export function getFirstLetter(name: string | undefined): string {
  let firstLetter = "";
  let result = "#";
  if (name) {
    firstLetter = pinyin(name[0], {
      style: pinyin.STYLE_FIRST_LETTER,
    })[0][0];
    firstLetter = firstLetter.toLowerCase();
    if (firstLetter >= "a" && firstLetter <= "z") {
      result = firstLetter;
    } else {
      result = "#";
    }
  }

  return result;
}

let belongAToZ = (letter: string) => {
  if (letter && letter >= "a" && letter <= "z") {
    return true;
  } else {
    return false;
  }
};

export function compareName(
  name1: string | undefined,
  name2: string | undefined
) {
  let firstLetter1 = "",
    firstLetter2 = "";
  if (name1) {
    firstLetter1 = getFirstLetter(name1);
  }
  if (name2) {
    firstLetter2 = getFirstLetter(name2);
  }
  //如果两个都不属于a~z，那么两个name之间自己排个序
  //如果一个属于a~z，一个不属于a~z，那么就把不属于a~z的排到前面
  if (!belongAToZ(firstLetter1) && !belongAToZ(firstLetter2)) {
    return pinyin.compare(name1, name2);
  } else if (!belongAToZ(firstLetter1)) {
    return -1;
  } else if (!belongAToZ(firstLetter2)) {
    return 1;
  } else {
    return pinyin.compare(name1, name2);
  }
}
