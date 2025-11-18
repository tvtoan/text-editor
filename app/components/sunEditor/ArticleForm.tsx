import { ModalForm, ProFormText, ProFormSelect } from '@ant-design/pro-components';
import { Form } from 'antd';
import { SunEditorWrapper } from '@/app/components/sunEditor/SunEditorWrapper';
import { useRef, useEffect } from 'react';
import { CreateArticle } from '@/app/types/sunEditor/article';

interface ArticleFormProps {
  open: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateArticle) => void;
  initialValues?: Partial<CreateArticle> & { id?: string };
}

export function ArticleForm({ open, onCancel, onSubmit, initialValues }: ArticleFormProps) {
  const [form] = Form.useForm();
  const editorRef = useRef<any>(null);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue(initialValues);
        editorRef.current?.setContent(initialValues.content || '');
      } else {
        form.resetFields();
        editorRef.current?.setContent('');
      }
    }
  }, [open, initialValues, form]);

  return (
    <ModalForm<CreateArticle>
      form={form}
      title={initialValues?.title ? 'Sửa bài viết' : 'Tạo bài viết mới'}
      open={open}
      width={1000}
      onFinish={async (values) => {
        const content = editorRef.current?.getContent() || '';
        onSubmit({ ...values, content });
        return true;
      }}
      onOpenChange={(visible) => !visible && onCancel()}
      modalProps={{
        destroyOnHidden: true,
        afterClose: () => {
          form.resetFields();
          editorRef.current?.setContent('');
        },
      }}
    >
      <div style={{ display: 'flex', gap: 24 }}>
        {/* Left column: các thông tin */}
        <div style={{ flex: 1 }}>
          <ProFormText
            name="title"
            label="Tiêu đề"
            placeholder="Nhập tiêu đề bài viết"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          />

          <ProFormText
            name="author"
            label="Tác giả"
            placeholder="Nhập tên tác giả"
            rules={[{ required: true, message: 'Vui lòng nhập tên tác giả' }]}
          />

          <ProFormSelect
            name="status"
            label="Trạng thái"
            options={[
              { label: 'Bản nháp', value: 'draft' },
              { label: 'Đã xuất bản', value: 'published' },
            ]}
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          />
        </div>

        {/* Right column: nội dung */}
        <div style={{ flex: 2 }}>
          <Form.Item label="Nội dung" required labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
            <SunEditorWrapper
              ref={editorRef}
              value={initialValues?.content || ''}
              onChange={() => {}}
            />
          </Form.Item>
        </div>
      </div>
    </ModalForm>
  );
}
