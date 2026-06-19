import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { list, save, destroy, fetchById, update } from "../service/paymentMethod"; 
import { PaymentMethod } from "../model/moviment.model";


export function usePaymentMethod() {
  const queryClient = useQueryClient();

  const listPaymentMethod = (params: any) => {
    return useQuery({
      queryKey: ["paymentMethods", params],
      queryFn: () => list(params),
    });
  };

  const fetchByIdPaymentMethod = (params: { id?: number }, enabled = true) => {
    return useQuery({
      queryKey: ["paymentMethodId", params.id],
      queryFn: () => fetchById(params.id!),
      enabled: enabled && !!params.id,
    });
  };

  const updatePaymentMethod = useMutation({
    mutationFn: (params: PaymentMethod) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const deletePaymentMethod = useMutation({
    mutationFn: (params: { id: number }) => destroy(params.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  const savePaymentMethod = useMutation({
    mutationFn: (params: PaymentMethod) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["paymentMethods"] });
    },
  });

  return {
    savePaymentMethod,
    deletePaymentMethod,
    listPaymentMethod,
    fetchByIdPaymentMethod,
    updatePaymentMethod,
  };
}