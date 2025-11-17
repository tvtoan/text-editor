// app/components/tiptap/articles/ArticleDetail.tsx
import React from 'react';
import { Button, Modal, Tag, Spin, Typography, Space, Card } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useArticle } from '@/app/hooks/tiptap/useArticles';
import { useArticleStore } from '@/app/store/tiptap/useArticleStore';

const { Title, Text } = Typography;

export default function ArticleDetail() {
  const { selectedArticleId, clearSelectedArticle } = useArticleStore();
  const { data: article, isLoading } = useArticle(selectedArticleId);

  const open = !!selectedArticleId;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={clearSelectedArticle}
            style={{ marginLeft: -8 }}
          />
          <span>Chi tiết bài viết</span>
        </div>
      }
      open={open}
      onCancel={clearSelectedArticle}
      footer={
        <Button type="default" icon={<ArrowLeftOutlined />} onClick={clearSelectedArticle}>
          Quay lại danh sách
        </Button>
      }
      width={1000}
      centered
      closeIcon={true}
      styles={{
        body: { padding: '24px', maxHeight: '80vh', overflowY: 'auto' },
        mask: {
          backgroundColor: 'rgba(0, 0, 0, 0.65)',
        },
      }}
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <Spin size="large" />
        </div>
      ) : !article ? (
        <div style={{ textAlign: 'center', padding: 80 }}>
          <Title level={4} type="secondary">
            Không tìm thấy bài viết
          </Title>
        </div>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Tiêu đề */}
          <Title level={2} style={{ margin: 0, fontSize: 30 }}>
            {article.title}
          </Title>

          {/* Thông tin meta */}
          <Space size={16} style={{ color: '#666', fontSize: 15 }}>
            <Text strong>Tác giả: {article.author}</Text>
            <Text>Ngày tạo: {article.createdAt}</Text>
            <Tag color={article.status === 'published' ? 'green' : 'orange'}>
              {article.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
            </Tag>
          </Space>

          {/* Nội dung bài viết */}
          <Card
            variant="outlined"
            style={{
              background: '#fafafa',
              borderRadius: 12,
              marginTop: 16,
            }}
            styles={{ body: { padding: '24px' } }}
          >
            <div
              className="tiptap-content"
              dangerouslySetInnerHTML={{ __html: article.content }}
              style={{
                fontSize: '17px',
                lineHeight: '1.9',
                minHeight: '200px',
              }}
            />
          </Card>
        </Space>
      )}
    </Modal>
  );
}
