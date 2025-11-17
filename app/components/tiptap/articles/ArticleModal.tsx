'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Space, Button, message } from 'antd';
import TiptapEditor from '../editor/TiptapEditor';
import { useCreateArticle, useUpdateArticle } from '@/app/hooks/tiptap/useArticles';
import { Article, ArticleStatus } from '@/app/types/tiptap/article';

interface ArticleModalProps {
  open: boolean;
  onCancel: () => void;
  article: Article | null;
}

export default function ArticleModal({ open, onCancel, article }: ArticleModalProps) {
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [status, setStatus] = useState<ArticleStatus>('draft');

  const createMutation = useCreateArticle();
  const updateMutation = useUpdateArticle();

  // Khi article thay đổi, set lại state
  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setAuthor(article.author);
      setStatus(article.status);
    } else {
      setTitle('');
      setContent('');
      setAuthor('');
      setStatus('draft');
    }
  }, [article]);

  const handleSave = (): void => {
    if (!title.trim()) {
      message.error('Vui lòng nhập tiêu đề!');
      return;
    }

    const articleData = { title, content, author, status };

    if (article) {
      updateMutation.mutate(
        { id: article.id, data: articleData },
        {
          onSuccess: () => {
            message.success('Cập nhật bài viết thành công!');
            onCancel();
          },
        }
      );
    } else {
      createMutation.mutate(articleData, {
        onSuccess: () => {
          message.success('Tạo bài viết thành công!');
          onCancel();
        },
      });
    }
  };

  return (
    <Modal
      title={article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      open={open}
      onCancel={onCancel}
      width={1000}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="save"
          type="primary"
          onClick={handleSave}
          loading={createMutation.isPending || updateMutation.isPending}
        >
          Lưu
        </Button>,
      ]}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Input
          placeholder="Tiêu đề bài viết"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          size="large"
        />

        <Input placeholder="Tác giả" value={author} onChange={(e) => setAuthor(e.target.value)} />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as ArticleStatus)}
          style={{
            padding: '8px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            width: '200px',
          }}
        >
          <option value="draft">Nháp</option>
          <option value="published">Đã xuất bản</option>
        </select>

        <TiptapEditor
          key={article ? article.id : 'new'} // remount editor khi đổi bài
          content={content}
          onChange={setContent}
        />
      </Space>
    </Modal>
  );
}
