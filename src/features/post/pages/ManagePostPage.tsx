import { useEffect, useState } from 'react';
import { postsAPI } from '../services/postsAPI';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import type { Post, ApiPostContent, EditorPostContent } from '../types/postTypes';
import { ReloadButton } from '@/shared/components/ReloadButton';
import { ImageIcon, Edit2, Trash2, X } from 'lucide-react';
import { PostEditor } from '../components/Editor';
import { apiToEditorContent, editorToApiContent, getImageIds } from '../utils/postUtils';
import { isEditorImageWithId } from '../utils/blockGuards';

type Props = { userId: string };

type EditingPostState = Omit<Post, 'content'> & { content: EditorPostContent };

export const ManagePostPage = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<EditingPostState | null>(null);
  const [originalContent, setOriginalContent] = useState<ApiPostContent | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getAllByUser(userId);
      setPosts(response);
    } catch {
      showErrorToast('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    try {
      setDeletingId(id);
      await postsAPI.delete(id);
      showSuccessToast('Post deleted');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showErrorToast('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditClick = (post: Post) => {
    setEditingPost({ ...post, content: apiToEditorContent(post.content) });
    setOriginalContent(post.content);
  };

  const handleCancelEdit = () => {
    setEditingPost(null);
    setOriginalContent(null);
  };

  const handleSave = async (updated: EditingPostState) => {
    if (!originalContent) return;
    try {
      setIsLoading(true);

      const prevImageIds = getImageIds(originalContent);
      const newImageIds = updated.content.filter(isEditorImageWithId).map(b => b.id);
      
      const removedImages = prevImageIds.filter((id) => !newImageIds.includes(id));

      await Promise.all(removedImages.map((id) => postsAPI.deleteImage(id)));

      const apiContent = await editorToApiContent(updated.content, updated.id, postsAPI.uploadImage);

      const payload = {
        title: updated.title,
        published: updated.published,
        content: apiContent,
      };

      const savedPost = await postsAPI.update(updated.id, payload);
      showSuccessToast('Post updated successfully');

      setPosts((prev) => prev.map((p) => (p.id === savedPost.id ? savedPost : p)));
      handleCancelEdit();
    } catch (err) {
      console.error(err);
      showErrorToast('Failed to update post');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && posts.length === 0)
    return <div className="text-center text-gray-500 p-8">Loading posts...</div>;

  if (posts.length === 0)
    return (
      <div className="text-center text-gray-500 p-8">
        You don’t have any posts yet.
        <ReloadButton onClick={fetchData} isLoading={isLoading} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Your Posts</h1>
        <ReloadButton onClick={fetchData} isLoading={isLoading} />
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => {
          const imageCount = post.content.filter((b) => b.type === 'image').length;
          const isDeleting = deletingId === post.id;
          return (
            <div
              key={post.id}
              className="rounded-lg border bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-1">
                  {post.title || 'Untitled'}
                </h2>
                <p className={`text-sm ${post.published ? 'text-green-600' : 'text-gray-500'}`}>
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
                    onClick={() => handleEditClick(post)}
                    disabled={isDeleting || isLoading}
                    className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
                  >
                    <Edit2 size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting || isLoading}
                    className={`flex items-center gap-1 px-3 py-1 rounded ${isDeleting
                        ? 'bg-red-100 text-red-400 cursor-not-allowed'
                        : 'bg-red-50 text-red-700 hover:bg-red-100'
                      }`}
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
              disabled={isLoading}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Post: {editingPost.title}</h2>

            <input
              type="text"
              value={editingPost.title}
              onChange={(e) => setEditingPost((p) => (p ? { ...p, title: e.target.value } : null))}
              className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />

            <div className="mb-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={editingPost.published}
                onChange={(e) =>
                  setEditingPost((p) => (p ? { ...p, published: e.target.checked } : null))
                }
                disabled={isLoading}
              />
              <label htmlFor="published" className="text-gray-700 dark:text-gray-200">
                Published
              </label>
            </div>

            <PostEditor
              value={editingPost.content}
              onChange={(newContent) =>
                setEditingPost((p) => (p ? { ...p, content: newContent } : null))
              }
              readOnly={isLoading}
            />

            <div className="flex justify-end mt-4 gap-2">
              <button
                onClick={handleCancelEdit}
                disabled={isLoading}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingPost)}
                disabled={isLoading}
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
