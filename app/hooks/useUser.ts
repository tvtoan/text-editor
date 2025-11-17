import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { User } from '../types/user';

export const useUsers = (page: number, search: string) =>
  useQuery({
    queryKey: ['users', page, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (search) params.append('search', search);
      const { data } = await axios.get(`/api/users?${params.toString()}`);
      return data;
    },
    placeholderData: (prev) => prev,
  });

export const useAddUser = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (newUser: Omit<User, 'id'>) => axios.post(`/api/users`, newUser),
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};

export const useDeleteUser = () => {
  const QueryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => axios.delete(`/api/users?id=${id}`),
    onSuccess: () => QueryClient.invalidateQueries({ queryKey: ['users'] }),
  });
};
