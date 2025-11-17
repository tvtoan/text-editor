'use client';

import React from 'react';
import { CKEditor } from './CKEditor';

interface CKEditorWrapperProps {
  value: string;
  onChange: (data: string) => void;
}

export const CKEditorWrapper: React.FC<CKEditorWrapperProps> = ({ value, onChange }) => {
  return <CKEditor value={value} onChange={onChange} />;
};
