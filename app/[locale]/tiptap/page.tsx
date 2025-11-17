'use client';

import { Layout } from 'antd';
import ArticleList from '@/app/components/tiptap/articles/ArticleList';
import ArticleDetail from '@/app/components/tiptap/articles/ArticleDetail';

const { Header, Content } = Layout;

export default function PostsPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#001529',
          padding: '0 24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <h2 style={{ color: 'white', margin: 0, lineHeight: '64px', fontSize: '20px' }}>
          Trình Soạn Thảo Văn Bản với TipTap
        </h2>
      </Header>

      <Content style={{ background: '#f0f2f5', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}>
          <ArticleList />
        </div>

        <ArticleDetail />
      </Content>
    </Layout>
  );
}
