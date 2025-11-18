import { Article } from '@/app/types/slateJs/article';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Giới thiệu về Slate.js Editor',
    content: JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: 'Chào mừng đến với Slate Editor - Trình soạn thảo văn bản hiện đại!' }],
      },
    ]),
    author: 'Nguyễn Văn A',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Hướng dẫn React Query',
    content: JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: 'React Query giúp quản lý server state hiệu quả.' }],
      },
    ]),
    author: 'Trần Thị B',
    status: 'draft',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    title: 'Zustand State Management',
    content: JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: 'Zustand là thư viện quản lý state đơn giản và mạnh mẽ.' }],
      },
    ]),
    author: 'Lê Văn C',
    status: 'published',
    createdAt: '2024-01-17',
  },
];
