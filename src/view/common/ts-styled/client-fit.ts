/**
 * 兼容mac 或者 window的特定样式
 */

import { css } from "styled-components";
import { system } from "../../../services/native/";

export const macLeftNavTop = (() => {
  return css`
    ${system.osx ? "padding-top: 50px;" : ""};
  `;
})();
