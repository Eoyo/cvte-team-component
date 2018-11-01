import styled, { css } from "styled-components";
import { co } from "./co";
import { StyledPropsEle } from "../types/StyledComponent";

/**
 * reset the defalut element style
 */
type ButtonProps = { type?: "primary"; disable?: boolean };
/*mainBtn默认就是primary */
const mainBtn = styled("button")`
  :active,
  :focus {
    outline: none;
    box-shadow: none;
  }
  border: 1px solid #b2b2b2;
  border-radius: 18px;
  animation: all 0.5s;
  line-height: 100%;
  width: 200px;
  height: 36px;
  padding: 0px;
  background: transparent;
  cursor: pointer;
  ${(p: ButtonProps) => {
    if (p.type === "primary" && p.disable === true) {
      return css`
        background: ${co.primary};
        color: white;
        border: 1px solid transparent;
        opacity: 0.4;
        cursor: no-drop;
      `;
    } else if (p.type === "primary") {
      return css`
        background: ${co.primary};
        color: white;
        border: 1px solid transparent;
        :hover {
          cursor: pointer;
          background: ${co.primaryBtnHover};
        }
        :active {
          cursor: pointer;
          background: ${co.primaryBtnPress};
        }
      `;
    } else {
      return css`
        background: transparent;
        :hover {
          cursor: pointer;
          color: ${co.darkerGrey};
          border: 1px solid ${co.grey};
        }
        :active {
          background-color: #f4f4f4;
          color: ${co.darkerGrey};
        }
      `;
    }
  }};
` as StyledPropsEle<ButtonProps, "button">;

const secondBtn = styled("button")`
  :active,
  :focus {
    outline: none;
    box-shadow: none;
  }
  border: 1px solid #b2b2b2;
  border-radius: 14px;
  animation: all 0.5s;
  line-height: 100%;
  width: 88px;
  height: 30px;
  padding: 0px;
  background: #ffffff;
  cursor: pointer;
  ${(p: ButtonProps) => {
    if (p.type === "primary" && p.disable === true) {
      return css`
        opacity: 0.4;
        cursor: no-drop;
      `;
    } else if (p.type === "primary") {
      return css`
        :hover {
          cursor: pointer;
          background: ${co.primaryBtnHover};
        }
        :active {
          cursor: pointer;
          background: ${co.primaryBtnPress};
        }
      `;
    } else {
      return css`
        background: transparent;
        :hover {
          cursor: pointer;
          color: ${co.darkerGrey};
          border: 1px solid ${co.grey};
        }
        :active {
          background-color: #f4f4f4;
          color: ${co.darkerGrey};
        }
      `;
    }
  }};
  ${(p: ButtonProps) => {
    if (p.type === "primary") {
      return css`
        background: ${co.primary};
        color: white;
        border: 1px solid transparent;
      `;
    } else {
      return;
    }
  }};
` as StyledPropsEle<ButtonProps, "button">;

const input = styled("input").attrs({
  autoComplete: "off",
  autoCapitalize: "off",
  autoCorrect: "off",
})`
  border: 1px solid #e9e9e9;
  height: 28px;
  min-width: 100px;
  outline: none;
  border-radius: 4px;
  padding: 6px 10px;
  :active,
  :focus {
    outline: none;
  }
`;
const ul = styled("ul")`
  padding: 0px;
  margin: 0px;
  list-style: none;
`;

export const H1 = styled("h1")`
  margin: 0px;
`;

export const Ele = {
  ul,
  input,
  secondBtn,
  mainBtn,
};
