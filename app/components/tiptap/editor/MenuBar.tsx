'use client';

import { useState } from 'react';
import { Button, Space, Popover, message } from 'antd';
import { Editor } from '@tiptap/react';
import { SketchPicker } from 'react-color';
import { uploadToCloudinary } from '@/app/lib/cloudinary';
import { getOptimizedImageUrl, getOptimizedVideoUrl, getVideoPosterUrl } from '@/app/lib/optimized';

interface MenuBarProps {
  editor: Editor | null;
}

export default function MenuBar({ editor }: MenuBarProps) {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  if (!editor) return null;

  // Upload ảnh từ máy
  const addImageFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/gif,image/webp,image/avif';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const result = await uploadToCloudinary(file, { resourceType: 'image' });
        if (!result?.url) throw new Error('Upload ảnh thất bại');

        const optimizedImg = getOptimizedImageUrl(result.url);
        editor.chain().focus().setImage({ src: optimizedImg, alt: file.name }).run();
        messageApi.success('Đã thêm ảnh!');
      } catch (err: any) {
        messageApi.error(err.message || 'Tải ảnh lên thất bại');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  const addVideoFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/mp4,video/webm,video/ogg,video/quicktime';

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      if (file.size > 100 * 1024 * 1024) {
        messageApi.error('Video quá lớn! Tối đa 100MB');
        return;
      }

      setUploading(true);
      try {
        const result = await uploadToCloudinary(file, { resourceType: 'video' });
        if (!result?.url) throw new Error('Upload video thất bại');

        const optimizedVideo = getOptimizedVideoUrl(result.url);
        const poster = getVideoPosterUrl(result.url);

        editor
          .chain()
          .focus()
          .setVideo({
            src: optimizedVideo,
            poster,
          })
          .run();

        messageApi.success('Đã thêm video!');
      } catch (err: any) {
        messageApi.error('Tải video lên thất bại');
      } finally {
        setUploading(false);
      }
    };

    input.click();
  };

  // Nhúng ảnh từ URL
  const addImageFromUrl = () => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url?.trim()) {
      const optimized = getOptimizedImageUrl(url.trim());
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
