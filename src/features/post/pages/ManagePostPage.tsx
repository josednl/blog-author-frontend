import { useEffect, useState } from 'react';
import { postsAPI } from '../services/postsAPI';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import type { Post, PostContent } from '../types/postTypes';
import { ReloadButton } from '@/shared/components/ReloadButton';
import { ImageIcon, Edit2, Trash2, X } from 'lucide-react';
import { PostEditor } from '../components/Editor';

type Props = {
  userId: string;
};

export const ManagePostPage = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [originalContent, setOriginalContent] = useState<PostContent | null>(null);


  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await postsAPI.getAllByUser(userId);
      setPosts(response);
    } catch {
      showErrorToast('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      setDeletingId(id);
      await postsAPI.delete(id);
      showSuccessToast('Post deleted successfully');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showErrorToast('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost(post);
    setOriginalContent(post.content);
  };

  const handleSave = async (content: PostContent) => {
    if (!editingPost) return;
    try {
      setLoading(true);

      const prevImages = (originalContent || [])
        .filter((b): b is { type: 'image'; id: string } => b.type === 'image' && 'id' in b && !!b.id)
        .map((b) => b.id);

      const newImages = (content || [])
        .filter((b) => b.type === 'image' && !!(b as any).id)
        .map((b) => (b as any).id!);

      const removedImages = prevImages.filter(
        (id) => id && !newImages.includes(id)
      );

      await Promise.all(
        removedImages.map((id) => postsAPI.deleteImage(id))
      );

      const updatedContent: PostContent = await Promise.all(
        content.map(async (block) => {
          if (block.type === 'paragraph') return block;
          if ((block as any).file) {
            const formData = new FormData();
            formData.append('image', (block as any).file);
            formData.append('postId', editingPost.id);
            const imageResp = await postsAPI.uploadImage(formData);
            return { type: 'image', id: imageResp.imageId };
          }
          return block;
        })
      );

      const payload = {
        title: editingPost.title,
        published: editingPost.published,
        content: updatedContent,
      };

      const updatedPost = await postsAPI.update(editingPost.id, payload);

      showSuccessToast('Post updated successfully!');
      setPosts((prev) =>
        prev.map((p) => (p.id === updatedPost.id ? updatedPost : p))
      );
      setEditingPost(null);
      setOriginalContent(null);
    } catch (error) {
      console.error('Error updating post:', error);
      showErrorToast('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  if (loading) {
    return <div className="text-center text-gray-500 p-8">Loading posts...</div>;
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
          const isDeleting = deletingId === post.id;

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
                  className={`text-sm font-medium ${post.published ? 'text-green-600' : 'text-gray-500'
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
                    onClick={() => handleEditClick(post)}
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    disabled={isDeleting}
                    className={`flex items-center gap-1 px-3 py-1 rounded transition ${isDeleting
                      ? 'bg-red-100 text-red-400 cursor-not-allowed'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
                    onClick={() => handleDelete(post.id!)}
                  >
                    <Trash2 size={14} />
                    <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 relative sm:p-8">
            <button
              onClick={handleCancelEdit}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Post</h2>

            <input
              type="text"
              value={editingPost.title}
              onChange={(e) =>
                setEditingPost((prev) =>
                  prev ? { ...prev, title: e.target.value } : null
                )
              }
              placeholder="Post title"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
            />

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={editingPost.published}
                onChange={(e) =>
                  setEditingPost((prev) =>
                    prev ? { ...prev, published: e.target.checked } : null
                  )
                }
              />
              <label htmlFor="published" className="text-gray-700 dark:text-gray-200">
                Published
              </label>
            </div>

            <PostEditor
              value={editingPost.content}
              onChange={(newContent) =>
                setEditingPost((prev) =>
                  prev ? { ...prev, content: newContent as PostContent } : null
                )
              }
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                onClick={() => handleSave(editingPost.content)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
