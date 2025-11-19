import { RenderLeafProps } from 'slate-react';

export const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  let styledChildren = children;

  if (leaf.bold) {
    styledChildren = <strong>{styledChildren}</strong>;
  }

  if (leaf.italic) {
    styledChildren = <em>{styledChildren}</em>;
  }

  if (leaf.underline) {
    styledChildren = <u>{styledChildren}</u>;
  }

  return (
    <span
      {...attributes}
      style={{
        color: leaf.color,
        fontSize: leaf.fontSize,
        fontFamily: leaf.fontFamily,
      }}
    >
      {styledChildren}
    </span>
  );
};
