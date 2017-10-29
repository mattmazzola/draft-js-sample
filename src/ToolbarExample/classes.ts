export interface IWordType {
  id: string
  name: string
  multivalue: boolean
}

const wordTypes: IWordType[] = [
  {
    id: "0",
    name: 'noun',
    multivalue: true
  },
  {
    id: "1",
    name: 'verb',
    multivalue: false
  },
  {
    id: "2",
    name: 'adjective',
    multivalue: false
  },
  {
    id: "3",
    name: 'punctuation',
    multivalue: true
  }
];

export default wordTypes