import { MOCK_ARTICLES } from '@/constants/sunEditor/mockData';
import { Article, CreateArticle, UpdateArticle } from '@/app/types/sunEditor/article';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const articleService = {
  getAll: async (): Promise<Article[]> => {
    await delay(500);
    return [...MOCK_ARTICLES];
  },

  getById: async (id: string): Promise<Article | null> => {
    await delay(300);
    return MOCK_ARTICLES.find((a) => a.id === id) || null;
  },

  create: async (payload: CreateArticle): Promise<Article> => {
    await delay(600);
    const newArticle: Article = {
      ...payload,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };
    MOCK_ARTICLES.push(newArticle);
    return newArticle;
  },

  update: async ({ id, data }: UpdateArticle): Promise<Article> => {
    await delay(500);
    const index = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Article not found');

    MOCK_ARTICLES[index] = {
      ...MOCK_ARTICLES[index],
      ...data,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    return MOCK_ARTICLES[index];
  },

  delete: async (id: string): Promise<void> => {
    await delay(400);
    const index = MOCK_ARTICLES.findIndex((a) => a.id === id);
    if (index !== -1) MOCK_ARTICLES.splice(index, 1);
  },
};
