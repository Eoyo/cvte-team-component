import Axios from "axios";

/**
 * 开异步读取FileList对象中的文件
 */

export function ReadFile(files: FileList) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = function() {
      console.log(reader);
    };
    reader.onloadstart = function() {};
    reader.onloadend = function() {};
    reader.onabort = function() {};
    reader.onerror = function(er) {};
    reader.readAsDataURL(files[0]);
    const img = new Image();
    // img.src = URL.createObjectURL(files[0]);
  });
}
