export namespace SioTypes {
  export type person = {
    id: string;
    name: string;
    avatar: string;
    personalMessage: {
      email: string;
      phone: string;
    };
  };
  export type stateTypes = {
    personList: person[];
    name: string;
  };
}
