'use client';
import { useEffect, useState } from 'react';
import AddUserForm from '../components/AddUserForm';
import UserList from '../components/UserList';
import Pagination from '../components/Pagination';
import { useUsers } from '../hooks/useUser';
import { Card, Typography, Input } from 'antd';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '../components/LanguageSwitcher';

const { Title } = Typography;

export default function Page() {
  const t = useTranslations('common');
  const tAdd = useTranslations('addUser');
  const tList = useTranslations('userList');

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const { data, isFetching } = useUsers(page, search);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearch(value.trim());
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-4xl px-4 space-y-6">
        {/* Header với tiêu đề & nút chuyển ngôn ngữ */}
        <div className="flex justify-between items-center">
          <Title level={2} className="!mb-0 text-gray-800">
            {t('appTitle')}
          </Title>
          <LanguageSwitcher />
        </div>

        <Card title={tAdd('title')}>
          <AddUserForm />
        </Card>

        <Card
          title={tList('title')}
          extra={
            <Input.Search
              placeholder={t('searchPlaceholder')}
              allowClear
              enterButton={t('searchButton')}
              onSearch={handleSearch}
              style={{ width: 300 }}
              loading={isFetching}
            />
          }
        >
          <UserList page={page} search={search} />
          {data && (
            <div className="flex justify-center mt-4">
              <Pagination page={page} setPage={setPage} total={data.total} />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
