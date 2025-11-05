import { useEffect, useState } from 'react';

export type PostContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; id?: string; file?: File };

export type PostContent = PostContentBlock[];

interface PostEditorProps {
  value: PostContent;
  onChange: (value: PostContent) => void;
}

export const PostEditor = ({ value, onChange }: PostEditorProps) => {
  const [blocks, setBlocks] = useState<PostContent>(value);

  useEffect(() => {
    setBlocks(value);
  }, [value]);

  const updateBlocks = (newBlocks: PostContent) => {
    setBlocks(newBlocks);
    onChange(newBlocks);
  };

  const addParagraph = () => {
    updateBlocks([...blocks, { type: 'paragraph', content: '' }]);
  };

  const addImage = (file: File) => {
    updateBlocks([...blocks, { type: 'image', file }]);
  };

  const updateParagraph = (index: number, newContent: string) => {
    const newBlocks = [...blocks];
    if (newBlocks[index].type === 'paragraph') {
      newBlocks[index] = { ...newBlocks[index], content: newContent };
      updateBlocks(newBlocks);
    }
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
              className="w-full p-2 border-none focus:ring-0 outline-none resize-none"
            />
          ) : (
            <div className="flex flex-col items-center">
              {block.file ? (
                <img
                  src={URL.createObjectURL(block.file)}
                  alt="Preview"
                  className="max-w-full rounded"
                />
              ) : block.id ? (
                <img
                  src={`/images/${block.id}`}
                  alt={`Image ${block.id}`}
                  className="max-w-full rounded"
                />
              ) : (
                <span className="text-gray-500 text-sm">Pending upload...</span>
              )}
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
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files && addImage(e.target.files[0])}
          className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded cursor-pointer"
        />
      </div>
    </div>
  );
};
