export type PostContentBlock =
  | { type: 'paragraph'; content: string }
  | { type: 'image'; id: string };

export type PostContent = PostContentBlock[];

export type Post = {
  id?: string;
  title: string;
  content: PostContent;
  published?: boolean;
  authorId?: string;
  createdAt?: string;
};
