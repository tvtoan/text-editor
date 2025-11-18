'use client';

import React, { useState } from 'react';
import { ArticleList } from '@/app/components/slateJs/ArticleList';
import { ArticleViewModal } from '@/app/components/slateJs/ArticleViewModal';
import { ArticleEditorModal } from '@/app/components/slateJs/ArticleEditModal';
import { useArticles } from '@/app/hooks/slateJs/useArticles';
import { Article } from '@/app/types/slateJs/article';

export default function ArticlesPage() {
  const { articles, isLoading, create, update, remove, isCreating, isUpdating, isDeleting } =
    useArticles();

  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [editorModalVisible, setEditorModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleView = (article: Article) => {
    setSelectedArticle(article);
    setViewModalVisible(true);
  };

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsEditMode(true);
    setEditorModalVisible(true);
  };

  const handleCreate = () => {
    setSelectedArticle(null);
    setIsEditMode(false);
    setEditorModalVisible(true);
  };

  const handleDelete = (id: string) => {
    remove(id);
  };

  const handleSave = (data: {
    title: string;
    content: string;
    author: string;
    status: 'published' | 'draft';
  }) => {
    if (isEditMode && selectedArticle) {
      update({
        id: selectedArticle.id,
        data,
      });
    } else {
      create(data);
    }
    setEditorModalVisible(false);
    setSelectedArticle(null);
  };

  const handleCloseEditor = () => {
    setEditorModalVisible(false);
    setSelectedArticle(null);
  };

  const handleCloseView = () => {
    setViewModalVisible(false);
    setSelectedArticle(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <ArticleList
        articles={articles}
        isLoading={isLoading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        isDeleting={isDeleting}
      />

      <ArticleViewModal
        visible={viewModalVisible}
        article={selectedArticle}
        onClose={handleCloseView}
      />

      <ArticleEditorModal
        visible={editorModalVisible}
        article={selectedArticle}
        onSave={handleSave}
        onCancel={handleCloseEditor}
        isSaving={isCreating || isUpdating}
      />
    </div>
  );
}
