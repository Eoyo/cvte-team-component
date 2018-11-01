import { SearchStatus } from "../../../AddGroup/Piece/Search/SearchPeopleTypes";

export class TeamSearchAddState {
  keyword: string = "";
  searchAble = false;
  searchStatus: SearchStatus = "none";
  popVisible = false;
  addLoading = false;
}
