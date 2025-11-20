import React, { useState } from 'react';
import { Button, ColorPicker, Select, Divider, message, Upload } from 'antd';
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  PictureOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Editor } from 'slate';
import axios from 'axios';

interface ToolbarProps {
  editor: Editor;
  onInsertImage: () => void;
  onInsertVideo: () => void;
  onInsertYoutube: () => void;
}

const CLOUDINARY_CLOUD_NAME = 'donbgiqo5';
const CLOUDINARY_UPLOAD_PRESET = 'text_editor';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

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

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
      return res.data.secure_url; // URL trả về từ Cloudinary
    } catch (err) {
      message.error('Upload thất bại');
      console.error(err);
      return null;
    }
  };

  const onInsertImage = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const url = await uploadToCloudinary(file);
      if (url) {
        // chèn vào editor
        Editor.insertText(editor, `![image](${url})`);
      }
    };
    input.click();
  };

  const onInsertVideo = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async () => {
      if (!input.files?.length) return;
      const file = input.files[0];
      const url = await uploadToCloudinary(file);
      if (url) {
        // chèn vào editor
        Editor.insertText(editor, `[video](${url})`);
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
