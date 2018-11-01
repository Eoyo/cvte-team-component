// import {
//   attr,
//   createSelector as createSelectorORM,
//   ORMCommonState,
//   ORMId,
//   QuerySet,
//   TableState,
//   SessionWithModels,
//   Model,
//   ORM,
//   Session,
// } from "redux-orm";

// export interface Fields {
//   test: string;
// }
// export interface Additional {
//   isFetching: boolean;
// }
// export interface VirtualFields {}
// export type TestState = TableState<Fields & ORMId & Additional>;

// export interface TestORMState extends ORMCommonState {
//   Test: TestState;
// }

// export interface TestORMState extends ORMCommonState {
//   Test: TestState;
// }
// export class User extends Model<Fields, Additional, VirtualFields> {
//   static modelName = "User";

//   static fields = {
//     test: attr(),
//     isFetching: attr({
//       getDefault: () => false,
//     }),
//     id: attr(),
//     somevalue: attr(),
//   };

//   static reducer(
//     action: any,
//     model: any,
//     session: SessionWithModels<TestORMState>
//   ) {
//     switch (action.type) {
//       case "test":
//         console.log("test reducer action test");
//         model.create({ test: action.payload.test });
//         break;
//       default:
//         // this && this.create({ test: action.payload.test });

//         break;
//     }
//   }
// }
