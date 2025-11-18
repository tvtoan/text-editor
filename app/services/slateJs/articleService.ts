import { Article, CreateArticle, UpdateArticle } from '@/app/types/slateJs/article';
import { MOCK_ARTICLES } from '@/constants/slateJs/mockData';

export const articleService = {
  getArticles: async (): Promise<Article[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return [...MOCK_ARTICLES];
  },

  getArticle: async (id: string): Promise<Article> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const article = MOCK_ARTICLES.find((a) => a.id === id);
    if (!article) throw new Error('Article not found');
    return article;
  },

  createArticle: async (data: CreateArticle): Promise<Article> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newArticle: Article = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
    };
    MOCK_ARTICLES.push(newArticle);
    return newArticle;
  },

  updateArticle: async ({ id, data }: UpdateArticle): Promise<Article> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Article not found');

    MOCK_ARTICLES[index] = {
      ...MOCK_ARTICLES[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return MOCK_ARTICLES[index];
  },

  deleteArticle: async (id: string): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Article not found');

    MOCK_ARTICLES.splice(index, 1);
  },
};
