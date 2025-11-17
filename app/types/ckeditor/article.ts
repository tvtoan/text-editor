// Interface cho Article entity

export interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  status: 'published' | 'draft';
  createdAt: string;
}

// Interface cho form data khi tạo/sửa bài viết

export interface ArticleFormData {
  title: string;
  content: string;
  author: string;
}

// Type cho status của bài viết

export type ArticleStatus = 'published' | 'draft';

// Interface cho filter options trong bảng

export interface ArticleFilterParams {
  status?: ArticleStatus;
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

// Interface cho response từ API

export interface ArticleResponse {
  data: Article[];
  total: number;
  page: number;
  pageSize: number;
}

// Interface cho request tạo mới article

export interface CreateArticleRequest {
  title: string;
  content: string;
  author: string;
  status?: ArticleStatus;
}

// Interface cho request cập nhật article

export interface UpdateArticleRequest {
  title?: string;
  content?: string;
  author?: string;
  status?: ArticleStatus;
}
