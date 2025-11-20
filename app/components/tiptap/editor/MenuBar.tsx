'use client';

import { useState } from 'react';
import { Button, Space, Popover, message } from 'antd';
import { Editor } from '@tiptap/react';
import { SketchPicker } from 'react-color';

interface MenuBarProps {
  editor: Editor | null;
}

const CLOUDINARY_CLOUD_NAME = 'donbgiqo5';
const CLOUDINARY_UPLOAD_PRESET = 'text_editor';

// Tối ưu video URL (Cloudinary)
const getOptimizedVideoUrl = (originalUrl: string): string => {
  return originalUrl.replace('/upload/', '/upload/f_auto,q_auto:eco,vc_auto/');
};

// Tối ưu poster từ frame đầu tiên của video (Cloudinary)
const getVideoPosterUrl = (videoUrl: string): string => {
  return videoUrl
    .replace('/upload/', '/upload/w_800,h_450,c_fill,g_center,q_auto:good,fl_getframe/first/')
    .replace(/\.(mp4|webm|ogg|mov)$/i, '.jpg');
};

export default function MenuBar({ editor }: MenuBarProps) {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  if (!editor) return null;

  // Upload file Cloudinary
  const uploadFile = async (file: File): Promise<string | null> => {
    setUploading(true);
    messageApi.loading({ content: 'Đang upload...', key: 'upload', duration: 0 });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    const resourceType = file.type.startsWith('video/') ? 'video' : 'image';

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );

      const data = await res.json();

      if (data.secure_url) {
        messageApi.success({ content: 'Upload thành công!', key: 'upload', duration: 2 });
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Upload thất bại');
      }
    } catch (err: any) {
      messageApi.error({ content: err.message || 'Upload thất bại!', key: 'upload', duration: 3 });
      console.error('Upload error:', err);
      return null;
    } finally {
      setUploading(false);
    }
  };

  // Upload ảnh từ máy
  const addImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp,image/avif';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const url = await uploadFile(file);
      if (url) {
        const optimizedImg = url.replace('/upload/', '/upload/q_auto:eco,f_auto,w_auto,dpr_auto/');
        editor.chain().focus().setImage({ src: optimizedImg, alt: file.name }).run();
      }
    };
    input.click();
  };

  // Upload video từ máy — Dùng Video.ts node
  const addVideoFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/ogg,video/quicktime,video/x-m4v';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 100 * 1024 * 1024) {
        messageApi.error('Video quá lớn! Tối đa 100MB với tài khoản miễn phí');
        return;
      }

      const url = await uploadFile(file);
      if (url) {
        const optimizedVideoUrl = getOptimizedVideoUrl(url);
        const posterUrl = getVideoPosterUrl(url);

        editor
          .chain()
          .focus()
          .setVideo({
            src: optimizedVideoUrl,
            poster: posterUrl,
          })
          .run();
      }
    };
    input.click();
  };

  // Nhúng ảnh từ URL
  const addImageFromUrl = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url?.trim()) {
      const optimized = url.includes('cloudinary.com')
        ? url.replace('/upload/', '/upload/q_auto:eco,f_auto/')
        : url.trim();
      editor.chain().focus().setImage({ src: optimized }).run();
    }
  };

  // Nhúng YouTube
  const addYoutubeVideo = () => {
    const url = prompt('Nhập URL video YouTube:');
    if (url?.trim()) {
      editor.commands.setYoutubeVideo({
        src: url.trim(),
        width: 640,
        height: 360,
      });
    }
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setColorPickerVisible(false);
  };

  const setFontFamily = (font: string) => font && editor.chain().focus().setFontFamily(font).run();

  const setFontSize = (size: string) => size && editor.chain().focus().setFontSize(size).run();

  return (
    <>
      {contextHolder}
      <div
        style={{
          padding: '10px 16px',
          borderBottom: '1px solid #eee',
          background: '#fff',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <Space wrap size="small">
          {/* FONT GROUP */}
          <Space size="small">
            <select
              onChange={(e) => setFontFamily(e.target.value)}
              className="editor-select"
              defaultValue=""
            >
              <option value="" disabled>
                Font
              </option>
              <option value="Arial">Arial</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Georgia">Georgia</option>
              <option value="Verdana">Verdana</option>
            </select>

            <select
              onChange={(e) => setFontSize(e.target.value)}
              className="editor-select"
              defaultValue=""
            >
              <option value="" disabled>
                Size
              </option>
              {[12, 14, 16, 18, 24, 32, 48].map((s) => (
                <option key={s} value={`${s}px`}>
                  {s}
                </option>
              ))}
            </select>
          </Space>

          {/* FORMAT GROUP */}
          <Space
            size="small"
            style={{
              padding: '4px 8px',
              borderRadius: 8,
              background: '#fafafa',
              border: '1px solid #eee',
            }}
          >
            <Button
              icon={<strong>B</strong>}
              size="small"
              type={editor.isActive('bold') ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleBold().run()}
            />
            <Button
              icon={<em>I</em>}
              size="small"
              type={editor.isActive('italic') ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleItalic().run()}
            />
            <Button
              icon={<u>U</u>}
              size="small"
              type={editor.isActive('underline') ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleUnderline().run()}
            />

            <Popover
              trigger="click"
              open={colorPickerVisible}
              onOpenChange={setColorPickerVisible}
              content={
                <SketchPicker
                  color={editor.getAttributes('textStyle').color || '#000'}
                  onChangeComplete={(c) => applyColor(c.hex)}
                />
              }
            >
              <Button size="small">🎨</Button>
            </Popover>
          </Space>

          {/* HEADINGS + LIST */}
          <Space
            size="small"
            style={{
              padding: '4px 8px',
              borderRadius: 8,
              background: '#fafafa',
              border: '1px solid #eee',
            }}
          >
            <Button
              size="small"
              type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            >
              H2
            </Button>
            <Button
              size="small"
              type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
              H3
            </Button>
            <Button
              size="small"
              type={editor.isActive('bulletList') ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
              • List
            </Button>
            <Button
              size="small"
              type={editor.isActive('orderedList') ? 'primary' : 'default'}
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
              1. List
            </Button>
          </Space>

          {/* MEDIA GROUP */}
          <Space
            size="small"
            style={{
              padding: '4px 8px',
              borderRadius: 8,
              background: '#f0f9ff',
              border: '1px solid #cce7ff',
            }}
          >
            <Popover
              trigger="click"
              content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 160 }}>
                  <Button size="small" onClick={addImageFromUrl} block>
                    Ảnh từ URL
                  </Button>
                  <Button size="small" onClick={addImageFromFile} loading={uploading} block>
                    Upload ảnh
                  </Button>
                </div>
              }
            >
              <Button size="small">🖼️ Ảnh</Button>
            </Popover>

            <Button size="small" onClick={addVideoFromFile} loading={uploading}>
              🎬 Video
            </Button>

            <Button size="small" onClick={addYoutubeVideo}>
              ▶ YouTube
            </Button>
          </Space>
        </Space>
      </div>
    </>
  );
}
