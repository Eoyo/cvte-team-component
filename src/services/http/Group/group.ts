import { Api } from "../region";
type teamId = {
  teamId: string;
};
type OneMember = {
  _id: string;
  displayName: string;
  mobile: string | number;
  avatar: string;
  createTime: number | string;
  isMailConfig: boolean;
};
type members = {
  _id: string;
  from: number;
  team: number;
  user?: OneMember[];
  inviteMobile?: string;
  createTime: number | string;
};
export type TeamRes = {
  _id: string;
  name: string;
  master: string;
  creatorId: string;
  members: members;
  createTime: number | string;
};
// pbhr
// pbr
export const group = {
  create: Api<{}, { name: string }, {}, TeamRes>("/api/teams").post,
  getTeamMessage: Api<teamId, {}, {}, TeamRes>("/api/teams/{teamId}").get,
  patchTeam: Api<teamId, {}, {}, {}>("/api/teams/{teamId}").patch,
  inviteMembers: Api<
    teamId,
    {
      mobiles?: string[];
      userId?: string[];
      email?: string[];
    },
    {},
    any
  >("/api/teams/{teamId}/members").post,
  joinTeam: Api<{ teamId: string }, {}, {}, TeamRes>(
    "/api/teams/{teamId}/members/actions/join"
  ).post,
  exitTeam: Api<teamId & { userId: string }, {}, {}, {}>(
    "/api/teams/{teamId}/members/{userId}"
  ).del,
};
