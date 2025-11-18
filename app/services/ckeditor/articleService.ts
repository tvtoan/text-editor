import { MOCK_ARTICLES } from '@/constants/ckeditor/mockData';
import type { Article } from '../../types/ckeditor/article';

export const articleService = {
  // Giả lập API call với delay
  getArticles: async (): Promise<Article[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...MOCK_ARTICLES]);
      }, 500);
    });
  },

  getArticleById: async (id: string): Promise<Article | undefined> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(MOCK_ARTICLES.find((a) => a.id === id));
      }, 300);
    });
  },

  createArticle: async (article: Omit<Article, 'id'>): Promise<Article> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newArticle = {
          ...article,
          id: Date.now().toString(),
        };
        resolve(newArticle);
      }, 500);
    });
  },

  updateArticle: async (id: string, article: Partial<Article>): Promise<Article> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const updated = { ...MOCK_ARTICLES.find((a) => a.id === id)!, ...article };
        resolve(updated);
      }, 500);
    });
  },

  deleteArticle: async (id: string): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  },
};
