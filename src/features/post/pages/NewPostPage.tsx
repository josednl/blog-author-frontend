import { useState } from 'react';
import { PostEditor, PostContent } from '../components/Editor';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { postsAPI } from '../services/postsAPI';
import type { PostContent as ApiPostContent, PostContentBlock as ApiPostContentBlock } from '../types/postTypes';

type Props = {
  userId: string;
}

export const NewPostPage = ({ userId }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<PostContent>([]);
  const [published, setPublished] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('The title cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const postPayload = { title, content: [], published, authorId: userId };
      const savedPost = await postsAPI.create(postPayload);
      const postId = savedPost.data.id;

      const updatedContent: PostContent = await Promise.all(
        content.map(async (block) => {
          if (block.type === 'paragraph') return block;

          if (block.type === 'image' && block.file) {
            const formData = new FormData();
            formData.append('image', block.file);
            formData.append('postId', postId);

            const imageResp = await postsAPI.uploadImage(formData);
            return { type: 'image', id: imageResp.imageId };
          }

          return block;
        })
      );

      const apiContent: ApiPostContent = updatedContent.map((block) => {
        if (block.type === 'image') {
          return { type: 'image', id: (block as any).id! } as ApiPostContentBlock;
        }
        return block as unknown as ApiPostContentBlock;
      });

      await postsAPI.update(postId, { content: apiContent });

      showSuccessToast(published ? 'Post published successfully!' : 'Draft saved successfully!');
      setTitle('');
      setContent([]);
    } catch (error) {
      console.error('Error creating post: ', error);
      showErrorToast('Error creating post');
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
        className="w-full p-2 border rounded"
      />

      <PostEditor value={content} onChange={setContent} />

      <button
        type="button"
        onClick={() => setPublished(!published)}
        className={`px-3 py-1 rounded ${published
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
          }`}
      >
        {published ? 'Published ✓' : 'Save as draft'}
      </button>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save'}
      </button>
    </div>
  );
};
