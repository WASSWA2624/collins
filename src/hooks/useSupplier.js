/**
 * useSupplier Hook
 * File: useSupplier.js
 */
import useCrud from '@hooks/useCrud';
import { createSupplier, deleteSupplier, getSupplier, listSuppliers, updateSupplier } from '@features/supplier';

const useSupplier = () =>
  useCrud({
    list: listSuppliers,
    get: getSupplier,
    create: createSupplier,
    update: updateSupplier,
    remove: deleteSupplier,
  });

export default useSupplier;
