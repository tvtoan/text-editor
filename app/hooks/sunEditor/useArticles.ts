import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '@/app/services/sunEditor/articlesService';
import { useArticleStore } from '@/app/store/sunEditor/articleStore';
import { Article, CreateArticle, UpdateArticle } from '@/app/types/sunEditor/article';
import { useEffect } from 'react';

export const useArticles = () => {
  const queryClient = useQueryClient();
  const { articles, setArticles, addArticle, updateArticle, deleteArticle } = useArticleStore();

  const { data: fetchedArticles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: articleService.getAll,
    staleTime: 1000 * 60,
  });

  useEffect(() => {
    if (fetchedArticles && fetchedArticles.length > 0) {
      setArticles(fetchedArticles);
    }
  }, [fetchedArticles, setArticles]);

  const createMutation = useMutation({
    mutationFn: articleService.create,
    onSuccess: (newArticle) => {
      addArticle(newArticle);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (dto: UpdateArticle) => articleService.update(dto),
    onSuccess: (updatedArticle) => {
      updateArticle(updatedArticle.id, updatedArticle);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: articleService.delete,
    onSuccess: (_, id) => {
      deleteArticle(id);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    articles, // Trả về từ Zustand store
    isLoading,
    create: (data: CreateArticle) => createMutation.mutate(data),
    update: (dto: UpdateArticle) => updateMutation.mutate(dto),
    remove: (id: string) => deleteMutation.mutate(id),
  };
};
