import { Modal, Descriptions, Tag } from 'antd';
import { SunEditorWrapper } from '@/app/components/sunEditor/SunEditorWrapper';
import React, { useRef } from 'react';
import { Article } from '@/app/types/sunEditor/article';

interface ArticleDetailModalProps {
  open: boolean;
  onCancel: () => void;
  article?: Article | null;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  open,
  onCancel,
  article,
}) => {
  const editorRef = useRef<any>(null);

  if (!article) return null;

  return (
    <Modal
      open={open}
      title={article.title}
      onCancel={onCancel}
      footer={null}
      width={1000}
      destroyOnHidden
    >
      <Descriptions bordered column={1} size="small" style={{ marginBottom: 16 }}>
        <Descriptions.Item label="Tiêu đề">{article.title}</Descriptions.Item>
        <Descriptions.Item label="Tác giả">{article.author}</Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          <Tag color={article.status === 'published' ? 'success' : 'warning'}>
            {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Ngày tạo">{article.createdAt}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <label style={{ fontWeight: 500, display: 'block', marginBottom: 8 }}>Nội dung</label>
        <SunEditorWrapper
          ref={editorRef}
          value={article.content}
          onChange={() => {}}
          placeholder=""
        />
      </div>
    </Modal>
  );
};
