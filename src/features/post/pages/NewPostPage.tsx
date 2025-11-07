import { useState } from 'react';
import { PostEditor } from '../components/Editor';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { postsAPI } from '../services/postsAPI';
import type {
  Post,
  ApiPostContent,
  ApiStoredContentBlock,
  EditorPostContent,
  EditorImageBlock,
} from '../types/postTypes';

type Props = {
  userId: string;
};

const isImageWithFile = (block: EditorPostContent[number]): block is EditorImageBlock & { file: File } =>
  block.type === 'image' && block.file instanceof File;

export const NewPostPage = ({ userId }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<EditorPostContent>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (publish: boolean) => {
    if (!title.trim()) {
      alert('The title cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      const initialPayload = {
        title,
        content: [] as ApiPostContent,
        published: publish,
        authorId: userId,
      };

      const createdPost = await postsAPI.create(initialPayload);
      const postId = createdPost.id ?? createdPost.data?.id;

      if (!postId) throw new Error('Post ID was not returned by the API.');

      const apiContent: ApiPostContent = (
        await Promise.all(
          content.map(async (block): Promise<ApiStoredContentBlock | null> => {
            if (block.type === 'paragraph') {
              return { type: 'paragraph', content: block.content };
            }

            if (isImageWithFile(block)) {
              const formData = new FormData();
              formData.append('image', block.file);
              formData.append('postId', postId);

              const { imageId } = await postsAPI.uploadImage(formData);
              return { type: 'image', id: imageId };
            }

            if (block.type === 'image' && block.id) {
              return { type: 'image', id: block.id };
            }

            return null;
          })
        )
      ).filter((b): b is ApiStoredContentBlock => b !== null);

      await postsAPI.update(postId, { content: apiContent, published: publish });

      showSuccessToast(publish ? 'Post published successfully!' : 'Draft saved successfully!');

      setTitle('');
      setContent([]);
    } catch (error) {
      // console.error('Error creating post:', error);
      showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-semibold mb-2">Create new post</h1>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        disabled={loading}
      />

      <PostEditor value={content} onChange={setContent} readOnly={loading} />

      <div className="flex gap-4">
        <button
          onClick={() => handleSubmit(false)}
          disabled={loading}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Save as Draft'}
        </button>

        <button
          onClick={() => handleSubmit(true)}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Processing...' : 'Publish Post'}
        </button>
      </div>
    </div>
  );
};
