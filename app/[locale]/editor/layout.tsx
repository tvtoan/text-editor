'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { useLocale } from 'next-intl';

const ProLayout = dynamic(() => import('@ant-design/pro-components').then((mod) => mod.ProLayout), {
  ssr: false,
});

const menuItems = [
  { path: '/editor/slateJs', name: 'SlateJS' },
  { path: '/editor/sunEditor', name: 'SunEditor' },
  { path: '/editor/tiptap', name: 'Tiptap' },
];

export default function EditorLayout({ children }: { children: React.ReactNode }) {
  const locale = useLocale();

  return (
    <ProLayout
      title="Text Editor Hub"
      logo="/logo.png"
      fixSiderbar
      layout="mix"
      siderWidth={220}
      route={{ routes: menuItems }}
      menuItemRender={(item, dom) => (item.path ? <Link href={item.path}>{dom}</Link> : dom)}
      actionsRender={(props) => [<LanguageSwitcher key="lang" />]}
    >
      <div style={{ padding: 24 }}>{children}</div>
    </ProLayout>
  );
}
