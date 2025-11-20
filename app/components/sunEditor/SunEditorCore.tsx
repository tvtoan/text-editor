'use client';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { message } from 'antd';

const CLOUDINARY_CLOUD_NAME = 'donbgiqo5';
const CLOUDINARY_UPLOAD_PRESET = 'text_editor';
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

type SunEditorCoreProps = {
  instance: (editor: any) => void;
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
};

export default function SunEditorCore({
  instance,
  content,
  onChange,
  placeholder = 'Nhập nội dung...',
  readOnly = false,
}: SunEditorCoreProps) {
  const [messageApi, contextHolder] = message.useMessage();
  const uploadToCloudinary = async (file: File, resourceType: 'image' | 'video' = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', resourceType); // quan trọng khi upload video

    const response = await fetch(CLOUDINARY_UPLOAD_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      name: file.name,
      size: file.size,
    };
  };

  // Xử lý upload ảnh
  const handleImageUploadBefore = (
    files: File[],
    info: object,
    uploadHandler: any // UploadBeforeHandler
  ) => {
    const file = files[0];

    if (!file) {
      uploadHandler({ errorMessage: 'No file selected' });
      return false;
    }

    if (!file.type.startsWith('image/')) {
      messageApi?.error('Vui lòng chọn file ảnh hợp lệ!');
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      messageApi?.error('Kích thước ảnh không được vượt quá 5MB!');
      return false;
    }

    // Dùng IIFE để dùng async/await mà không làm hàm trả về Promise
    (async () => {
      try {
        messageApi?.loading('Đang tải ảnh lên...', 0);
        const uploaded = await uploadToCloudinary(file, 'image');

        uploadHandler({
          result: [uploaded],
        });

        messageApi?.destroy();
        messageApi?.success('Thêm ảnh thành công!');
      } catch (err: any) {
        console.error('Image upload error:', err);
        messageApi?.destroy();
        messageApi?.error(err.message || 'Tải ảnh lên thất bại!');
        uploadHandler({ errorMessage: err.message || 'Upload failed' });
      }
    })();

    // Phải return false để chặn SunEditor tự động upload
    return false;
  };

  const handleVideoUploadBefore = (files: File[], info: object, uploadHandler: any) => {
    const file = files[0];

    if (!file) return false;

    if (!file.type.startsWith('video/')) {
      messageApi?.error('Vui lòng chọn file video hợp lệ!');
      return false;
    }

    if (file.size > 50 * 1024 * 1024) {
      messageApi?.error('Kích thước video không được vượt quá 50MB!');
      return false;
    }

    (async () => {
      try {
        messageApi?.loading('Đang tải video lên (có thể mất vài giây)...', 0);
        const uploaded = await uploadToCloudinary(file, 'video');

        uploadHandler({
          result: [uploaded],
        });

        messageApi?.destroy();
        messageApi?.success('Thêm video thành công!');
      } catch (err: any) {
        console.error('Video upload error:', err);
        messageApi?.destroy();
        messageApi?.error('Tải video lên thất bại!');
        uploadHandler({ errorMessage: err.message || 'Upload failed' });
      }
    })();

    return false;
  };

  return (
    <>
      {contextHolder}
      <SunEditor
        getSunEditorInstance={(editor) => {
          instance(editor);
          if (readOnly) editor.readOnly(true);
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
            ? []
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
          videoFileInput: true,
          videoUrlInput: true,
          youtubeQuery: 'autoplay=0&rel=0',
          // Không cần giới hạn kích thước ở đây nữa vì đã kiểm tra trong handler
        }}
      />
    </>
  );
}
