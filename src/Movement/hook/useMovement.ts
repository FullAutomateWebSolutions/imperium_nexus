import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/moviment"; 
import { MovementById, MovementDelete, MovementFilter, MovementType } from "../model/moviment.model";


export function useMovement() {
  const queryClient = useQueryClient();

  const listMovement = (params: MovementFilter) => {
    return useQuery({
      queryKey: ["movements", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdMovement = (params: MovementById, enabled = true) => {
    return useQuery({
      queryKey: ["movementId", params.id],
      queryFn: () => fetchById(Number(params.id)),
      enabled: enabled && !!params.id,
    });
  };

  const updateMovement = useMutation({
    mutationFn: (params: MovementType) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
  });

  const deleteMovement = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
  });

  const saveMovement = useMutation({
    mutationFn: (params: MovementType) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
  });

  return {
    saveMovement,
    deleteMovement,
    listMovement,
    fetchByIdMovement,
    updateMovement,
  };
}