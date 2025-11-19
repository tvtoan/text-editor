'use client';

import { Button, Card, Typography } from 'antd';
import { ArrowRightOutlined, EditOutlined } from '@ant-design/icons';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { Title, Paragraph } = Typography;

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-3xl px-6 space-y-10">
        {/* Header */}
        <div className="flex justify-between items-center mt-6">
          <Title level={2} className="!mb-0 text-gray-800">
            Text Editor Hub
          </Title>
          <LanguageSwitcher />
        </div>

        {/* Intro Card */}
        <Card className="shadow-md rounded-xl">
          <div className="text-center space-y-4 py-6">
            <EditOutlined style={{ fontSize: 40, color: '#1677ff' }} />

            <Title level={3} className="!mb-2">
              Chào mừng bạn đến với Bộ Sưu Tập Trình Soạn Thảo Văn Bản Hiện Đại
            </Title>

            <Paragraph className="text-gray-600">
              Đây là nơi bạn có thể khám phá và trải nghiệm các trình soạn thảo văn bản mạnh mẽ như{' '}
              <strong>SlateJS</strong>, <strong>Tiptap</strong> và <strong>SunEditor</strong>. Mỗi
              editor mang đến khả năng tùy chỉnh linh hoạt, hỗ trợ rich-text và tích hợp dễ dàng
              trong dự án của bạn.
            </Paragraph>

            <Paragraph className="text-gray-600">
              Hãy chọn 1 trình soạn thảo bên dưới để bắt đầu trải nghiệm.
            </Paragraph>
          </div>
        </Card>

        {/* Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Card className="shadow rounded-xl text-center py-4">
            <Title level={4}>SlateJS</Title>
            <Paragraph className="text-gray-600 text-sm">
              Editor linh hoạt dùng schema, phù hợp tùy chỉnh sâu.
            </Paragraph>
            <Button type="primary" href="/editor/slateJs" icon={<ArrowRightOutlined />}>
              Trải nghiệm
            </Button>
          </Card>

          <Card className="shadow rounded-xl text-center py-4">
            <Title level={4}>Tiptap</Title>
            <Paragraph className="text-gray-600 text-sm">
              Editor hiện đại dựa trên ProseMirror, nhiều extension mạnh mẽ.
            </Paragraph>
            <Button type="primary" href="/editor/tiptap" icon={<ArrowRightOutlined />}>
              Trải nghiệm
            </Button>
          </Card>

          <Card className="shadow rounded-xl text-center py-4">
            <Title level={4}>SunEditor</Title>
            <Paragraph className="text-gray-600 text-sm">
              Editor dễ dùng, toolbar đẹp, nhiều tính năng media.
            </Paragraph>
            <Button type="primary" href="/editor/sunEditor" icon={<ArrowRightOutlined />}>
              Trải nghiệm
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
