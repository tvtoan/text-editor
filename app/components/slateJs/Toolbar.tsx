import React, { useState } from 'react';
import { Button, ColorPicker, Select, Divider } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  PictureOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Editor, Transforms } from 'slate';
import { uploadToCloudinary } from '@/app/lib/cloudinary';

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertYoutube: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, onInsertYoutube }) => {
  const [color, setColor] = useState('#000000');
  const [fontSize, setFontSize] = useState('16px');
  const [fontFamily, setFontFamily] = useState('Arial');

  const toggleFormat = (format: 'bold' | 'italic' | 'underline') => {
    const isActive = Editor.marks(editor)?.[format];
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const applyColor = (colorValue: string) => {
    setColor(colorValue);
    Editor.addMark(editor, 'color', colorValue);
  };

  const applyFontSize = (size: string) => {
    setFontSize(size);
    Editor.addMark(editor, 'fontSize', size);
  };

  const applyFontFamily = (family: string) => {
    setFontFamily(family);
    Editor.addMark(editor, 'fontFamily', family);
  };

  const handleInsertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      const file = files[0];
      const result = await uploadToCloudinary(file, {
        resourceType: 'image',
      });

      if (result) {
        // Chèn image node vào editor
        const imageNode = {
          type: 'image' as const,
          url: result.url,
          children: [{ text: '' }],
        };

        Transforms.insertNodes(editor, imageNode);

        // Thêm paragraph trống phía sau để tiếp tục nhập
        Transforms.insertNodes(editor, {
          type: 'paragraph' as const,
          children: [{ text: '' }],
        });
      }
    };

    input.click();
  };

  const handleInsertVideo = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';

    input.onchange = async (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (!files?.length) return;

      const file = files[0];
      const result = await uploadToCloudinary(file, {
        resourceType: 'video',
      });

      if (result) {
        const videoNode = {
          type: 'video' as const,
          url: result.url,
          children: [{ text: '' }],
        };

        Transforms.insertNodes(editor, videoNode);

        // Thêm paragraph trống phía sau
        Transforms.insertNodes(editor, {
          type: 'paragraph' as const,
          children: [{ text: '' }],
        });
      }
    };

    input.click();
  };

  return (
    <div
      style={{
        padding: '10px',
        borderBottom: '1px solid #d9d9d9',
        display: 'flex',
        gap: '8px',
        flexWrap: 'wrap',
        background: '#fafafa',
      }}
    >
      <Button
        icon={<BoldOutlined />}
        onClick={() => toggleFormat('bold')}
        type={Editor.marks(editor)?.bold ? 'primary' : 'default'}
      />
      <Button
        icon={<ItalicOutlined />}
        onClick={() => toggleFormat('italic')}
        type={Editor.marks(editor)?.italic ? 'primary' : 'default'}
      />
      <Button
        icon={<UnderlineOutlined />}
        onClick={() => toggleFormat('underline')}
        type={Editor.marks(editor)?.underline ? 'primary' : 'default'}
      />

      <Divider type="vertical" />

      <Select
        value={fontFamily}
        onChange={applyFontFamily}
        style={{ width: 120 }}
        options={[
          { value: 'Arial', label: 'Arial' },
          { value: 'Times New Roman', label: 'Times New Roman' },
          { value: 'Courier New', label: 'Courier New' },
          { value: 'Georgia', label: 'Georgia' },
          { value: 'Verdana', label: 'Verdana' },
        ]}
      />

      <Select
        value={fontSize}
        onChange={applyFontSize}
        style={{ width: 80 }}
        options={[
          { value: '12px', label: '12px' },
          { value: '14px', label: '14px' },
          { value: '16px', label: '16px' },
          { value: '18px', label: '18px' },
          { value: '20px', label: '20px' },
          { value: '24px', label: '24px' },
        ]}
      />

      <ColorPicker value={color} onChange={(_, hex) => applyColor(hex)} />

      <Divider type="vertical" />

      <Button icon={<PictureOutlined />} onClick={handleInsertImage}>
        Ảnh
      </Button>
      <Button icon={<VideoCameraOutlined />} onClick={handleInsertVideo}>
        Video
      </Button>
      <Button icon={<YoutubeOutlined />} onClick={onInsertYoutube}>
        YouTube
      </Button>
    </div>
  );
};
