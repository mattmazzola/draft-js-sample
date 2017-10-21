export interface IMention {
  id: string
  name: string
  link: string
  avatar?: string
}

const mentions: IMention[] = [
  {
    id: "mention-1400000000000",
    name: 'Matthew Russell',
    link: 'https://twitter.com/mrussell247',
  },
  {
    id: "mention-1400000000001",
    name: 'Julian Krispel-Samsel',
    link: 'https://twitter.com/juliandoesstuff',
  },
  {
    id: "mention-1400000000002",
    name: 'Jyoti Puri',
    link: 'https://twitter.com/jyopur',
    avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
  },
  {
    id: "mention-1400000000003",
    name: 'Max Stoiber',
    link: 'https://twitter.com/mxstbr',
    avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
  },
  {
    id: "mention-1400000000004",
    name: 'Nik Graf',
    link: 'https://twitter.com/nikgraf',
    avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
  },
  {
    id: "mention-1400000000005",
    name: 'Pascal Brandt',
    link: 'https://twitter.com/psbrandt',
    avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
  },
];

export default mentions