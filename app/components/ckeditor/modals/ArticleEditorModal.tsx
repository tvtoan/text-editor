import { useState, useEffect } from 'react';
import { Modal, Button, message, Input } from 'antd';
import { CKEditorWrapper } from '../editor/CKEditorWrapper';
import type { Article } from '../../../types/ckeditor/article';

interface ArticleEditorModalProps {
  visible: boolean;
  article: Article | null;
  onClose: () => void;
  onSave: (article: Partial<Article>) => void;
}

export function ArticleEditorModal({ visible, article, onClose, onSave }: ArticleEditorModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [author, setAuthor] = useState('');
  const [messageApi] = message.useMessage();

  useEffect(() => {
    if (article) {
      setTitle(article.title);
      setContent(article.content);
      setAuthor(article.author);
    } else {
      setTitle('');
      setContent('');
      setAuthor('');
    }
  }, [article]);

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !author.trim()) {
      messageApi.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    onSave({
      title: title.trim(),
      content: content.trim(),
      author: author.trim(),
      status: article?.status || 'draft',
      createdAt: article?.createdAt || new Date().toISOString().split('T')[0],
    });
  };

  return (
    <Modal
      title={article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button key="save" type="primary" onClick={handleSave}>
          Lưu
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Tiêu đề: <span style={{ color: 'red' }}>*</span>
        </label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Nhập tiêu đề bài viết"
          size="large"
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Tác giả: <span style={{ color: 'red' }}>*</span>
        </label>
        <Input
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Nhập tên tác giả"
          size="large"
        />
      </div>

      <div>
        <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
          Nội dung: <span style={{ color: 'red' }}>*</span>
        </label>
        <CKEditorWrapper value={content} onChange={setContent} />
      </div>
    </Modal>
  );
}
