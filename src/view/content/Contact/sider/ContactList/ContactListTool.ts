import { contactListTypes } from "./ContactListTypes";

const tool = {
  insertContact(
    s: contactListTypes.state,
    d: contactListTypes.contactInfo
  ) {
    let result = this._findId(s, d.id);
    //如果没找到，就插入，找到了就更新
    if (result.flag === false) {
      s.contacts.push(d);
    } else {
      s.contacts[result.index] = d;
    }
    return tool;
  },

  insertTeam(
    s: contactListTypes.state,
    d: contactListTypes.teamInfo
  ) {
    let result = this._findId(s, d.id);
    //如果没找到，就插入，找到了就更新
    if (result.flag === false) {
      s.teams.push(d);
    } else {
      s.teams[result.index] = d;
    }
    return tool;
  },

  removeContact(
    s: contactListTypes.state,
    id: string
  ) {
    let result = this._findId(s, id);
    if (result.flag === false) {
      return tool;
    } else {
      let pos = result.index;
      s.contacts.splice(pos, 1);
      return tool;
    }
  },

  removeTeam(
    s: contactListTypes.state,
    id: string
  ) {
    let result = this._findId(s, id);
    if (result.flag === false) {
      return tool;
    } else {
      let pos = result.index;
      s.teams.splice(pos, 1);
      return tool;
    }
  },

  //查找用户对应的id是否存在，如果存在，返回存在于哪个list
  //以及位置
  _findId(s: contactListTypes.state, id: string) {
    let result = {
      flag: false,
      index: 0,
      type: "",
    };
    s.contacts.forEach((perContact, index) => {
      if (perContact.id === id) {
        result.flag = true;
        result.index = index;
        result.type = "contact";
        return result;
      }
      return result;
    });
    s.teams.forEach((perContact, index) => {
      if (perContact.id === id) {
        result.flag = true;
        result.index = index;
        result.type = "team";
        return result;
      }
      return result;
    });
    return result;
  },
};

export { tool as ContactListTool };
