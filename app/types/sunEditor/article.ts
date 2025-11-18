export type ArticleStatus = 'published' | 'draft';

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  status: ArticleStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateArticle {
  title: string;
  content: string;
  author: string;
  status: ArticleStatus;
}

export interface UpdateArticle {
  id: string;
  data: Partial<CreateArticle>;
}
