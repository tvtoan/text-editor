import React from 'react';
import { Button, Popconfirm } from 'antd';
import { FileTextOutlined, DeleteOutlined } from '@ant-design/icons';
import { Article } from '@/app/types/slateJs/article';

interface SidebarProps {
  articles: Article[];
  currentArticle: Article | null;
  onCreateNew: () => void;
  onLoadArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  isDeleting: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  articles,
  currentArticle,
  onCreateNew,
  onLoadArticle,
  onDeleteArticle,
  isDeleting,
}) => {
  return (
    <div
      style={{
        width: '250px',
        borderRight: '1px solid #d9d9d9',
        padding: '20px',
        overflowY: 'auto',
        background: '#f5f5f5',
      }}
    >
      <Button
        type="primary"
        icon={<FileTextOutlined />}
        onClick={onCreateNew}
        style={{ width: '100%', marginBottom: '20px' }}
      >
        Bài viết mới
      </Button>

      <h3 style={{ marginBottom: '10px' }}>Danh sách bài viết</h3>
      {articles?.map((article) => (
        <div
          key={article.id}
          style={{
            padding: '10px',
            marginBottom: '8px',
            background: currentArticle?.id === article.id ? '#1890ff' : 'white',
            color: currentArticle?.id === article.id ? 'white' : 'black',
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div onClick={() => onLoadArticle(article)} style={{ flex: 1, cursor: 'pointer' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{article.title}</div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>{article.author}</div>
          </div>
          <Popconfirm
            title="Xóa bài viết"
            description="Bạn có chắc chắn muốn xóa bài viết này?"
            onConfirm={(e) => {
              e?.stopPropagation();
              onDeleteArticle(article.id);
            }}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button
              type="text"
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={isDeleting}
              onClick={(e) => e.stopPropagation()}
              style={{
                color: currentArticle?.id === article.id ? 'white' : undefined,
              }}
            />
          </Popconfirm>
        </div>
      ))}
    </div>
  );
};
