import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/account"; 
import { Account } from "../model/moviment.model";

export function useAccount() {
  const queryClient = useQueryClient();

  const listAccount = (params: any) => {
    return useQuery({
      queryKey: ["accounts", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdAccount = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["accountId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updateAccount = useMutation({
    mutationFn: (params: Account) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const deleteAccount = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  const saveAccount = useMutation({
    mutationFn: (params: Account) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });

  return {
    saveAccount,
    deleteAccount,
    listAccount,
    fetchByIdAccount,
    updateAccount,
  };
}