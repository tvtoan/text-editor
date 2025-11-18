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
import { Editor } from 'slate';

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertYoutube: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  editor,
  onInsertImage,
  onInsertVideo,
  onInsertYoutube,
}) => {
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

      <Button icon={<PictureOutlined />} onClick={onInsertImage}>
        Ảnh
      </Button>
      <Button icon={<VideoCameraOutlined />} onClick={onInsertVideo}>
        Video
      </Button>
      <Button icon={<YoutubeOutlined />} onClick={onInsertYoutube}>
        YouTube
      </Button>
    </div>
  );
};
