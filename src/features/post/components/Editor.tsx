import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type {
  EditorPostContent,
  EditorParagraphBlock,
  EditorImageBlock,
} from '../types/postTypes';
import {
  isEditorImageBlock,
  isEditorImageWithId,
  isEditorImageWithFile
} from '../utils/blockGuards';

interface PostEditorProps {
  value: EditorPostContent;
  onChange: (value: EditorPostContent) => void;
  readOnly?: boolean;
}

const ImagePreview = ({ file }: { file: File }) => {
  const [url, setUrl] = useState<string>();

  useEffect(() => {
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  if (!url) return null;

  return (
    <img
      src={url}
      alt="Preview"
      className="max-w-full rounded object-contain"
    />
  );
};

export const PostEditor = ({ value, onChange, readOnly = false }: PostEditorProps) => {
  
  const updateBlocks = (newBlocks: EditorPostContent) => {
    onChange(newBlocks);
  };

  const addParagraph = () => {
    const newBlock: EditorParagraphBlock = {
      type: 'paragraph',
      content: '',
      keyId: uuidv4(),
    };
    updateBlocks([...value, newBlock]);
  };

  const addImage = (file: File) => {
    const newBlock: EditorImageBlock = {
      type: 'image',
      file,
      keyId: uuidv4(),
    };
    updateBlocks([...value, newBlock]);
  };

  const updateParagraph = (keyId: string, newContent: string) => {
    const newBlocks = value.map((block) =>
      block.type === 'paragraph' && block.keyId === keyId
        ? { ...block, content: newContent }
        : block
    );
    updateBlocks(newBlocks);
  };

  const removeBlock = (keyId: string) => {
    const newBlocks = value.filter((block) => block.keyId !== keyId);
    updateBlocks(newBlocks);
  };

  return (
    <div className="space-y-4">
      {value.map((block) => (
        <div
          key={block.keyId}
          className="relative border rounded p-2 bg-white dark:bg-gray-800"
        >
          {block.type === 'paragraph' ? (
            <textarea
              value={block.content}
              onChange={(e) => updateParagraph(block.keyId, e.target.value)}
              placeholder="Write your text here..."
              className="w-full p-2 border-none focus:ring-0 outline-none resize-none dark:bg-gray-800 dark:text-white"
              rows={3}
              readOnly={readOnly}
            />
          ) : (
            isEditorImageBlock(block) && (
              <div className="flex flex-col items-center p-2">
                {isEditorImageWithFile(block) ? (
                  <ImagePreview file={block.file} />
                ) : isEditorImageWithId(block) ? (
                  <img
                    src={`/images/${block.id}`}
                    alt={`Image ${block.id}`}
                    className="max-w-full rounded object-contain"
                  />
                ) : (
                  <span className="text-gray-500 text-sm italic">
                    Pending upload...
                  </span>
                )}
              </div>
            )
          )}

          {!readOnly && (
            <button
              onClick={() => removeBlock(block.keyId)}
              className="absolute top-1 right-1 text-gray-400 hover:text-red-500 p-1 rounded"
              aria-label="Remove block"
              title="Remove block"
            >
              ✕
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex gap-2 p-2 border rounded border-dashed justify-center">
          <button
            onClick={addParagraph}
            className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm transition"
            aria-label="Add text paragraph"
          >
            + Text
          </button>

          <label className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm cursor-pointer transition">
            + Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addImage(file);
                e.target.value = '';
              }}
              className="hidden"
            />
          </label>
        </div>
      )}
    </div>
  );
};
