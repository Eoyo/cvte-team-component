/**
 * 控制详情的内容切换.
 */
import {
  ContentSwitcherBuilder,
  ContentSwitcherProps,
  ContentSwitcherArgs,
} from "./ContentSwitcher";
import { cardStatus } from "../../../../../pivot/Meeting/Actor/MeetingTypes";
export type DetailCardSwitcherProps = ContentSwitcherProps<cardStatus>;
export type DetailCardSwitcherArgs = ContentSwitcherArgs<cardStatus>;
export const DetailCardSwitcher = ContentSwitcherBuilder<cardStatus>();

type role = "editor" | "shower";

export type RoleSwitcherProps = ContentSwitcherProps<role>;
export type RoleSwitcherArgs = ContentSwitcherArgs<role>;
export const RoleSwitcher = ContentSwitcherBuilder<role>();
