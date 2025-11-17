import { Article } from '@/app/types/ckeditor/article';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Giới thiệu về TipTap Editor',
    content:
      '<h2>Chào mừng đến với TipTap</h2><p>TipTap là một <strong>editor văn bản</strong> hiện đại và mạnh mẽ.</p><p style="color: #2563eb;">Bạn có thể thay đổi màu sắc văn bản!</p>',
    author: 'Nguyễn Văn A',
    status: 'published',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Hướng dẫn React Query',
    content:
      '<h2>React Query - Data Fetching</h2><p>React Query giúp quản lý <strong>server state</strong> hiệu quả.</p><ul><li>Caching tự động</li><li>Background updates</li></ul>',
    author: 'Trần Thị B',
    status: 'draft',
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    title: 'Zustand State Management',
    content:
      '<h2>Zustand - Simple State</h2><p>Zustand là thư viện <strong>đơn giản</strong> và <em>hiệu quả</em>.</p><p style="color: #16a34a;">Không cần Provider!</p>',
    author: 'Lê Văn C',
    status: 'published',
    createdAt: '2024-01-17',
  },
];
