import { useState } from 'react';
import { PostEditor, PostContent } from '../components/Editor';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { postsAPI } from '../services/postsAPI';

type Props = {
  userId: string;
}

export const NewPostPage = ({ userId }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState<PostContent>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('The title cannot be empty.');
      return;
    }

    const newPost = {
      title,
      content,
      published: false,
      authorId: userId,
    };

    try {
      setLoading(true);
      console.group(newPost);
      const saved = await postsAPI.create(newPost);
      console.log('Post saved:', saved);
      showSuccessToast('Post created successfully');
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
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Publish'}
      </button>
    </div>
  );
};
