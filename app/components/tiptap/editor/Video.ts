import { Node, mergeAttributes } from '@tiptap/core';

export interface VideoOptions {
  HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoCustom: {
      /**
       * Insert a custom video node
       */
      setVideo: (options: { src: string; poster?: string }) => ReturnType;
    };
  }
}

export const Video = Node.create<VideoOptions>({
  name: 'videoCustom',

  group: 'block',
  atom: true,
  selectable: true,

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  /**
   * Video attributes
   */
  addAttributes() {
    return {
      src: {
        default: null,
      },
      poster: {
        default: null,
      },
    };
  },

  /**
   * Detect <video> tags when parsing HTML
   */
  parseHTML() {
    return [{ tag: 'video' }];
  },

  /**
   * How the video is rendered in the editor
   */
  renderHTML({ HTMLAttributes }) {
    return [
      'video',
      mergeAttributes(
        {
          controls: 'true',
          preload: 'metadata',
          style:
            'max-width:100%;border-radius:12px;margin:16px 0;display:block;box-shadow:0 4px 12px rgba(0,0,0,0.1);',
        },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      ['source', { src: HTMLAttributes.src, type: 'video/mp4' }],
    ];
  },

  /**
   * Custom command: editor.commands.setVideo()
   */
  addCommands() {
    return {
      setVideo:
        (options: { src: string; poster?: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
