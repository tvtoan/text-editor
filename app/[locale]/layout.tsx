import '@ant-design/v5-patch-for-react-19';
import '../globals.css';
import 'antd/dist/reset.css';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'User Manager',
  description: 'React Query Demo with Next.js 16',
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
    <html lang="vi">
      <body className="bg-gray-50">
        <NextIntlClientProvider>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
