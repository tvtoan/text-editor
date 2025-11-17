'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import { Button, Dropdown } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleChange = (nextLocale: string) => {
    if (nextLocale !== locale) {
      router.replace(pathname, { locale: nextLocale });
    }
  };

  const items = routing.locales.map((loc) => ({
    key: loc,
    label: loc === 'vi' ? 'Tiếng Việt' : 'English',
    onClick: () => handleChange(loc),
  }));

  return (
    <Dropdown menu={{ items }} placement="bottomRight">
      <Button icon={<GlobalOutlined />} type="default">
        {locale === 'vi' ? 'Tiếng Việt' : 'English'}
      </Button>
    </Dropdown>
  );
}
