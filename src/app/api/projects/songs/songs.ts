type Song = {
    id: string;
    artist: string;
    title: string;
    cover: string;
    src: string;
};

export const songs: Song[] = [
    {
        id: '1',
        artist: 'soundbay',
        title: 'In Slow Motion',
        cover: 'https://cdn.pixabay.com/audio/2024/06/25/10-06-34-296_200x200.jpg',
        src: '/projects/mp3player/songs/audio_7bfb8d2ab0.mp3',
    },
    {
        id: '2',
        artist: 'moodmode',
        title: 'Groovy Ambient Funk',
        cover: 'https://cdn.pixabay.com/audio/2024/04/12/08-26-11-87_200x200.jpg',
        src: '/projects/mp3player/songs/audio_3118cb3f2a.mp3',
    },
    {
        id: '3',
        artist: 'SoulProdMusic',
        title: 'Smoke',
        cover: 'https://cdn.pixabay.com/audio/2023/03/19/12-27-22-207_200x200.jpg',
        src: '/projects/mp3player/songs/audio_9311bc02e5.mp3',
    },
    {
        id: '4',
        artist: 'Onoychenkomusic',
        title: 'Awaken',
        cover: 'https://cdn.pixabay.com/audio/2023/01/31/09-58-23-591_200x200.jpg',
        src: '/projects/mp3player/songs/audio_e649bbdf58.mp3',
    },
];
