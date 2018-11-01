import styled from "styled-components";

export const RUl = styled("ul")`
  --styled: "RUl";
  width: 101px;
  padding: 6px 0px;
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e9e9e9;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.1);
  border-radius: 4px;
`;

export const RLi = styled("li")`
  --styled: "RLi";
  width: 100px;
  height: 21px;
  padding: 2px;
  line-height: 17px;
  text-align: center;
  margin: 2px 0px;
  cursor: pointer;
  float: left;
  :hover {
    background: #f2f2f2;
  }
`;
