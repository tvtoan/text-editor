// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Nếu không có locale từ request → dùng default
  if (!locale || !hasLocale(routing.locales, locale)) {
    locale = routing.defaultLocale;
  }
  const common = (await import(`../messages/${locale}/common.json`)).default;
  const addUser = (await import(`../messages/${locale}/addUser.json`)).default;
  const userList = (await import(`../messages/${locale}/userList.json`)).default;

  return {
    locale,
    messages: {
      common,
      addUser,
      userList,
    },
  };
});
