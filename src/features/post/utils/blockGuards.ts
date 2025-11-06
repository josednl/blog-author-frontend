import type { EditorPostContent, EditorImageBlock } from '../types/postTypes';

export const isEditorImageWithId = (
  block: EditorPostContent[number],
): block is EditorImageBlock & { id: string } =>
  block.type === 'image' && typeof block.id === 'string' && block.id.length > 0;

export const isEditorImageWithFile = (
  block: EditorPostContent[number],
): block is EditorImageBlock & { file: File } =>
  block.type === 'image' && block.file instanceof File;

export const isEditorImageBlock = (
  block: EditorPostContent[number],
): block is EditorImageBlock =>
  block.type === 'image';
