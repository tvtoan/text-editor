'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Space, Button, message, Select } from 'antd';
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

  const [messageApi, contextHolder] = message.useMessage();

  // Reset form khi mở/đóng modal hoặc đổi bài
  useEffect(() => {
    if (!open) {
      setTitle('');
      setContent('');
      setAuthor('');
      setStatus('draft');
      return;
    }

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
  }, [open, article]);

  const handleSave = (): void => {
    if (!title.trim()) {
      messageApi.error('Vui lòng nhập tiêu đề!');
      return;
    }
    if (!author.trim()) {
      messageApi.error('Vui lòng nhập tác giả!');
      return;
    }

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      status,
    };

    if (article) {
      updateMutation.mutate(
        { id: article.id, data: articleData },
        {
          onSuccess: () => {
            messageApi.success('Cập nhật bài viết thành công!');
            console.log('update data', articleData);
            onCancel();
          },
          onError: () => {
            messageApi.error('Cập nhật thất bại!');
          },
        }
      );
    } else {
      createMutation.mutate(articleData, {
        onSuccess: () => {
          messageApi.success('Tạo bài viết thành công!');
          console.log('create data:', articleData);
          onCancel();
        },
        onError: () => {
          messageApi.error('Tạo bài viết thất bại!');
        },
      });
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  // Key để force remount TiptapEditor khi đổi bài → cực kỳ quan trọng!
  const editorKey = article ? `edit-${article.id}` : 'new';

  return (
    <>
      {contextHolder}
      <Modal
        title={article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        open={open}
        onCancel={handleCancel}
        width={1100}
        footer={null}
        destroyOnHidden
        maskClosable={false}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <Input
            placeholder="Tiêu đề bài viết *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            size="large"
            allowClear
          />

          <Space>
            <Input
              placeholder="Tác giả *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: 300 }}
              allowClear
            />

            <Select
              value={status}
              onChange={(value) => setStatus(value as ArticleStatus)}
              style={{ width: 200 }}
              options={[
                { value: 'draft', label: 'Bản nháp' },
                { value: 'published', label: 'Đã xuất bản' },
              ]}
            />
          </Space>

          <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
            <TiptapEditor
              key={editorKey} // Force remount khi đổi bài
              content={content}
              onChange={setContent}
            />
          </div>

          <div style={{ textAlign: 'right', marginTop: 16 }}>
            <Button onClick={handleCancel} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button
              type="primary"
              onClick={handleSave}
              loading={createMutation.isPending || updateMutation.isPending}
              disabled={!title.trim() || !author.trim()}
            >
              {article ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Space>
      </Modal>
    </>
  );
}
