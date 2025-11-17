import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryResult,
  UseMutationResult,
} from '@tanstack/react-query';
import { Article, CreateArticle, UpdateArticleDto } from '../../types/tiptap/article';
import { articlesService } from '@/app/services/tiptap/articlesService';

export const useArticles = (): UseQueryResult<Article[], Error> => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: articlesService.getAll,
  });
};

export const useArticle = (id: string | null): UseQueryResult<Article, Error> => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesService.getById(id!),
    enabled: !!id,
  });
};

export const useCreateArticle = (): UseMutationResult<Article, Error, CreateArticle> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useUpdateArticle = (): UseMutationResult<Article, Error, UpdateArticleDto> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesService.update,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};

export const useDeleteArticle = (): UseMutationResult<{ id: string }, Error, string> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: articlesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
    },
  });
};
