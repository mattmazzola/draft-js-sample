export interface IMention {
    id: string
    name: string
    link: string
    avatar?: string
}

const mentions: IMention[] = [
    {
        id: "a",
        name: 'Matthew Russell',
        link: 'https://twitter.com/mrussell247',
    },
    {
        id: "b",
        name: 'Julian Krispel-Samsel',
        link: 'https://twitter.com/juliandoesstuff',
    },
    {
        id: "c",
        name: 'Jyoti Puri',
        link: 'https://twitter.com/jyopur',
        avatar: 'https://avatars0.githubusercontent.com/u/2182307?v=3&s=400',
    },
    {
        id: "d",
        name: 'Max Stoiber',
        link: 'https://twitter.com/mxstbr',
        avatar: 'https://pbs.twimg.com/profile_images/763033229993574400/6frGyDyA_400x400.jpg',
    },
    {
        id: "e",
        name: 'Nik Graf',
        link: 'https://twitter.com/nikgraf',
        avatar: 'https://avatars0.githubusercontent.com/u/223045?v=3&s=400',
    },
    {
        id: "f",
        name: 'Pascal Brandt',
        link: 'https://twitter.com/psbrandt',
        avatar: 'https://pbs.twimg.com/profile_images/688487813025640448/E6O6I011_400x400.png',
    },
];

export default mentions