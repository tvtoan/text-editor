'use client';

import { forwardRef, useImperativeHandle, useRef } from 'react';
import SunEditorCore from './SunEditorCore';
import { message as antdMessage } from 'antd';

interface SunEditorWrapperProps {
  value?: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export const SunEditorWrapper = forwardRef<any, SunEditorWrapperProps>(
  ({ value = '', onChange, placeholder }, ref) => {
    const editorRef = useRef<any>(null);

    useImperativeHandle(ref, () => ({
      getContent: () => editorRef.current?.getContents() || '',
      setContent: (content: string) => editorRef.current?.setContents(content),
    }));

    return (
      <SunEditorCore
        instance={(editor) => {
          editorRef.current = editor;
        }}
        content={value}
        onChange={onChange}
        placeholder={placeholder}
        message={antdMessage}
      />
    );
  }
);

SunEditorWrapper.displayName = 'SunEditorWrapper';
