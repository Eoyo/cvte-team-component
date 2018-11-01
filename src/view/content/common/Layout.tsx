import styled, { css } from "styled-components";
import * as React from "react";
import { ContentSwitcher } from "../../../utils/types/ContentSwitcher";
import { size } from "../../common/ts-styled/style-tool";
import { S_MeetingBlockCard } from "../Meeting/content/common/Layout/MeetingBlockCard";
import { Header } from "./Layout/HeaderWrapper";

export const Sider = styled("div")`
  --styled: "Sider";
  float: left;
  width: 241px;
  height: 100%;
  border-right: 1px solid #e9e9e9;
`;

export const Layout_SC = styled("div")`
  --styled: "Layout_SC";
  width: 100%;
  height: calc(100% - 45px);
`;

export const Content = styled("div")`
  --styled: "Content";
  float: left;
  background-color: #f9f9f9;
  width: calc(100% - 241px);
  height: 100%;
`;

export type Layout_HSC1Props = ContentSwitcher<
  "Sider" | "Header" | "Content"
> & {
  footer?: any;
};
const propsClassName = (p: {
  white?: boolean;
  paddingInTopAndBottom?: boolean;
}) => {
  return css`
    ${p.white ? "background: #fff;" : ""} ${p.paddingInTopAndBottom
      ? `padding-top: 10px;padding-bottom: 10px;`
      : ""};
  `;
};

export const PageContentBox = styled("div").attrs({
  className: "page-content",
})`
  --styled: "PageContent-Box";
  ${size("100%")};
  background-color: #f5f5f5;
  position: relative;
  padding: 0px 10px;
  ${propsClassName};
`;

export const PageContent = styled("div")`
  --styled: "PageContent";
  padding: 10px 0px;
  ${S_MeetingBlockCard} {
    margin: auto;
    margin-bottom: 10px;
    :last-child {
      margin-bottom: 30px;
    }
  }
`;

// sfc
export const Layout_HSC1: React.SFC<Layout_HSC1Props> = p => {
  return (
    <div style={{ width: "100%", height: "100%", background: "white" }}>
      <Header>{p.Header}</Header>
      <Layout_SC>
        <Sider>{p.Sider}</Sider>
        <Content>{p.Content}</Content>
      </Layout_SC>
      <div
        style={{
          width: 0,
          height: 0,
        }}
      >
        {p.footer}
      </div>
    </div>
  );
};
