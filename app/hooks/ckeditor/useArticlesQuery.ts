import { useState, useEffect } from 'react';
import { articleService } from '../../services/ckeditor/articleService';
import type { Article } from '../../types/ckeditor/article';

export const useArticlesQuery = () => {
  const [data, setData] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const articles = await articleService.getArticles();
      setData(articles);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchArticles,
  };
};
