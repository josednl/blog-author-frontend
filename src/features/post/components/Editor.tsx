import { useState } from 'react';

export type PostContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; id: string };

export type PostContent = PostContentBlock[];

interface PostEditorProps {
  value: PostContent;
  onChange: (value: PostContent) => void;
}

export const PostEditor = ({ value, onChange }: PostEditorProps) => {
  const [blocks, setBlocks] = useState<PostContent>(value);

  const updateBlocks = (newBlocks: PostContent) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addParagraph = () => {
    updateBlocks([...blocks, { type: 'paragraph', content: '' }]);
  };

  const addImage = () => {
    const imageId = prompt('Enter the image ID:');
    if (imageId) updateBlocks([...blocks, { type: 'image', id: imageId }]);
  };

  const updateParagraph = (index: number, newContent: string) => {
    const newBlocks = [...blocks];
    (newBlocks[index] as { type: 'paragraph'; content: string }).content = newContent;
    updateBlocks(newBlocks);
  };

  const removeBlock = (index: number) => {
    const newBlocks = blocks.filter((_, i) => i !== index);
    updateBlocks(newBlocks);
  };

  return (
    <div className="space-y-4">
      {blocks.map((block, i) => (
        <div key={i} className="relative border rounded p-2 bg-white">
          {block.type === 'paragraph' ? (
            <textarea
              value={block.content}
              onChange={(e) => updateParagraph(i, e.target.value)}
              placeholder="Write your text here..."
              className="w-full p-2 border-none focus:ring-0 resize-none"
            />
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={`/images/${block.id}`}
                alt={`Image ${block.id}`}
                className="max-w-full rounded"
              />
              <span className="text-xs text-gray-500 mt-1">{block.id}</span>
            </div>
          )}
          <button
            onClick={() => removeBlock(i)}
            className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
          >
            ✕
          </button>
        </div>
      ))}

      <div className="flex gap-2">
        <button
          onClick={addParagraph}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          + Text
        </button>
        <button
          onClick={addImage}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
        >
          + Image
        </button>
      </div>
    </div>
  );
};
