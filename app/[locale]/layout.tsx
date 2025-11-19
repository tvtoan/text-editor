import '@ant-design/v5-patch-for-react-19';
import 'antd/dist/reset.css';
import '../globals.css';

import ReactQueryProvider from '../providers/ReactQueryProvider';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

import { ConfigProvider } from 'antd';
import enUS from 'antd/locale/en_US';

export const metadata = {
  title: 'Text Editor Hub',
  description: 'Editor demo: SlateJS, Tiptap, SunEditor',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className="bg-gray-50">
        <ConfigProvider locale={enUS}>
          <NextIntlClientProvider locale={locale}>
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </NextIntlClientProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
