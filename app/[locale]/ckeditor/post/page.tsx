'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useArticleStore } from '@/app/store/ckeditor/articleStore';
import { useArticlesQuery } from '@/app/hooks/ckeditor/useArticlesQuery';
import { ArticleTable } from '@/app/components/ckeditor/tables/ArticleTable';
import { ArticleEditorModal } from '@/app/components/ckeditor/modals/ArticleEditorModal';
import { PreviewModal } from '@/app/components/ckeditor/modals/PreviewModal';
import type { Article } from '@/app/types/ckeditor/article';

export default function ArticleManagementPage() {
  const { articles, setArticles, addArticle, updateArticle, deleteArticle } = useArticleStore();

  const { data, loading } = useArticlesQuery();

  const [editorVisible, setEditorVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  // Sync data từ API vào Zustand store
  useEffect(() => {
    if (data.length > 0) {
      setArticles(data);
    }
  }, [data, setArticles]);

  const handleCreate = () => {
    setCurrentArticle(null);
    setEditorVisible(true);
  };

  const handleEdit = (article: Article) => {
    setCurrentArticle(article);
    setEditorVisible(true);
  };

  const handlePreview = (article: Article) => {
    setCurrentArticle(article);
    setPreviewVisible(true);
  };

  const handleSave = (articleData: Partial<Article>) => {
    if (currentArticle) {
      updateArticle(currentArticle.id, articleData);
      messageApi.success('Cập nhật bài viết thành công!');
    } else {
      const newArticle: Article = {
        id: Date.now().toString(),
        title: articleData.title!,
        content: articleData.content!,
        author: articleData.author!,
        status: 'draft',
        createdAt: new Date().toISOString().split('T')[0],
      };
      addArticle(newArticle);
      messageApi.success('Tạo bài viết mới thành công!');
    }
    setEditorVisible(false);
  };

  const handleDelete = (id: string) => {
    deleteArticle(id);
    messageApi.success('Xóa bài viết thành công!');
  };

  return (
    <div style={{ padding: 24, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {contextHolder}
      <Card
        title={<div style={{ fontSize: 20, fontWeight: 600 }}>📚 Quản lý bài viết</div>}
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate} size="large">
            Tạo bài viết mới
          </Button>
        }
        loading={loading}
      >
        <ArticleTable
          articles={articles}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPreview={handlePreview}
        />
      </Card>

      <ArticleEditorModal
        visible={editorVisible}
        article={currentArticle}
        onClose={() => setEditorVisible(false)}
        onSave={handleSave}
      />

      <PreviewModal
        visible={previewVisible}
        article={currentArticle}
        onClose={() => setPreviewVisible(false)}
      />
    </div>
  );
}
