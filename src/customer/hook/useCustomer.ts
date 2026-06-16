import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {list,save,destroy,fetchByid,update } from "../service/customer";
import { CustomerById, CustomerDelete, CustomerFilter, CustomerType } from "../model/customer.model";

export function useCustomer() {
  const queryClient = useQueryClient();
 
  const  listCustomer = (params:CustomerFilter)=>{ 
  return  useQuery({ 
    queryKey: ["customers", params],  
    queryFn: ()=>list(params)
  })
}

const fetchByIdCustomer = ( params: CustomerById, enabled = true) => {
  return useQuery({
    queryKey: ["customerId", params.id],
    queryFn: () => fetchByid(params),
    enabled: enabled && !!params.id,
  });
};
  const updateCustumer = useMutation({
    mutationFn: (params: CustomerType) => update(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
  const deleteCustomer = useMutation({
    mutationFn: (params: CustomerDelete) => destroy(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
  const saveCustomer = useMutation({
    mutationFn: (params: CustomerType) => save(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  return { 
    // fetchList
    saveCustomer,deleteCustomer,listCustomer,fetchByIdCustomer,updateCustumer};
}

