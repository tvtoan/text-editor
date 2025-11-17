import { Article, CreateArticle, UpdateArticleDto } from '../../types/tiptap/article';
import { MOCK_ARTICLES } from '@/constants/tiptap/mockData';

const delay = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

let articlesCache: Article[] = [...MOCK_ARTICLES];

export const articlesService = {
  getAll: async (): Promise<Article[]> => {
    await delay(500);
    return [...articlesCache];
  },

  getById: async (id: string): Promise<Article> => {
    await delay(300);
    const article = articlesCache.find((article) => article.id === id);
    if (!article) throw new Error('Article not found');
    return article;
  },

  create: async (article: CreateArticle): Promise<Article> => {
    await delay(500);
    const newArticle: Article = {
      ...article,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    articlesCache.push(newArticle);
    return newArticle;
  },

  update: async ({ id, data }: UpdateArticleDto): Promise<Article> => {
    await delay(500);
    const index = articlesCache.findIndex((a) => a.id === id);
    if (index === -1) throw new Error('Article not found');

    articlesCache[index] = { ...articlesCache[index], ...data };
    return articlesCache[index];
  },

  delete: async (id: string): Promise<{ id: string }> => {
    await delay(300);
    articlesCache = articlesCache.filter((a) => a.id !== id);
    return { id };
  },
};
