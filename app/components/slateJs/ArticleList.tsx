import React from 'react';
import { Card, Button, Tag, Popconfirm, Space, Avatar } from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Article } from '@/app/types/slateJs/article';

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  isDeleting?: boolean;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCreate,
  isDeleting = false,
}) => {
  if (isLoading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontSize: 18 }}>Đang tải bài viết...</div>
    );
  }
  console.log('data list', articles);

  return (
    <div style={{ padding: '24px', background: '#f9f9f9', minHeight: '100vh' }}>
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto 32px auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600 }}>Quản lý Bài viết (Slate.js)</h1>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={onCreate}>
          Tạo bài viết mới
        </Button>
      </div>

      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: 24,
        }}
      >
        {articles.map((article) => (
          <Card
            key={article.id}
            hoverable
            title={<span style={{ fontSize: 20, fontWeight: 600 }}>{article.title}</span>}
            extra={
              <Space>
                <Button size="small" icon={<EyeOutlined />} onClick={() => onView(article)}>
                  Xem
                </Button>
                <Button
                  size="small"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => onEdit(article)}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa bài viết này?"
                  description="Hành động này không thể hoàn tác."
                  onConfirm={() => onDelete(article.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button size="small" danger icon={<DeleteOutlined />} loading={isDeleting}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            }
            style={{ height: '100%' }}
          >
            <div style={{ display: 'flex', gap: 24 }}>
              {/* Cột trái: Thông tin */}
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>Tác giả:</strong>{' '}
                  <Space>
                    <Avatar size="small" icon={<UserOutlined />} />
                    <span>{article.author}</span>
                  </Space>
                </div>

                <Tag
                  color={article.status === 'published' ? 'green' : 'orange'}
                  style={{ marginBottom: 8 }}
                >
                  {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </Tag>

                <div style={{ color: '#888', fontSize: 13 }}>
                  Ngày: {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>

              <div
                style={{
                  flex: 2,
                  minHeight: 240,
                  maxHeight: 300,
                  overflow: 'hidden',
                  borderLeft: '1px solid #f0f0f0',
                  paddingLeft: 20,
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  color: '#333',
                }}
                className="article-preview-content"
                dangerouslySetInnerHTML={{
                  __html: article.content || '<em>Chưa có nội dung</em>',
                }}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
