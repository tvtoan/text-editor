'use client';

import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, Card, Tag, message, Popconfirm, Space, Typography } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { ArticleEditorModal } from '@/app/components/slateJs/ArticleEditModal';
import { ArticleViewModal } from '@/app/components/slateJs/ArticleViewModal';
import { useArticles } from '@/app/hooks/slateJs/useArticles';
import { Article } from '@/app/types/slateJs/article';

const { Text } = Typography;

// Format ngày giờ
const formatVN = (dateStr: string) => {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Chưa xác định';
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(
    d.getHours()
  )}:${pad(d.getMinutes())}`;
};

export default function ArticlesPage() {
  const { articles, isLoading, create, update, remove, isCreating, isUpdating } = useArticles();

  const [messageApi, contextHolder] = message.useMessage();
  const [editorVisible, setEditorVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Helper lấy ảnh đầu tiên
  const getFirstImage = (content: string) => {
    try {
      const nodes = JSON.parse(content);
      const find = (arr: any[]): string | null => {
        for (const n of arr) {
          if (n.type === 'image' && n.url) return n.url;
          if (n.children) {
            const found = find(n.children);
            if (found) return found;
          }
        }
        return null;
      };
      return find(nodes);
    } catch {
      return null;
    }
  };

  // Helper lấy nội dung preview
  const getExcerpt = (content: string) => {
    try {
      let text = '';
      const walk = (nodes: any[]) => {
        for (const node of nodes) {
          if (node.text) text += node.text + ' ';
          if (text.length > 200) return;
          if (node.children) walk(node.children);
        }
      };
      walk(JSON.parse(content));
      return text.trim() || 'Không có nội dung xem trước';
    } catch {
      return 'Không có nội dung xem trước';
    }
  };

  const openEditor = (article?: Article) => {
    setCurrentArticle(article || null);
    setIsEditing(!!article);
    setEditorVisible(true);
  };

  const openView = (article: Article) => {
    setCurrentArticle(article);
    setViewVisible(true);
  };

  const handleSave = (data: any) => {
    if (isEditing && currentArticle) {
      update({ id: currentArticle.id, data });
    } else {
      create(data);
    }
    setEditorVisible(false);
    setCurrentArticle(null);
    setIsEditing(false);
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      messageApi.success('Xóa thành công!');
    } catch {
      messageApi.error('Xóa thất bại!');
    }
  };

  return (
    <PageContainer
      title="Quản lý Bài viết"
      loading={isLoading}
      extra={
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={() => openEditor()}>
          Thêm bài viết
        </Button>
      }
    >
      {contextHolder}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(480px, 1fr))',
          gap: 16,
          marginTop: 8,
        }}
      >
        {articles.map((article) => {
          const thumb = getFirstImage(article.content);
          const excerpt = getExcerpt(article.content);
          const time = article.updatedAt
            ? formatVN(article.updatedAt)
            : formatVN(article.createdAt);

          return (
            <Card
              key={article.id}
              hoverable
              title={
                <Space align="center">
                  <span style={{ fontSize: 18, fontWeight: 600 }}>
                    {article.title || '(Không tiêu đề)'}
                  </span>
                  <Tag color={article.status === 'published' ? 'success' : 'warning'}>
                    {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                  </Tag>
                </Space>
              }
              extra={
                <Space>
                  <Button size="small" icon={<EyeOutlined />} onClick={() => openView(article)}>
                    Xem
                  </Button>
                  <Button size="small" icon={<EditOutlined />} onClick={() => openEditor(article)}>
                    Sửa
                  </Button>
                  <Popconfirm
                    title="Xóa bài này?"
                    onConfirm={() => handleDelete(article.id)}
                    okText="Xóa"
                    cancelText="Hủy"
                  >
                    <Button size="small" danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              }
            >
              <div style={{ display: 'flex', gap: 16, minHeight: 180 }}>
                {/* Ảnh bên trái */}
                <div
                  style={{
                    width: 180,
                    height: 180,
                    flexShrink: 0,
                    borderRadius: 8,
                    overflow: 'hidden',
                    background: '#fafafa',
                  }}
                >
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#aaa',
                      }}
                    >
                      Không có ảnh
                    </div>
                  )}
                </div>

                {/* Nội dung bên phải */}
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <Text strong>Tác giả:</Text> {article.author}
                    <br />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {time}
                    </Text>
                  </div>
                  <div
                    style={{
                      marginTop: 12,
                      color: '#595959',
                      lineHeight: 1.6,
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {excerpt}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <ArticleViewModal
        visible={viewVisible}
        article={currentArticle}
        onClose={() => {
          setViewVisible(false);
          setCurrentArticle(null);
        }}
      />
      <ArticleEditorModal
        visible={editorVisible}
        article={isEditing ? currentArticle : undefined}
        onSave={handleSave}
        onCancel={() => {
          setEditorVisible(false);
          setCurrentArticle(null);
          setIsEditing(false);
        }}
        isSaving={isCreating || isUpdating}
      />
    </PageContainer>
  );
}
