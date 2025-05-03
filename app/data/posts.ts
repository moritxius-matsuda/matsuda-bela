export interface Post {
  id: number;
  title: string;
  content: string;
  date: string;
}

export const posts: Post[] = [
  {
    id: 1,
    title: 'Erster Beitrag',
    content: 'Dies ist der erste Beitrag des Administrators.',
    date: '2025-05-03',
  },
  {
    id: 2,
    title: 'Zweiter Beitrag',
    content: 'Neuigkeiten zum Projektfortschritt.',
    date: '2025-05-02',
  },
];
