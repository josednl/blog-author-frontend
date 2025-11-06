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
};

export type EditorPostContent = (EditorParagraphBlock | EditorImageBlock)[];
