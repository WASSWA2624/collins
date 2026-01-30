/**
 * useDepartment Hook
 * Actions memoized so list fetches once on mount/retry (no refetch every render).
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createDepartment,
  deleteDepartment,
  getDepartment,
  listDepartmentUnits,
  listDepartments,
  updateDepartment,
} from '@features/department';

const useDepartment = () => {
  const actions = useMemo(
    () => ({
      list: listDepartments,
      get: getDepartment,
      create: createDepartment,
      update: updateDepartment,
      remove: deleteDepartment,
      listUnits: listDepartmentUnits,
    }),
    []
  );
  return useCrud(actions);
};

export default useDepartment;
