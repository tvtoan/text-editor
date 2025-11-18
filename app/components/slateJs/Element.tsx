import React from 'react';
import { RenderElementProps } from 'slate-react';

export const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'image':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <img src={element.url} alt="" style={{ maxWidth: '100%', display: 'block' }} />
          </div>
          {children}
        </div>
      );
    case 'video':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <video controls style={{ maxWidth: '100%' }}>
              <source src={element.url} />
            </video>
          </div>
          {children}
        </div>
      );
    case 'youtube':
      return (
        <div {...attributes}>
          <div contentEditable={false}>
            <iframe
              width="560"
              height="315"
              src={element.url}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ maxWidth: '100%', border: '0' }}
            />
          </div>
          {children}
        </div>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
};
