import React from 'react';
import { Button, Space, Tag, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import type { Article } from '../../../types/ckeditor/article';

interface ArticleTableProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (id: string) => void;
  onPreview: (article: Article) => void;
}

export const ArticleTable: React.FC<ArticleTableProps> = ({
  articles,
  onEdit,
  onDelete,
  onPreview,
}) => {
  const handleDelete = (record: Article) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn có chắc chắn muốn xóa bài viết "${record.title}"?`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      onOk: () => onDelete(record.id),
    });
  };

  const columns: ProColumns<Article>[] = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      ellipsis: true,
    },
    {
      title: 'Tác giả',
      dataIndex: 'author',
      key: 'author',
      width: 150,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,

      render: (_, record) => (
        <Tag color={record.status === 'published' ? 'green' : 'orange'}>
          {record.status === 'published' ? 'Đã xuất bản' : 'Bản nháp'}
        </Tag>
      ),

      filters: [
        { text: 'Đã xuất bản', value: 'published' },
        { text: 'Bản nháp', value: 'draft' },
      ],

      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Thao tác',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => onPreview(record)}>
            Xem
          </Button>
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => onEdit(record)}>
            Sửa
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <ProTable<Article>
      columns={columns}
      dataSource={articles}
      rowKey="id"
      search={false}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showTotal: (total) => `Tổng số ${total} bài viết`,
      }}
      toolBarRender={false}
      scroll={{ x: 900 }}
    />
  );
};
