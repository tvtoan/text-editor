'use client';

import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import { message } from 'antd';
import { uploadToCloudinary } from '@/app/lib/cloudinary';
import { useMemo } from 'react';

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

  const handleImageUploadBefore = useMemo(
    () =>
      (files: File[], _info: any, uploadHandler: any): boolean => {
        const file = files[0];
        if (!file) {
          uploadHandler({ errorMessage: 'Không có file' });
          return false;
        }

        if (!file.type.startsWith('image/')) {
          messageApi.error('Vui lòng chọn file ảnh hợp lệ!');
          return false;
        }

        if (file.size > 5 * 1024 * 1024) {
          messageApi.error('Kích thước ảnh không được vượt quá 5MB!');
          return false;
        }

        (async () => {
          try {
            messageApi.loading('Đang tải ảnh lên...', 0);
            const result = await uploadToCloudinary(file, { resourceType: 'image' });

            if (!result) throw new Error('Upload thất bại');

            uploadHandler({
              result: [{ url: result.url, name: result.name, size: result.size }],
            });

            messageApi.destroy();
            messageApi.success('Thêm ảnh thành công!');
          } catch (err: any) {
            messageApi.destroy();
            messageApi.error(err.message || 'Tải ảnh lên thất bại!');
            uploadHandler({ errorMessage: err.message || 'Upload failed' });
          }
        })();

        return false;
      },
    [messageApi]
  );

  const handleVideoUploadBefore = useMemo(
    () =>
      (files: File[], _info: any, uploadHandler: any): boolean => {
        const file = files[0];
        if (!file) return false;

        if (!file.type.startsWith('video/')) {
          messageApi.error('Vui lòng chọn file video hợp lệ!');
          return false;
        }

        if (file.size > 50 * 1024 * 1024) {
          messageApi.error('Kích thước video không được vượt quá 50MB!');
          return false;
        }

        (async () => {
          try {
            messageApi.loading('Đang tải video lên (có thể mất vài giây)...', 0);
            const result = await uploadToCloudinary(file, { resourceType: 'video' });

            if (!result) throw new Error('Upload thất bại');

            uploadHandler({
              result: [{ url: result.url, name: result.name, size: result.size }],
            });

            messageApi.destroy();
            messageApi.success('Thêm video thành công!');
          } catch (err: any) {
            messageApi.destroy();
            messageApi.error('Tải video lên thất bại!');
            uploadHandler({ errorMessage: err.message || 'Upload failed' });
          }
        })();

        return false;
      },
    [messageApi]
  );

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
        }}
      />
    </>
  );
}
