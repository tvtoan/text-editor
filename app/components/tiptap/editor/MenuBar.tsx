'use client';

import React, { useState } from 'react';
import { Button, Space, Popover } from 'antd';
import { Editor } from '@tiptap/react';
import { SketchPicker } from 'react-color';

interface MenuBarProps {
  editor: Editor | null;
}

export default function MenuBar({ editor }: MenuBarProps) {
  const [colorPickerVisible, setColorPickerVisible] = useState(false);

  if (!editor) return null;

  const addImage = (): void => {
    const url = prompt('Nhập URL hình ảnh:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addYoutubeVideo = (): void => {
    const url = prompt('Nhập URL video YouTube:');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
        width: 640,
        height: 360,
      });
    }
  };

  const applyColor = (color: string) => {
    editor.chain().focus().setColor(color).run();
    setColorPickerVisible(false);
  };

  const setFontFamily = (font: string): void => {
    if (font) {
      editor.chain().focus().setFontFamily(font).run();
    }
  };

  const setFontSize = (size: string): void => {
    if (size) {
      editor.chain().focus().setFontSize(size).run();
    }
  };

  return (
    <div
      style={{
        padding: '12px',
        borderBottom: '1px solid #d9d9d9',
        background: '#fafafa',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        alignItems: 'center',
      }}
    >
      <Space wrap>
        {/* Font family */}
        <select
          onChange={(e) => setFontFamily(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
          }}
        >
          <option value="">Chọn Font</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Verdana">Verdana</option>
        </select>

        {/* Font size */}
        <select
          onChange={(e) => setFontSize(e.target.value)}
          style={{
            padding: '6px 12px',
            borderRadius: '6px',
            border: '1px solid #d9d9d9',
            cursor: 'pointer',
          }}
        >
          <option value=""> Size</option>
          <option value="12px">12</option>
          <option value="14px">14</option>
          <option value="16px">16</option>
          <option value="18px">18</option>
          <option value="24px">24</option>
          <option value="32px">32</option>
          <option value="48px">48</option>
        </select>

        {/* Bold / Italic / Underline */}
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleBold().run()}
          type={editor.isActive('bold') ? 'primary' : 'default'}
        >
          <strong>B</strong>
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          type={editor.isActive('italic') ? 'primary' : 'default'}
        >
          <em>I</em>
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          type={editor.isActive('underline') ? 'primary' : 'default'}
        >
          <u>U</u>
        </Button>

        {/* Color picker */}
        <Popover
          content={
            <SketchPicker
              color={editor.getAttributes('textStyle').color || '#000'}
              onChangeComplete={(c) => applyColor(c.hex)}
            />
          }
          trigger="click"
          open={colorPickerVisible}
          onOpenChange={setColorPickerVisible}
        >
          <Button size="small">🎨 Color</Button>
        </Popover>

        {/* Headings */}
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          type={editor.isActive('heading', { level: 2 }) ? 'primary' : 'default'}
        >
          H2
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          type={editor.isActive('heading', { level: 3 }) ? 'primary' : 'default'}
        >
          H3
        </Button>

        {/* Lists */}
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          type={editor.isActive('bulletList') ? 'primary' : 'default'}
        >
          • List
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          type={editor.isActive('orderedList') ? 'primary' : 'default'}
        >
          1. List
        </Button>

        {/* Media */}
        <Button size="small" onClick={addImage}>
          🖼️ Image
        </Button>
        <Button size="small" onClick={addYoutubeVideo}>
          YouTube
        </Button>

        {/* Text align */}
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          type={editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'}
        >
          ⬅️
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          type={editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'}
        >
          ↔️
        </Button>
        <Button
          size="small"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          type={editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'}
        >
          ➡️
        </Button>
      </Space>
    </div>
  );
}
