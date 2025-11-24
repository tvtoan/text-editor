import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articleService } from '@/app/services/slateJs/articleService';
import { useEditorStore } from '@/app/store/slateJs/articleStore';
import { CreateArticle, UpdateArticle } from '@/app/types/slateJs/article';
import { useEffect } from 'react';

export const useArticles = () => {
  const queryClient = useQueryClient();
  const { articles, setArticles, addArticle, updateArticle, deleteArticle, setCurrentArticle } =
    useEditorStore();

  // Query: Lấy danh sách articles
  const { data: fetchedArticles, isLoading } = useQuery({
    queryKey: ['articles'],
    queryFn: articleService.getArticles,
    staleTime: 1000 * 60,
  });

  // Sync data từ API vào Zustand store
  useEffect(() => {
    if (fetchedArticles && fetchedArticles.length > 0) {
      setArticles(fetchedArticles);
    }
  }, [fetchedArticles, setArticles]);

  // Mutation: Tạo article mới
  const createMutation = useMutation({
    mutationFn: articleService.createArticle,
    onSuccess: (newArticle) => {
      addArticle(newArticle);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  // Mutation: Cập nhật article
  const updateMutation = useMutation({
    mutationFn: (dto: UpdateArticle) => articleService.updateArticle(dto),
    onSuccess: (updatedArticle) => {
      updateArticle(updatedArticle.id, updatedArticle);
      setCurrentArticle(updatedArticle);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  // Mutation: Xóa article
  const deleteMutation = useMutation({
    mutationFn: articleService.deleteArticle,
    onSuccess: (_, id) => {
      deleteArticle(id);
      setCurrentArticle(null);
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });

  return {
    articles, // Trả về từ Zustand store
    isLoading,
    create: (data: CreateArticle) => createMutation.mutate(data),
    update: (dto: UpdateArticle) => updateMutation.mutate(dto),
    remove: (id: string) => deleteMutation.mutate(id),
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};
