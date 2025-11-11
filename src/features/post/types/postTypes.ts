export type ApiParagraphBlock = {
  type: 'paragraph';
  content: string;
};

export type ApiImageBlock = {
  type: 'image';
  id: string;
};

export type ApiStoredContentBlock = ApiParagraphBlock | ApiImageBlock;
export type ApiPostContent = ApiStoredContentBlock[];

export type Post = {
  id: string;
  title: string;
  published: boolean;
  content: ApiPostContent;
  images: ImageInfo[];
};

export type ImageInfo = {
  id: string;
  url: string;
  originalName?: string;
};

export type EditorParagraphBlock = {
  type: 'paragraph';
  keyId: string;
  content: string;
};

export type EditorImageBlock = {
  type: 'image';
  keyId: string;
  id?: string;
  file?: File;
  url?: string;
  originalName?: string;
};

export type EditorPostContent = (EditorParagraphBlock | EditorImageBlock)[];
