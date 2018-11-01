import { css } from "styled-components";

export const flex = {
  columnCenter: css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `,
  rowCenter: css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
  `,
  rowLeft: css`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    position: relative;
  `,
};

export const pos = {
  RowRight: css`
    position: absolute;
    display: inline-block;
    right: 0px;
    left: auto;
  `,
};
