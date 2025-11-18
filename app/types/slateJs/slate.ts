import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { HistoryEditor } from 'slate-history';

export type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  fontSize?: string;
  fontFamily?: string;
};

export type ImageElement = {
  type: 'image';
  url: string;
  children: CustomText[];
};

export type VideoElement = {
  type: 'video';
  url: string;
  children: CustomText[];
};

export type YoutubeElement = {
  type: 'youtube';
  url: string;
  children: CustomText[];
};

export type ParagraphElement = {
  type: 'paragraph';
  children: CustomText[];
};

export type CustomElement = ParagraphElement | ImageElement | VideoElement | YoutubeElement;

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
