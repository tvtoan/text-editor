import { create } from 'zustand';
import { Article } from '@/app/types/slateJs/article';

interface EditorStore {
  currentArticle: Article | null;
  setCurrentArticle: (article: Article | null) => void;
  articles: Article[];
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, updates: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  currentArticle: null,
  setCurrentArticle: (article) => set({ currentArticle: article }),
  articles: [],
  setArticles: (articles) => set({ articles }),
  addArticle: (article) =>
    set((state) => ({
      articles: [...state.articles, article],
    })),
  updateArticle: (id, updates) =>
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    })),
  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
}));
