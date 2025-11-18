'use client';
import { useUsers, useDeleteUser } from '../hooks/useUser';
import { User } from '../types/user';
import { List, Skeleton, Popconfirm, message, Button, Empty } from 'antd';
import { useTranslations } from 'next-intl';

export default function UserList({ page, search }: { page: number; search: string }) {
  const t = useTranslations('userList');
  const tCommon = useTranslations('common');
  const { data, isLoading, isError } = useUsers(page, search);
  const deleteUser = useDeleteUser();
  const [messageApi, contextHolder] = message.useMessage();

  if (isLoading) return <Skeleton active paragraph={{ rows: 5 }} />;
  if (isError) return <p className="text-red-500 text-center">{tCommon('error')}</p>;
  if (!data?.users || data.users.length === 0) {
    return <Empty description={search ? t('noResults', { search }) : t('empty')} />;
  }

  const handleDelete = (id: number) => {
    deleteUser.mutate(id, {
      onSuccess: () => messageApi.success(t('deleteSuccess')),
      onError: () => messageApi.error(t('deleteError')),
    });
  };

  return (
    <List
      bordered
      dataSource={data.users}
      renderItem={(user: User) => (
        <List.Item
          actions={[
            <Popconfirm
              title={t('deleteConfirmTitle')}
              description={t('deleteConfirmDesc')}
              onConfirm={() => handleDelete(user.id)}
              okText={t('deleteButton')}
              cancelText={t('cancelButton')}
            >
              <Button danger size="small">
                {t('deleteButton')}
              </Button>
            </Popconfirm>,
          ]}
        >
          <List.Item.Meta
            title={<span className="font-semibold">{user.name}</span>}
            description={<span className="text-gray-500">{user.email}</span>}
          />
        </List.Item>
      )}
    />
  );
}
