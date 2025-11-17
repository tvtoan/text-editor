'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card, Button, Space, Tooltip, message } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  UnorderedListOutlined,
  PictureOutlined,
} from '@ant-design/icons';

interface CKEditorProps {
  value: string;
  onChange: (data: string) => void;
}

// Custom Upload Adapter
class Base64UploadAdapter {
  loader: any;

  constructor(loader: any) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file: File) =>
        new Promise((resolve, reject) => {
          if (file.size > 5 * 1024 * 1024) {
            message.error('Kích thước ảnh không được vượt quá 5MB');
            reject('File too large');
            return;
          }

          if (!file.type.startsWith('image/')) {
            message.error('Vui lòng chọn file ảnh');
            reject('Invalid file type');
            return;
          }

          const reader = new FileReader();
          reader.onload = () => resolve({ default: reader.result });
          reader.onerror = (error) => {
            message.error('Lỗi khi đọc file ảnh');
            reject(error);
          };
          reader.onabort = () => reject();
          reader.readAsDataURL(file);
        })
    );
  }

  abort() {}
}

function Base64UploadAdapterPlugin(editor: any) {
  editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
    return new Base64UploadAdapter(loader);
  };
}

export const CKEditor: React.FC<CKEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);
  const [Editor, setEditor] = useState<any>(null);
  const [editorLoaded, setEditorLoaded] = useState(false);

  useEffect(() => {
    const loadEditor = async () => {
      const { CKEditor } = await import('@ckeditor/ckeditor5-react');
      const ClassicEditor = (await import('@ckeditor/ckeditor5-build-classic')).default;
      setEditor({ CKEditor, ClassicEditor });
      setEditorLoaded(true);
    };
    loadEditor();
  }, []);

  const applyCommand = (command: string, value?: string) => {
    if (!editorRef.current) return;
    editorRef.current.execute(command, value);
    editorRef.current.editing.view.focus();
  };
  const handleVideoUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';

    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 50 * 1024 * 1024) {
        message.error('Video không được vượt quá 50MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const videoUrl = event.target?.result as string;
        if (editorRef.current && videoUrl) {
          const viewFragment = editorRef.current.data.processor.toView(
            `<video src="${videoUrl}" controls style="max-width:100%;"/>`
          );
          const modelFragment = editorRef.current.data.toModel(viewFragment);
          editorRef.current.model.insertContent(
            modelFragment,
            editorRef.current.model.document.selection
          );
          message.success('Đã chèn video');
        }
      };
      reader.onerror = () => message.error('Lỗi khi đọc file video');

      reader.readAsDataURL(file);
    };

    input.click();
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        message.error('Kích thước ảnh không được vượt quá 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        message.error('Vui lòng chọn file ảnh');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        if (editorRef.current && imageUrl) {
          const viewFragment = editorRef.current.data.processor.toView(
            `<img src="${imageUrl}" alt="Uploaded image"/>`
          );
          const modelFragment = editorRef.current.data.toModel(viewFragment);
          editorRef.current.model.insertContent(
            modelFragment,
            editorRef.current.model.document.selection
          );
          message.success('Tải ảnh lên thành công');
        }
      };
      reader.onerror = () => message.error('Lỗi khi đọc file ảnh');
      reader.readAsDataURL(file);
    };

    input.click();
  };

  if (!editorLoaded || !Editor) {
    return (
      <Card
        variant="outlined"
        style={{
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          backgroundColor: '#fafafa',
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        Đang tải CKEditor...
      </Card>
    );
  }

  const { CKEditor, ClassicEditor } = Editor;

  const editorConfig = {
    extraPlugins: [Base64UploadAdapterPlugin],
    toolbar: [],
    mediaEmbed: {
      previewsInData: true,
    },
  };

  return (
    <Card
      variant="outlined"
      style={{ borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
      styles={{ body: { padding: 12 } }}
    >
      <Space wrap style={{ marginBottom: 8 }}>
        <Tooltip title="Bold">
          <Button size="small" icon={<BoldOutlined />} onClick={() => applyCommand('bold')} />
        </Tooltip>
        <Tooltip title="Italic">
          <Button size="small" icon={<ItalicOutlined />} onClick={() => applyCommand('italic')} />
        </Tooltip>
        <Tooltip title="Link">
          <Button size="small" icon={<LinkOutlined />} onClick={() => applyCommand('link')} />
        </Tooltip>
        <Tooltip title="Bullet List">
          <Button
            size="small"
            icon={<UnorderedListOutlined />}
            onClick={() => applyCommand('bulletedList')}
          />
        </Tooltip>
        <Tooltip title="Numbered List">
          <Button
            size="small"
            icon={<OrderedListOutlined />}
            onClick={() => applyCommand('numberedList')}
          />
        </Tooltip>
        <Tooltip title="Upload Image">
          <Button size="small" icon={<PictureOutlined />} onClick={handleImageUpload}>
            Ảnh
          </Button>
        </Tooltip>
        <Tooltip title="Upload Video">
          <Button size="small" onClick={handleVideoUpload}>
            Video
          </Button>
        </Tooltip>
        <Tooltip title="Embed YouTube">
          <Button
            size="small"
            onClick={() => {
              const url = prompt('Nhập link YouTube:');
              if (!url) return;
              applyCommand('mediaEmbed', url);
            }}
          >
            YouTube
          </Button>
        </Tooltip>
      </Space>

      <div style={{ border: '1px solid #d9d9d9', borderRadius: 8, overflow: 'hidden' }}>
        <CKEditor
          editor={ClassicEditor}
          data={value}
          config={editorConfig}
          onReady={(editor: any) => {
            editorRef.current = editor;
            editor.editing.view.change((writer: any) => {
              writer.setStyle('min-height', '200px', editor.editing.view.document.getRoot());
            });
          }}
          onChange={(event: any, editor: any) => {
            const data = editor.getData();
            onChange(data);
          }}
        />
      </div>
    </Card>
  );
};
