/**
 * useFacility Hook
 * File: useFacility.js
 * Actions object is memoized so useCrud bound actions (list, get, etc.) are stable
 * and consumers (e.g. useFacilityListScreen) only fetch once on mount instead of every render.
 */
import { useMemo } from 'react';
import useCrud from '@hooks/useCrud';
import {
  createFacility,
  deleteFacility,
  getFacility,
  listFacilities,
  listFacilityBranches,
  updateFacility,
} from '@features/facility';

const useFacility = () => {
  const actions = useMemo(
    () => ({
      list: listFacilities,
      get: getFacility,
      create: createFacility,
      update: updateFacility,
      remove: deleteFacility,
      listBranches: listFacilityBranches,
    }),
    []
  );
  return useCrud(actions);
};

export default useFacility;
