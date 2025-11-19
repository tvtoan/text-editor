import React from 'react';
import { Modal, Tag, Space } from 'antd';
import { Article } from '@/app/types/slateJs/article';

interface ArticleViewModalProps {
  visible: boolean;
  article: Article | null;
  onClose: () => void;
}

export const ArticleViewModal: React.FC<ArticleViewModalProps> = ({
  visible,
  article,
  onClose,
}) => {
  if (!article) return null;
  console.log('detail post', article);

  const parseContent = (content: string) => {
    try {
      const parsed = JSON.parse(content);
      return parsed.map((node: any, index: number) => {
        if (node.type === 'paragraph') {
          return (
            <p key={index}>
              {node.children.map((child: any, childIndex: number) => (
                <span
                  key={childIndex}
                  style={{
                    fontWeight: child.bold ? 'bold' : 'normal',
                    fontStyle: child.italic ? 'italic' : 'normal',
                    textDecoration: child.underline ? 'underline' : 'none',
                    color: child.color,
                    fontSize: child.fontSize,
                    fontFamily: child.fontFamily,
                  }}
                >
                  {child.text}
                </span>
              ))}
            </p>
          );
        }
        if (node.type === 'image') {
          return (
            <img
              key={index}
              src={node.url}
              alt=""
              style={{ maxWidth: '100%', marginBottom: '16px' }}
            />
          );
        }
        if (node.type === 'video') {
          return (
            <video key={index} controls style={{ maxWidth: '100%', marginBottom: '16px' }}>
              <source src={node.url} />
            </video>
          );
        }
        if (node.type === 'youtube') {
          return (
            <iframe
              key={index}
              width="100%"
              height="400"
              src={node.url}
              allowFullScreen
              style={{ marginBottom: '16px', border: '0' }}
            />
          );
        }
        return null;
      });
    } catch (e) {
      return <p>{content}</p>;
    }
  };

  return (
    <Modal
      title={
        <div>
          <h2 style={{ marginBottom: '8px' }}>{article.title}</h2>
          <Space>
            <Tag color={article.status === 'published' ? 'green' : 'orange'}>
              {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Tag>
            <span style={{ color: '#666', fontSize: '14px' }}>Tác giả: {article.author}</span>
            <span style={{ color: '#999', fontSize: '14px' }}>
              {new Date(article.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </Space>
        </div>
      }
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <div
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
          lineHeight: '1.8',
          paddingTop: '16px',
        }}
      >
        {parseContent(article.content)}
      </div>
    </Modal>
  );
};
