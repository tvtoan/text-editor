import { create } from 'zustand';
import type { Article } from '../../types/ckeditor/article';

interface ArticleStore {
  // Article management
  articles: Article[];
  selectedArticle: Article | null;

  // Editor state
  content: string;
  title: string;
  author: string;

  // Article actions
  setArticles: (articles: Article[]) => void;
  addArticle: (article: Article) => void;
  updateArticle: (id: string, article: Partial<Article>) => void;
  deleteArticle: (id: string) => void;
  setSelectedArticle: (article: Article | null) => void;

  // Editor actions
  setContent: (content: string) => void;
  setTitle: (title: string) => void;
  setAuthor: (author: string) => void;
  resetEditor: () => void;
  loadArticleToEditor: (article: Article) => void;
}

export const useArticleStore = create<ArticleStore>((set) => ({
  // Initial state
  articles: [],
  selectedArticle: null,
  content: '',
  title: '',
  author: '',

  // Article actions
  setArticles: (articles) => set({ articles }),

  addArticle: (article) =>
    set((state) => ({
      articles: [...state.articles, article],
    })),

  updateArticle: (id, updatedArticle) =>
    set((state) => ({
      articles: state.articles.map((a) => (a.id === id ? { ...a, ...updatedArticle } : a)),
    })),

  deleteArticle: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),

  setSelectedArticle: (article) => set({ selectedArticle: article }),

  // Editor actions
  setContent: (content) => set({ content }),

  setTitle: (title) => set({ title }),

  setAuthor: (author) => set({ author }),

  resetEditor: () =>
    set({
      content: '',
      title: '',
      author: '',
      selectedArticle: null,
    }),

  loadArticleToEditor: (article) =>
    set({
      content: article.content,
      title: article.title,
      author: article.author,
      selectedArticle: article,
    }),
}));
