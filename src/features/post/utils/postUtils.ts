import type { ApiPostContent, EditorPostContent } from '../types/postTypes';

export const apiToEditorContent = (content: ApiPostContent): EditorPostContent => {
  return content.map((block) => ({
    ...block,
    keyId: crypto.randomUUID(),
  }));
};

export const editorToApiContent = async (
  content: EditorPostContent,
  postId: string,
  uploadImage: (formData: FormData) => Promise<{ imageId: string }>
): Promise<ApiPostContent> => {
  const result: ApiPostContent = [];

  for (const block of content) {
    if (block.type === 'paragraph') {
      result.push({ type: 'paragraph', content: block.content });
    } else if (block.type === 'image') {
      if (block.file) {
        const formData = new FormData();
        formData.append('image', block.file);
        formData.append('postId', postId);
        const { imageId } = await uploadImage(formData);
        result.push({ type: 'image', id: imageId });
      } else if (block.id) {
        result.push({ type: 'image', id: block.id });
      }
    }
  }

  return result;
};

export const getImageIds = (content: ApiPostContent): string[] =>
  content.filter((b): b is { type: 'image'; id: string } => b.type === 'image').map((b) => b.id);
