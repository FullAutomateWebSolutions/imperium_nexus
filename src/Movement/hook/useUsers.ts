import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/user"; 
import { User } from "../model/moviment.model";

export function useUser() {
  const queryClient = useQueryClient();

  const listUser = (params: any) => {
    return useQuery({
      queryKey: ["Users", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdUser = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["UserId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updateUser = useMutation({
    mutationFn: (params: User) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });

  const deleteUser = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });

  const saveUser = useMutation({
    mutationFn: (params: User) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Users"] });
    },
  });

  return {
    saveUser,
    deleteUser,
    listUser,
    fetchByIdUser,
    updateUser,
  };
}