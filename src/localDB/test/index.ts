import { orm, AllORMState } from "../models";
import { createReducer, createSelector } from "redux-orm";
import {
  createStore,
  combineReducers,
  DeepPartial,
  applyMiddleware,
} from "redux";
import { TypeMulipleAction } from "../../services/pushmessage/pushMessageType";
import { call, put } from "redux-saga/effects";
import createSagaMiddleware from "redux-saga";
// 持久化尝试
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { nativeLogMessage } from "../../services/native";
import { Teams } from "../models/teams";
import { teams as TeamsAction } from "../actions";

import { getTeamsInfo } from "../models/teams";
const persistConfig = {
  key: "root",
  storage,
};

const sagaMiddleware = createSagaMiddleware();
// 将整个models 对象生成reducer 和 隐藏的state
const ormReducer = createReducer(orm);
// 持久化尝试
const persistedReducer = persistReducer(persistConfig, ormReducer);

// 生成 和 export 整个store
export const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware)
);
// 持久化储存，存在localstorage
persistStore(store);
// 临时选择器demo
export const dbStateSelector = (state: any) => state.db;

// 订阅变化
store.subscribe(() => {
  const data = store.getState();
  console.log(data, "store.subscribe");
});

const test = function*() {
  yield store.dispatch({
    type: TeamsAction.CREATE_TEAM,
    payload: {
      RoutingKey: "teams.team_members.delete",
      Headers: {
        domain: "meeting",
        system: "teams",
        topic: "teams.update",
        description: "团队信息修改",
      },
      Properties: {
        messageId: "uuid",
        timestamp: "1511097155000",
        contentType: "application/json",
        contentEncoding: "msgpack",
      },
      Body: {
        updateTime: 1511097155000,
        uri: "teams/:teamId",
        resource: "teams",
        action: 2,
        data: {
          createTime: Date.now(),
          name: "123",
          masterId: "1234-5678",
          teamMembers: [],
          _id: "5b768264128dab001586c8c8",
        },
      },
    },
  });
  yield getTeamsInfo("5b768264128dab001586c8c8");
  return "end";
};
// @ts-ignore
window.testModel = test();
