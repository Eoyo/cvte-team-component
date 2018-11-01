import propTypesMixin from "redux-orm-proptypes";

import {
  attr,
  createSelector as createSelectorORM,
  ORMCommonState,
  ORMId,
  QuerySet,
  TableState,
  SessionWithModels,
  Model,
  ORM,
  Session,
} from "redux-orm";

const baseModel: any = Model;
export { baseModel };
