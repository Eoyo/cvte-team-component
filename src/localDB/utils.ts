import { orm } from "./models";
import { dbStateSelector, store } from ".";
import { createSelector } from "redux-orm";

export const getTheBodyData = (originData: any) => {
  return originData.Body.data;
};

export const commonSelector = (callback: Function) => {
  const allState = store.getState();
  return callback(orm.session(allState));
  //   return createSelector(orm, dbStateSelector, session => {
  //     callback(session);
  //   })(allState);
};

export const findItemByCustomIndex = (model: any, id: string, key = "_id") => {
  const _target = model._findDatabaseRows({
    [key]: id,
  });
  if (_target) {
    return _target[0];
  } else {
    return null;
  }
};
