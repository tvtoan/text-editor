import React from 'react';
import { Modal, Button, Tag } from 'antd';
import type { Article } from '../../../types/ckeditor/article';

interface PreviewModalProps {
  visible: boolean;
  article: Article | null;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ visible, article, onClose }) => {
  if (!article) return null;

  return (
    <Modal
      title="Xem trước bài viết"
      open={visible}
      onCancel={onClose}
      width={800}
      footer={[
        <Button key="close" type="primary" onClick={onClose}>
          Đóng
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ marginBottom: 8 }}>{article.title}</h2>
        <div style={{ display: 'flex', gap: 16, color: '#888', fontSize: 14 }}>
          <span>📝 Tác giả: {article.author}</span>
          <span>📅 Ngày: {article.createdAt}</span>
          <Tag color={article.status === 'published' ? 'green' : 'orange'}>
            {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
          </Tag>
        </div>
      </div>

      <div
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: 4,
          padding: 16,
          backgroundColor: '#fafafa',
          minHeight: 200,
        }}
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </Modal>
  );
};
