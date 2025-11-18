'use client';

import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Tag, message, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useArticles } from '@/app/hooks/sunEditor/useArticles';
import { ArticleForm } from '@/app/components/sunEditor/ArticleForm';
import { ArticleDetailModal } from '@/app/components/sunEditor/ArticleDetailModal';
import { Article, CreateArticle, UpdateArticle } from '@/app/types/sunEditor/article';

export default function ArticlesPage() {
  const { articles, isLoading, create, update, remove } = useArticles();

  const [openForm, setOpenForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async (values: CreateArticle) => {
    try {
      if (editingArticle) {
        const dto: UpdateArticle = { id: editingArticle.id, data: values };
        await update(dto);
        messageApi.success('Cập nhật bài viết thành công!');
      } else {
        await create(values);
        messageApi.success('Tạo bài viết thành công!');
      }
      setOpenForm(false);
      setEditingArticle(null);
    } catch (error) {
      console.error(error);
      messageApi.error('Có lỗi xảy ra, vui lòng thử lại!');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      messageApi.success('Đã xóa bài viết!');
    } catch (error) {
      console.error(error);
      messageApi.error('Xóa bài viết thất bại!');
    }
  };

  return (
    <PageContainer title="Quản lý Bài viết" loading={isLoading}>
      {contextHolder}

      <Button
        type="primary"
        icon={<PlusOutlined />}
        style={{ marginBottom: 16 }}
        onClick={() => {
          setEditingArticle(null);
          setOpenForm(true);
        }}
      >
        Thêm bài viết
      </Button>

      {/* Grid container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: 16,
        }}
      >
        {articles.map((article) => (
          <Card
            key={article.id}
            title={article.title}
            hoverable
            extra={
              <div style={{ display: 'flex', gap: 8 }}>
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => {
                    setSelectedArticle(article);
                    setDetailOpen(true);
                  }}
                >
                  Xem
                </Button>
                <Button
                  size="small"
                  icon={<EditOutlined />}
                  onClick={() => {
                    setEditingArticle(article);
                    setOpenForm(true);
                  }}
                >
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa bài viết?"
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
            <div style={{ display: 'flex', gap: 16 }}>
              {/* Left: Thông tin */}
              <div style={{ flex: 1 }}>
                <p>
                  <strong>Tác giả:</strong> {article.author}
                </p>
                <p>
                  <Tag color={article.status === 'published' ? 'success' : 'warning'}>
                    {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </Tag>
                </p>
                <p style={{ color: '#888' }}>Ngày: {article.createdAt}</p>
              </div>

              {/* Right: Content */}
              <div
                style={{
                  flex: 2,
                  maxHeight: 250,
                  minHeight: 200,
                  overflow: 'hidden',
                  borderLeft: '1px solid #f0f0f0',
                  paddingLeft: 8,
                }}
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Modal Tạo/Sửa bài viết */}
      <ArticleForm
        open={openForm}
        onCancel={() => {
          setOpenForm(false);
          setEditingArticle(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editingArticle || undefined}
      />

      {/* Modal Xem chi tiết bài viết */}
      <ArticleDetailModal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        article={selectedArticle}
      />
    </PageContainer>
  );
}
