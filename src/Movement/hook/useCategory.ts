import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/category"; 
import { Category } from "../model/moviment.model"; // Ajuste os nomes dos tipos se necessário

export function useCategory() {
  const queryClient = useQueryClient();

  const listCategory = (params: any) => {
    return useQuery({
      queryKey: ["categories", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdCategory = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["categoryId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updateCategory = useMutation({
    mutationFn: (params: Category) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const saveCategory = useMutation({
    mutationFn: (params: Category) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  return {
    saveCategory,
    deleteCategory,
    listCategory,
    fetchByIdCategory,
    updateCategory,
  };
}