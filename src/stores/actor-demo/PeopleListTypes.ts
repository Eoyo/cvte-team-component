export type StatePeopleList = {
  groups: OneGroup[]
  people: {
    memberList: MemberListCodezi;
    data: Person[];
  };
  members: {
    data: Person[];
  };
}
export type MemberListCodezi = {
  memberId: string[];
  memberName?: string[];
}
export type Person = {
  id: string
  name: string;
}

export type OneGroup = {
  id: string;
  memberList: MemberListCodezi;
  data: Person[];
}

export  const PeopleListInit: StatePeopleList = {
  groups: [
    {
      id: '',
      memberList: {
        memberId: [],
      },data: []
    }
  ],
  people: {
    memberList: {
      memberId: [],
      memberName: [],
    },
    data: []
  },
  members: {
    data: [
      {
        id: '1234',
        name: 'liumiao'
      },
      {
        id: '4321',
        name: 'wode',
      }
    ]
  }
};
