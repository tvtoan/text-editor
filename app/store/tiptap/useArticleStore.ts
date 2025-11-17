import { create } from 'zustand';
import { Article } from '@/app/types/tiptap/article';

interface ArticleStore {
  selectedArticleId: string | null;
  setSelectedArticleId: (id: string) => void;
  clearSelectedArticle: () => void;
  editingArticle: Article | null;
  setEditingArticle: (article: Article | null) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  selectedArticleId: null,
  editingArticle: null,
  setSelectedArticleId: (id: string) => set({ selectedArticleId: id }),
  clearSelectedArticle: () => set({ selectedArticleId: null }),
  setEditingArticle: (article: Article | null) => set({ editingArticle: article }),
}));
