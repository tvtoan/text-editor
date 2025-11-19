'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
// import LanguageSwitcher from '@/app/components/LanguageSwitcher';
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
      title="Text Editor"
      logo="https://scontent.fhan17-1.fna.fbcdn.net/v/t39.30808-6/492068884_1219679086823883_4027248764894339918_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=6ee11a&_nc_ohc=5H0HiXeNyaQQ7kNvwFRkTL8&_nc_oc=AdkVNx0CMjeJqA4R_L1mfReHURYXsfKCTz1zdMH3uRc0-wjIAuR-uSrysWw6iD5rhZY&_nc_zt=23&_nc_ht=scontent.fhan17-1.fna&_nc_gid=bKk25sTubpbHRRcCFemEDA&oh=00_AfiVLqe9P-iAKPUD3h1TDHs-Yf_fqkd45DxohiZaxxekdQ&oe=69232CE4"
      fixSiderbar
      layout="mix"
      siderWidth={220}
      route={{ routes: menuItems }}
      menuItemRender={(item, dom) => (item.path ? <Link href={item.path}>{dom}</Link> : dom)}
      // actionsRender={(props) => [<LanguageSwitcher key="lang" />]}
    >
      <div style={{ padding: 24 }}>{children}</div>
    </ProLayout>
  );
}
