import React from 'react';
import { Card, Row, Col, Button, Tag, Popconfirm, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Article } from '@/app/types/slateJs/article';

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  onView: (article: Article) => void;
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  isDeleting: boolean;
}

export const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading,
  onView,
  onEdit,
  onDelete,
  onCreate,
  isDeleting,
}) => {
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Đang tải...</div>;
  }
  console.log('data list', articles);

  return (
    <div style={{ padding: '24px', maxWidth: '1400px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '28px' }}>Danh sách bài viết</h1>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={onCreate}>
          Tạo bài viết mới
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {articles.map((article) => (
          <Col xs={24} sm={12} lg={8} key={article.id}>
            <Card
              hoverable
              title={
                <div
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {article.title}
                </div>
              }
              extra={
                <Tag color={article.status === 'published' ? 'green' : 'orange'}>
                  {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
                </Tag>
              }
            >
              {/* Tác giả */}
              <div style={{ color: '#666', fontSize: '12px', marginBottom: '4px' }}>
                Tác giả: {article.author}
              </div>

              {/* Ngày tạo - Ngày cập nhật */}
              <div style={{ color: '#999', fontSize: '12px', marginBottom: '4px' }}>
                Ngày tạo: {new Date(article.createdAt).toLocaleDateString('vi-VN')}
                {article.updatedAt
                  ? ` - Cập nhật: ${new Date(article.updatedAt).toLocaleDateString('vi-VN')}`
                  : ''}
              </div>

              {/* Content */}
              <div
                style={{
                  color: '#333',
                  fontSize: '14px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  marginBottom: '20px',
                }}
              >
                {/* Lấy text từ Slate JSON */}
                {(() => {
                  try {
                    const parsed = JSON.parse(article.content);
                    return parsed
                      .map((node: any) => node.children.map((child: any) => child.text).join(''))
                      .join(' ');
                  } catch {
                    return article.content;
                  }
                })()}
              </div>

              <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
                <Button type="default" icon={<EyeOutlined />} onClick={() => onView(article)}>
                  Xem
                </Button>
                <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(article)}>
                  Sửa
                </Button>
                <Popconfirm
                  title="Xóa bài viết"
                  description="Bạn có chắc chắn muốn xóa bài viết này?"
                  onConfirm={() => onDelete(article.id)}
                  okText="Xóa"
                  cancelText="Hủy"
                  okButtonProps={{ danger: true }}
                >
                  <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
                    Xóa
                  </Button>
                </Popconfirm>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};
