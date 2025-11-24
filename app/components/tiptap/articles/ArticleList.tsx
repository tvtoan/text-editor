'use client';

import { useState } from 'react';
import { Button, Card, Tag, Avatar, Popconfirm, message } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { useArticles } from '@/app/hooks/tiptap/useArticles';
import { useArticleStore } from '@/app/store/tiptap/useArticleStore';
import ArticleModal from './ArticleModal';
import { Article } from '@/app/types/tiptap/article';
import { useDeleteArticle } from '@/app/hooks/tiptap/useArticles';

export default function ArticleList() {
  const { data: articles, isLoading } = useArticles();
  const { setSelectedArticleId } = useArticleStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const deleteMutation = useDeleteArticle();

  const handleEdit = (article: Article) => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        messageApi.success('Xóa bài viết thành công!');
      },
      onError: (error: any) => {
        messageApi.error(error?.message || 'Xóa bài viết thất bại, vui lòng thử lại!');
      },
    });
  };

  if (isLoading) {
    return (
      <div style={{ padding: 50, textAlign: 'center', fontSize: 18 }}>Đang tải bài viết...</div>
    );
  }

  return (
    <PageContainer title="Quản lý Bài viết (Tiptap)">
      {contextHolder}

      <div
        style={{
          marginBottom: 20,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0 }}>Danh sách bài viết</h2>
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo bài viết mới
        </Button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: 20,
        }}
      >
        {articles?.map((article) => (
          <Card
            key={article.id}
            hoverable
            title={<span style={{ fontSize: 18, fontWeight: 600 }}>{article.title}</span>}
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => setSelectedArticleId(article.id)}
                >
                  Xem
                </Button>
                <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(article)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa bài viết này?"
                  onConfirm={() => handleDelete(article.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                >
                  <Button size="small" danger icon={<DeleteOutlined />}>
                    Xóa
                  </Button>
                </Popconfirm>
              </div>
            }
          >
            <div style={{ display: 'flex', gap: 20 }}>
              {/* CỘT TRÁI: Thông tin */}
              <div style={{ flex: 1, minWidth: 140 }}>
                <p style={{ margin: '8px 0' }}>
                  <strong>Tác giả:</strong> <Avatar size="small" style={{ marginRight: 6 }} />
                  {article.author}
                </p>
                <Tag
                  color={article.status === 'published' ? 'success' : 'warning'}
                  style={{ marginBottom: 8 }}
                >
                  {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </Tag>
                <p style={{ color: '#888', fontSize: 13 }}>
                  {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                </p>
              </div>

              {/* CỘT PHẢI: Preview nội dung */}
              <div
                style={{
                  flex: 2,
                  minHeight: 220,
                  maxHeight: 280,
                  overflow: 'hidden',
                  borderLeft: '1px solid #f0f0f0',
                  paddingLeft: 16,
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: '#333',
                }}
                dangerouslySetInnerHTML={{
                  __html: article.content,
                }}
              />
            </div>
          </Card>
        ))}
      </div>

      <ArticleModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        article={editingArticle}
      />
    </PageContainer>
  );
}
