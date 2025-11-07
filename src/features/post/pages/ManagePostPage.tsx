import { useEffect, useState } from 'react';
import { postsAPI } from '../services/postsAPI';
import { showErrorToast } from '@/shared/components/showErrorToast';
import { showSuccessToast } from '@/shared/components/showSuccessToast';
import type { Post, ApiPostContent, EditorPostContent } from '../types/postTypes';
import { ReloadButton } from '@/shared/components/ReloadButton';
import { ImageIcon, Edit2, Trash2, X, AlertTriangle } from 'lucide-react';
import { PostEditor } from '../components/Editor';
import { apiToEditorContent, editorToApiContent, getImageIds } from '../utils/postUtils';
import { isEditorImageWithId } from '../utils/blockGuards';

type Props = { userId: string };
type EditingPostState = Omit<Post, 'content'> & { content: EditorPostContent };

export const ManagePostPage = ({ userId }: Props) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<EditingPostState | null>(null);
  const [originalContent, setOriginalContent] = useState<ApiPostContent | null>(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = await postsAPI.getAllByUser(userId);
      setPosts(response);
    } catch {
      showErrorToast('Error loading posts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      setDeletingId(id);
      await postsAPI.delete(id);
      showSuccessToast('Post successfully deleted');
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      showErrorToast('Error deleting post');
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
      setIsSaving(true);

      const prevImageIds = getImageIds(originalContent);
      const newImageIds = updated.content.filter(isEditorImageWithId).map((b) => b.id);
      const removedImages = prevImageIds.filter((id) => !newImageIds.includes(id));

      await Promise.all(removedImages.map((id) => postsAPI.deleteImage(id)));

      const apiContent = await editorToApiContent(updated.content, updated.id, postsAPI.uploadImage);

      const payload = {
        title: updated.title,
        published: updated.published,
        content: apiContent,
      };

      const savedPost = await postsAPI.update(updated.id, payload);
      showSuccessToast('Post successfully updated');

      setPosts((prev) => prev.map((p) => (p.id === savedPost.id ? savedPost : p)));
      handleCancelEdit();
    } catch (err) {
      // console.error(err);
      showErrorToast(err);
    } finally {
      setIsSaving(false);
    }
  };

  const isOperationInProgress = isLoading || isSaving;

  if (isLoading && posts.length === 0)
    return (
      <div className="flex items-center justify-center min-h-[60vh] text-gray-500 dark:text-gray-400 text-lg">
        Loading posts...
      </div>
    );

  if (posts.length === 0 && !isLoading)
    return (
      <div className="flex flex-col items-center text-center p-8 space-y-4 rounded-2xl bg-light/60 dark:bg-dark/70 max-w-md mx-auto border border-dashed border-gray-300 dark:border-gray-700">
        <AlertTriangle size={36} className="text-accent" />
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          You don’t have any posts yet
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Create your first post to see it listed here.
        </p>
        <ReloadButton onClick={fetchData} isLoading={isLoading} />
      </div>
    );

  return (
    <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen transition-colors duration-300">

      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 mb-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-light">
          Content Manager
        </h1>
        <ReloadButton onClick={fetchData} isLoading={isLoading} />
      </header>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {posts.map((post) => {
          const imageCount = post.content.filter((b) => b.type === 'image').length;
          const isDeleting = deletingId === post.id;
          const isDraft = !post.published;

          const statusClasses = isDraft
            ? 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
            : 'bg-green-100 dark:bg-green-900/60 text-green-800 dark:text-green-300';

          return (
            <article
              key={post.id}
              className="rounded-xl bg-light dark:bg-dark shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-accent/50 flex flex-col"
            >
              <div className="p-5 flex-grow">
                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full mb-3 ${statusClasses}`}>
                  {isDraft ? 'Draft' : 'Published'}
                </span>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-3">
                  {post.title || 'Untitled post'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <ImageIcon size={16} className="text-accent" />
                  <span>{imageCount} {imageCount === 1 ? 'image' : 'images'}</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 p-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEditClick(post)}
                  disabled={isDeleting || isOperationInProgress}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent text-white font-semibold text-sm shadow-md hover:brightness-110 transition disabled:opacity-50"
                >
                  <Edit2 size={16} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(post.id)}
                  disabled={isDeleting || isOperationInProgress}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold text-sm transition ${
                    isDeleting
                      ? 'bg-red-200 text-red-600 cursor-not-allowed'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                  }`}
                >
                  <Trash2 size={16} />
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          );
        })}
      </section>

      {editingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80 backdrop-blur-sm p-4 transition-opacity">
          <div className="bg-light dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
            
            <div className="sticky top-0 p-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-inherit">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                Editing: {editingPost.title || 'Untitled'}
              </h2>
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 rounded-full transition"
              >
                <X size={22} />
              </button>
            </div>

            <div className="overflow-y-auto flex-grow p-5 space-y-5">
              <label className="block">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Post title</span>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost((p) => (p ? { ...p, title: e.target.value } : null))
                  }
                  placeholder="Write the title..."
                  disabled={isSaving}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent dark:bg-gray-700 dark:border-gray-600 dark:text-white transition"
                />
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={editingPost.published}
                  onChange={(e) =>
                    setEditingPost((p) => (p ? { ...p, published: e.target.checked } : null))
                  }
                  disabled={isSaving}
                  className="h-4 w-4 text-accent border-gray-300 rounded focus:ring-accent dark:bg-gray-700 dark:border-gray-600"
                />
                <span className="text-gray-700 dark:text-gray-200">Mark as Published</span>
              </label>

              <PostEditor
                value={editingPost.content}
                onChange={(newContent) =>
                  setEditingPost((p) => (p ? { ...p, content: newContent } : null))
                }
                readOnly={isSaving}
              />
            </div>

            <div className="sticky bottom-0 p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 bg-inherit">
              <button
                onClick={handleCancelEdit}
                disabled={isSaving}
                className="px-5 py-2 rounded-lg font-semibold bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingPost)}
                disabled={isSaving}
                className="px-6 py-2 rounded-lg font-semibold bg-accent text-white hover:brightness-110 disabled:opacity-50 transition shadow-md shadow-accent/40"
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
