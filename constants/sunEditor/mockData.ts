// src/app/mockData/articles.ts
import { Article } from '@/app/types/sunEditor/article';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: 'Giới thiệu SunEditor trong React',
    content:
      '<h2>SunEditor - Rich Text Editor nhẹ & mạnh mẽ</h2><p>Bạn có thể <strong>định dạng</strong>, <span style="color:#e11d48">tô màu</span>, chèn ảnh, video YouTube...</p>',
    author: 'Nguyễn Văn A',
    status: 'published',
    createdAt: '2025-01-15',
    updatedAt: '2025-01-16',
  },
  {
    id: '2',
    title: 'React Query + Zustand Best Practices',
    content: '<p>Đây là bài viết đang ở trạng thái <strong>nháp</strong>. Chưa hoàn thiện.</p>',
    author: 'Trần Thị B',
    status: 'draft',
    createdAt: '2025-01-18',
  },
  {
    id: '3',
    title: 'Cách nhúng video YouTube đẹp trong SunEditor',
    content:
      '<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe><p>Video demo nhúng YouTube</p>',
    author: 'Lê Văn C',
    status: 'published',
    createdAt: '2025-01-17',
  },
];
