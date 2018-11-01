// import pinyin from "pinyin/lib/index";

// function calculateUserName (username: string) {
//   pinyin(username, {

//   });
// }

// name is email.
export function getITAvatarUrl(email: string) {
  let username = email;
  let nameArr = email.split("@");

  if (nameArr.length > 0 && nameArr[1].indexOf("cvte") >= 0) {
    username = nameArr[0];
    return `https://itapis.cvte.com/eex-hcm-api-backend/api/v1/avatar?username=${decodeURIComponent(
      username
    )}`;
  } else {
    return "";
  }
}
