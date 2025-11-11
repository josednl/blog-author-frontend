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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!file) return;

    setLoading(true);
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleImageLoad = () => setLoading(false);

  if (!url) return null;

  return (
    <div className="w-full max-w-full relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded animate-pulse min-h-[150px]">
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            Loading...
          </span>
        </div>
      )}
      <img
        src={url}
        alt="Preview"
        onLoad={handleImageLoad}
        className={`max-w-full rounded-lg object-contain transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'
          }`}
      />
    </div>
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
    <div className="space-y-4 max-w-4xl mx-auto">
      {value.map((block) => (
        <div
          key={block.keyId}
          className="relative rounded-xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 bg-[--color-light] dark:bg-[--color-dark] transition-colors duration-300"
        >
          {block.type === 'paragraph' ? (
            <textarea
              value={block.content}
              onChange={(e) => updateParagraph(block.keyId, e.target.value)}
              placeholder={readOnly ? "No content in this paragraph." : "Write your text here..."}
              className="w-full p-4 sm:p-6 text-base md:text-lg border-none focus:ring-2 focus:ring-accent outline-none resize-none bg-transparent text-gray-800 dark:text-[--color-light] transition-all duration-300 rounded-xl min-h-[100px]"
              rows={3}
              readOnly={readOnly}
              aria-label="Content paragraph"
            />
          ) : (
            isEditorImageBlock(block) && (
              <div className="flex flex-col items-center p-4 sm:p-6">
                {isEditorImageWithFile(block) ? (
                  <ImagePreview file={block.file} />
                ) : isEditorImageWithId(block) && block.url ? (
                  <img
                    src={block.url.startsWith('http') ? block.url : `${import.meta.env.VITE_API_URL}${block.url}`}
                    alt={block.originalName || `Image ${block.id}`}
                    className="max-w-full max-h-[400px] w-auto rounded-lg object-contain shadow-md"
                  />
                ) : (
                  <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg w-full text-center">
                    <span className="text-gray-500 dark:text-gray-400 text-sm italic">
                      Image pending upload or unavailable.
                    </span>
                  </div>
                )}
              </div>
            )
          )}

          {!readOnly && (
            <button
              onClick={() => removeBlock(block.keyId)}
              className="absolute top-2 right-2 p-2 text-gray-500 hover:text-white bg-white/70 dark:bg-gray-900/70 hover:bg-red-500 dark:hover:bg-red-600 rounded-full transition-all duration-300 shadow-md backdrop-blur-sm z-10"
              aria-label="Remove block"
              title="Remove block"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      ))}

      {!readOnly && (
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl justify-center items-center transition-all duration-300 hover:border-accent dark:hover:border-accent">
          <span className="text-gray-600 dark:text-gray-400 font-medium text-sm">Add block:</span>

          <button
            onClick={addParagraph}
            className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold px-4 py-2 rounded-lg text-sm transition-all duration-300 shadow-sm"
            aria-label="Add text paragraph"
          >
            <span className="mr-1">+</span> Text Paragraph
          </button>

          <label className="w-full sm:w-auto bg-accent hover:opacity-90 text-white font-semibold px-4 py-2 rounded-lg text-sm cursor-pointer transition-all duration-300 shadow-md shadow-accent/30">
            <span className="mr-1">+</span> Image
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) addImage(file);
                e.target.value = '';
              }}
              className="hidden"
              aria-label="Upload image file"
            />
          </label>
        </div>
      )}
    </div>
  );
};
