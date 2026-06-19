import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/status"; 
import { Status } from "../model/moviment.model";


export function useStatus() {
  const queryClient = useQueryClient();

  const listStatus = (params: any) => {
    return useQuery({
      queryKey: ["statusList", params], // "status" pode conflitar com estados internos do react-query, melhor usar "statusList"
      queryFn: () => list(params),
    });
  };

  const fetchByIdStatus = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["statusId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updateStatus = useMutation({
    mutationFn: (params: Status) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
    },
  });

  const deleteStatus = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
    },
  });

  const saveStatus = useMutation({
    mutationFn: (params: Status) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["statusList"] });
    },
  });

  return {
    saveStatus,
    deleteStatus,
    listStatus,
    fetchByIdStatus,
    updateStatus,
  };
}