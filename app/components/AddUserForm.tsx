'use client';
import { useForm } from 'antd/es/form/Form';
import { useAddUser } from '../hooks/useUser';
import { Form, Input, Button, message } from 'antd';
import { useTranslations } from 'next-intl';

export default function AddUserForm() {
  const [form] = useForm();
  const t = useTranslations('addUser');
  const addUser = useAddUser();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (value: { name: string; email: string }) => {
    addUser.mutate(value, {
      onSuccess: () => {
        messageApi.success(t('success'));
        form.resetFields();
      },
      onError: () => {
        messageApi.error(t('error'));
      },
    });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      {contextHolder}
      <Form.Item
        label={t('nameLabel')}
        name="name"
        rules={[{ required: true, message: t('nameRequired') }]}
      >
        <Input placeholder={t('namePlaceholder')} />
      </Form.Item>

      <Form.Item
        label={t('emailLabel')}
        name="email"
        rules={[
          { required: true, message: t('emailRequired') },
          { type: 'email', message: t('emailInvalid') },
        ]}
      >
        <Input placeholder={t('emailPlaceholder')} />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={addUser.isPending}>
          {addUser.isPending ? t('submittingButton') : t('submitButton')}
        </Button>
      </Form.Item>
    </Form>
  );
}
