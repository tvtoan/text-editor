import React, { useState } from 'react';
import { Button, List, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useArticles } from '@/app/hooks/tiptap/useArticles';
import { useArticleStore } from '@/app/store/tiptap/useArticleStore';
import ArticleModal from './ArticleModal';
import { Article } from '@/app/types/tiptap/article';

export default function ArticleList() {
  const { data: articles, isLoading } = useArticles();
  const { setSelectedArticleId } = useArticleStore();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  const handleEdit = (article: Article): void => {
    setEditingArticle(article);
    setIsModalOpen(true);
  };

  const handleCreate = (): void => {
    setEditingArticle(null);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <div style={{ padding: 24, textAlign: 'center' }}>Đang tải...</div>;
  }

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
          Tạo bài viết mới
        </Button>
      </div>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 3,
        }}
        dataSource={articles}
        renderItem={(article) => (
          <List.Item>
            <Card
              title={article.title}
              extra={
                <Tag color={article.status === 'published' ? 'green' : 'orange'}>
                  {article.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                </Tag>
              }
              actions={[
                <EyeOutlined key="view" onClick={() => setSelectedArticleId(article.id)} />,
                <EditOutlined key="edit" onClick={() => handleEdit(article)} />,
              ]}
            >
              <Card.Meta
                style={{ minHeight: 100 }}
                description={
                  <>
                    <div
                      style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 3, // Số dòng tối đa
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        lineHeight: '1.6',
                        fontSize: 14,
                        color: '#595959',
                        minHeight: 80,
                      }}
                      dangerouslySetInnerHTML={{
                        __html: article.content
                          .replace(/<[^>]*>/g, ' ')
                          .replace(/\s+/g, ' ')
                          .trim(),
                      }}
                    />
                    <div
                      style={{
                        marginTop: 12,
                        fontSize: '12px',
                        color: '#999',
                      }}
                    >
                      👤 {article.author} • 📅 {article.createdAt}
                    </div>
                  </>
                }
              />
            </Card>
          </List.Item>
        )}
      />

      <ArticleModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        article={editingArticle}
      />
    </div>
  );
}
