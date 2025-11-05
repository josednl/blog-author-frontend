import { useEffect, useState } from 'react';
import { postsAPI } from '../services/postsAPI';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import type { Post } from '../types/postTypes';
import { ReloadButton } from '@/shared/components/ReloadButton';
import { ImageIcon, Edit2, Trash2 } from 'lucide-react'; // opcional si usas lucide o heroicons

type Props = {
  userId: string;
};

export const ManagePostPage = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllByUser(userId);
      setPosts(response);
    } catch (err) {
      showErrorToast('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  if (loading) {
    return <div className="text-center text-gray-500 p-8">Loading posts...</div>;
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-8">
        {error}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        You don’t have any posts yet.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Your Posts
          </h1>
          <ReloadButton onClick={fetchData} isLoading={loading} />
        </div>
      </section>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const imageCount = post.content?.filter((b) => b.type === 'image').length || 0;
          return (
            <div
              key={post.id}
              className="rounded-lg border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {post.title || 'Untitled post'}
                </h2>
                <p
                  className={`text-sm font-medium ${
                    post.published ? 'text-green-600' : 'text-gray-500'
                  }`}
                >
                  {post.published ? 'Published' : 'Draft'}
                </p>
              </div>

              <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ImageIcon size={16} className="text-gray-400" />
                  <span>{imageCount} {imageCount === 1 ? 'image' : 'images'}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 transition"
                    onClick={() => console.log('Edit', post.id)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded hover:bg-red-100 transition"
                    onClick={() => console.log('Delete', post.id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
