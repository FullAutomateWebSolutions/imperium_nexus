import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Importe as funções do service de movimentação (ajuste o caminho do arquivo conforme seu projeto)
import { list, save, destroy, fetchById, update } from "../service/moviment"; 
import { MovementById, MovementDelete, MovementFilter, MovementType } from "../model/moviment.model";


export function useMovement() {
  const queryClient = useQueryClient();

  // Listagem de movimentações com filtros e paginação
  const listMovement = (params: MovementFilter) => {
    return useQuery({
      queryKey: ["movements", params],
      queryFn: () => list(params),
    });
  };

  // Busca de uma movimentação específica por ID (codmovimentacao)
  const fetchByIdMovement = (params: MovementById, enabled = true) => {
    return useQuery({
      queryKey: ["movementId", params.id],
      queryFn: () => fetchById(params),
      enabled: enabled && !!params.id,
    });
  };

  // Mutação para atualizar uma movimentação existente
  const updateMovement = useMutation({
    mutationFn: (params: MovementType) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
  });

  // Mutação para deletar uma movimentação
  const deleteMovement = useMutation({
    mutationFn: (params: MovementDelete) => destroy(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["movements"] });
    },
  });

  // Mutação para salvar uma nova movimentação
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