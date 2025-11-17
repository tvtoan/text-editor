export const MOCK_ARTICLES = [
  {
    id: '1',
    title: 'Bài viết đầu tiên',
    content: '<p>Nội dung bài viết đầu tiên với <strong>CKEditor 5</strong></p>',
    author: 'Nguyễn Văn A',
    status: 'published' as const,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    title: 'Hướng dẫn sử dụng Next.js',
    content: '<p>Next.js là framework <em>React</em> mạnh mẽ...</p>',
    author: 'Trần Thị B',
    status: 'draft' as const,
    createdAt: '2024-01-16',
  },
  {
    id: '3',
    title: 'Zustand State Management',
    content: '<p>Zustand là thư viện quản lý state <strong>đơn giản</strong> và hiệu quả</p>',
    author: 'Lê Văn C',
    status: 'published' as const,
    createdAt: '2024-01-17',
  },
];
