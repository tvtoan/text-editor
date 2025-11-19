import { useState } from 'react';
import { Button, List, Card, Tag } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
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
    <PageContainer>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Quản lý Bài viết</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          Tạo bài viết mới
        </Button>
      </div>

      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 1,
          xl: 2,
          xxl: 3,
        }}
        dataSource={articles}
        renderItem={(article) => (
          <List.Item>
            <Card
              styles={{ body: { padding: 16, minHeight: 200 } }}
              actions={[
                <EyeOutlined key="view" onClick={() => setSelectedArticleId(article.id)} />,
                <EditOutlined key="edit" onClick={() => handleEdit(article)} />,
              ]}
            >
              <div style={{ display: 'flex', gap: 16 }}>
                {/* Left side: title, author, status */}
                <div style={{ flex: 1, minWidth: 200 }}>
                  <h3 style={{ margin: '0 0 8px 0' }}>{article.title}</h3>
                  <Tag color={article.status === 'published' ? 'green' : 'orange'}>
                    {article.status === 'published' ? 'Đã xuất bản' : 'Nháp'}
                  </Tag>
                  <div style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
                    👤 {article.author} • 📅 {article.createdAt}
                  </div>
                </div>

                {/* Right side: content */}
                <div
                  style={{
                    flex: 2,
                    fontSize: 14,
                    color: '#595959',
                    overflow: 'hidden',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    lineHeight: 1.6,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .replace(/<[^>]*>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim(),
                  }}
                />
              </div>
            </Card>
          </List.Item>
        )}
      />

      <ArticleModal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        article={editingArticle}
      />
    </PageContainer>
  );
}
