'use client';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import type { MessageInstance } from 'antd/es/message/interface';

type SunEditorCoreProps = {
  instance: (editor: any) => void;
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  message?: MessageInstance;
  readOnly?: boolean; // thêm prop readOnly
};

export default function SunEditorCore({
  instance,
  content,
  onChange,
  placeholder = 'Nhập nội dung...',
  message,
  readOnly = false,
}: SunEditorCoreProps) {
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const handleImageUploadBefore = (files: File[], info: any, uploadHandler: any) => {
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      message?.error('Vui lòng chọn file ảnh!');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      message?.error('Kích thước ảnh không được vượt quá 5MB!');
      return false;
    }
    fileToBase64(file)
      .then((base64) => {
        uploadHandler({
          result: [{ url: base64, name: file.name, size: file.size }],
        });
        message?.success('Thêm ảnh thành công!');
      })
      .catch((error) => {
        console.error('Image error:', error);
        message?.error('Không thể thêm ảnh!');
        uploadHandler({ errorMessage: 'Failed' });
      });

    return false;
  };

  const handleVideoUploadBefore = (files: File[], info: any, uploadHandler: any) => {
    const file = files[0];
    if (!file.type.startsWith('video/')) {
      message?.error('Vui lòng chọn file video!');
      return false;
    }
    if (file.size > 50 * 1024 * 1024) {
      message?.error('Kích thước video không được vượt quá 50MB!');
      return false;
    }
    fileToBase64(file)
      .then((base64) => {
        uploadHandler({
          result: [{ url: base64, name: file.name, size: file.size }],
        });
        message?.success('Thêm video thành công!');
      })
      .catch((error) => {
        console.error('Video error:', error);
        message?.error('Không thể thêm video!');
        uploadHandler({ errorMessage: 'Failed' });
      });

    return false;
  };

  return (
    <SunEditor
      getSunEditorInstance={(editor) => {
        instance(editor);
        if (readOnly) editor.readOnly(true); // bật chế độ chỉ xem
      }}
      setContents={content}
      onChange={onChange}
      placeholder={placeholder}
      height="350px"
      onImageUploadBefore={handleImageUploadBefore}
      onVideoUploadBefore={handleVideoUploadBefore}
      setOptions={{
        height: '100%',
        buttonList: readOnly
          ? [] // ẩn toolbar khi readOnly
          : [
              ['undo', 'redo'],
              ['font', 'fontSize', 'formatBlock'],
              ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript'],
              ['fontColor', 'hiliteColor', 'removeFormat'],
              ['outdent', 'indent'],
              ['align', 'list', 'lineHeight'],
              ['table', 'link', 'image', 'video'],
              ['fullScreen', 'showBlocks', 'codeView', 'preview'],
            ],
        imageFileInput: true,
        imageUrlInput: true,
        imageUploadSizeLimit: 5 * 1024 * 1024,
        imageAccept: '.jpg,.jpeg,.png,.gif,.webp',
        videoFileInput: true,
        videoUrlInput: true,
        videoUploadSizeLimit: 50 * 1024 * 1024,
        videoAccept: '.mp4,.webm,.ogg',
        youtubeQuery: 'autoplay=0&rel=0',
      }}
    />
  );
}
