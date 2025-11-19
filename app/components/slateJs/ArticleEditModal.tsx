'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { createEditor, Descendant, Transforms } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { withHistory } from 'slate-history';
import { Modal, Input, Select, Space, Upload, message, Image, Button, Tabs } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Article } from '@/app/types/slateJs/article';
import { Element } from './Element';
import { Leaf } from './Leaf';
import { Toolbar } from './Toolbar';

interface Props {
  visible: boolean;
  article?: Article | null;
  onSave: (data: {
    title: string;
    content: string;
    author: string;
    status: 'published' | 'draft';
  }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export const ArticleEditorModal: React.FC<Props> = ({
  visible,
  article,
  onSave,
  onCancel,
  isSaving,
}) => {
  // Tạo editor MỚI mỗi khi article.id hoặc visible thay đổi → fix bug content trống lần đầu
  const editor = useMemo(() => {
    const e = createEditor();
    return withHistory(withReact(e));
  }, [article?.id, visible]);

  // State chính
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('draft');
  const [value, setValue] = useState<Descendant[]>([
    { type: 'paragraph', children: [{ text: '' }] },
  ]);

  // Media modal state
  const [mediaModal, setMediaModal] = useState<'image' | 'video' | 'youtube' | null>(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [tab, setTab] = useState('upload');

  // Khi modal mở hoặc đổi bài → load dữ liệu
  useEffect(() => {
    if (!visible) {
      // Khi đóng modal → reset tất cả (tránh nhân đôi modal con)
      setMediaModal(null);
      setMediaUrl('');
      setPreviewUrl(null);
      setUploading(false);
      setTab('upload');
      return;
    }

    if (article) {
      setTitle(article.title);
      setAuthor(article.author);
      setStatus(article.status);

      let parsed: Descendant[];
      try {
        parsed = JSON.parse(article.content);
      } catch {
        parsed = [{ type: 'paragraph', children: [{ text: article.content || '' }] }];
      }

      setValue(parsed);
      console.log('update data:', article);

      // Quan trọng: reset hoàn toàn editor để tránh lẫn dữ liệu cũ
      editor.children = parsed;
      editor.history = { undos: [], redos: [] };
      editor.onChange();
      Transforms.deselect(editor);
    } else {
      // Tạo mới
      setTitle('');
      setAuthor('');
      setStatus('draft');
      const emptyValue: Descendant[] = [{ type: 'paragraph', children: [{ text: '' }] }];
      setValue(emptyValue);
      editor.children = emptyValue;
      editor.history = { undos: [], redos: [] };
      editor.onChange();
    }

    // Focus vào editor sau khi mở
    setTimeout(() => {
      ReactEditor.focus(editor);
      Transforms.select(editor, { offset: 0, path: [0, 0] });
    }, 100);
  }, [visible, article, editor]);

  // Reset media modal
  const resetMedia = () => {
    setMediaModal(null);
    setMediaUrl('');
    setPreviewUrl(null);
    setUploading(false);
    setTab('upload');
  };

  // Xử lý upload file (chỉ preview)
  const handleFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      message.error('File tối đa 15MB');
      return false;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setMediaUrl(url);
      setPreviewUrl(url);
      setTab('upload');
      setUploading(false);
      message.success('Tải lên thành công!');
    };
    reader.readAsDataURL(file);
    return false;
  };

  // Chèn media vào editor
  const insertMedia = (type: 'image' | 'video' | 'youtube') => {
    if (!mediaUrl.trim()) return;

    let url = mediaUrl;
    if (type === 'youtube') {
      const match = mediaUrl.match(/(?:v=|\/|embed\/)([a-zA-Z0-9_-]{11})/);
      if (match) {
        url = `https://www.youtube.com/embed/${match[1]}`;
      }
    }

    const node = {
      type,
      url,
      children: [{ text: '' }],
    };

    Transforms.insertNodes(editor, node as any);
    Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] });
    Transforms.move(editor, { distance: 1, unit: 'line' });

    resetMedia();
  };

  // Lưu bài
  const save = () => {
    if (!title.trim() || !author.trim()) {
      message.warning('Vui lòng nhập đầy đủ tiêu đề và tác giả');
      return;
    }

    onSave({
      title: title.trim(),
      content: JSON.stringify(value),
      author: author.trim(),
      status,
    });
    console.log(' post data', {
      title: title.trim(),
      content: JSON.stringify(value),
      author: author.trim(),
      status,
    });
  };

  // Render element & leaf
  const renderElement = useCallback((props: any) => <Element {...props} />, []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  const isImage = mediaModal === 'image';
  const isVideo = mediaModal === 'video';

  // Force remount Slate khi đổi bài (đảm bảo 100% sạch)
  const slateKey = article?.id ? `article-${article.id}` : 'new-article';

  return (
    <>
      {/* Modal chính */}
      <Modal
        open={visible}
        title={article ? 'Chỉnh sửa bài viết' : 'Tạo bài viết mới'}
        onOk={save}
        onCancel={() => {
          resetMedia();
          onCancel();
        }}
        width={1100}
        okText="Lưu"
        cancelText="Hủy"
        confirmLoading={isSaving}
        keyboard={false}
        maskClosable={false}
        okButtonProps={{
          disabled: !title.trim() || !author.trim() || isSaving,
        }}
      >
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="Tiêu đề bài viết *"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Space>
            <Input
              placeholder="Tác giả *"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              style={{ width: 200 }}
            />
            <Select
              value={status}
              onChange={setStatus}
              style={{ width: 150 }}
              options={[
                { value: 'draft', label: 'Bản nháp' },
                { value: 'published', label: 'Xuất bản' },
              ]}
            />
          </Space>
        </Space>

        <div
          style={{
            marginTop: 16,
            border: '1px solid #d9d9d9',
            borderRadius: 8,
            overflow: 'hidden',
          }}
        >
          <Slate key={slateKey} editor={editor} initialValue={value} onChange={setValue}>
            <Toolbar
              editor={editor}
              onInsertImage={() => setMediaModal('image')}
              onInsertVideo={() => setMediaModal('video')}
              onInsertYoutube={() => setMediaModal('youtube')}
            />
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder="Nhập nội dung bài viết..."
              style={{ padding: 16, minHeight: 420, background: '#fff' }}
            />
          </Slate>
        </div>
      </Modal>

      {/* Modal Image & Video */}
      {(isImage || isVideo) && (
        <Modal
          title={isImage ? 'Thêm ảnh' : 'Thêm video'}
          open
          onOk={() => insertMedia(isImage ? 'image' : 'video')}
          onCancel={resetMedia}
          okText="Chèn"
          cancelText="Hủy"
          width={700}
          okButtonProps={{ disabled: !mediaUrl || uploading }}
        >
          <Tabs activeKey={tab} onChange={setTab}>
            <Tabs.TabPane key="upload" tab="Tải lên">
              <Upload
                accept={isImage ? 'image/*' : 'video/*'}
                beforeUpload={handleFile}
                showUploadList={false}
              >
                <Button icon={<UploadOutlined />} block size="large" loading={uploading}>
                  Click hoặc kéo thả file
                </Button>
              </Upload>
            </Tabs.TabPane>
            <Tabs.TabPane key="url" tab="Dán URL">
              <Input
                placeholder={
                  isImage ? 'https://example.com/image.jpg' : 'https://example.com/video.mp4'
                }
                value={mediaUrl}
                onChange={(e) => {
                  setMediaUrl(e.target.value);
                  setPreviewUrl(e.target.value);
                }}
                size="large"
              />
            </Tabs.TabPane>
          </Tabs>

          {previewUrl && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              {isImage ? (
                <Image
                  src={previewUrl}
                  style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}
                  preview={false}
                />
              ) : (
                <video controls style={{ maxWidth: '100%', maxHeight: 400, borderRadius: 8 }}>
                  <source src={previewUrl} />
                </video>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* Modal YouTube */}
      {mediaModal === 'youtube' && (
        <Modal
          title="Nhúng YouTube"
          open
          onOk={() => insertMedia('youtube')}
          onCancel={resetMedia}
          okText="Chèn"
          cancelText="Hủy"
          okButtonProps={{ disabled: !mediaUrl.trim() }}
        >
          <Input
            placeholder="Dán link YouTube (ví dụ: https://youtube.com/watch?v=abc123)"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            size="large"
          />
          {mediaUrl && (
            <div
              style={{ marginTop: 16, position: 'relative', paddingBottom: '56.25%', height: 0 }}
            >
              <iframe
                src={`https://www.youtube.com/embed/${
                  mediaUrl.match(/(?:v=|\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1] || ''
                }`}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  borderRadius: 8,
                }}
                allowFullScreen
                title="YouTube preview"
              />
            </div>
          )}
        </Modal>
      )}
    </>
  );
};
