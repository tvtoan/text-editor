import { create } from 'zustand';
import { Article, CreateArticle } from '@/app/types/sunEditor/article';

interface ArticleStore {
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<CreateArticle>) => void;
  deleteArticle: (id: string) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  articles: [],
  setArticles: (articles) => set({ articles }),
  addArticle: (article) => set((state) => ({ articles: [...state.articles, article] })),
  updateArticle: (id, updates) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              updatedAt: new Date().toISOString().split('T')[0],
            }
          : a
      ),
    })),
  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
}));
