'use client';

import { Layout } from 'antd';
import ArticleList from '@/app/components/tiptap/articles/ArticleList';
import ArticleDetail from '@/app/components/tiptap/articles/ArticleDetail';

const { Header, Content } = Layout;

export default function PostsPage() {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ background: '#f0f2f5', position: 'relative' }}>
        <div style={{ width: '100%', margin: '0 auto' }}>
          <ArticleList />
        </div>

        <ArticleDetail />
      </Content>
    </Layout>
  );
}
