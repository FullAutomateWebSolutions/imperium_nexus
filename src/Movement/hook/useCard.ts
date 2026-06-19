import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/card"; 
import { Card } from "../model/moviment.model";

export function useCard() {
  const queryClient = useQueryClient();

  const listCard = (params: any) => {
    return useQuery({
      queryKey: ["cards", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdCard = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["cardId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updateCard = useMutation({
    mutationFn: (params: Card) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const deleteCard = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  const saveCard = useMutation({
    mutationFn: (params: Card) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cards"] });
    },
  });

  return {
    saveCard,
    deleteCard,
    listCard,
    fetchByIdCard,
    updateCard,
  };
}