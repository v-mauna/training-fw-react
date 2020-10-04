import { useCallback } from 'react';
import apiInstance from '../core/apiInstance';
import { Tea } from '../shared/models';

export const useTea = () => {
  const getTeas = useCallback(async (): Promise<Tea[]> => {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories`;
    return await apiInstance.get(url);
  }, []);

  const getTeaById = async (id: number): Promise<Tea | undefined> => {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories/${id}`;
    return await apiInstance.get(url);
  };

  return { getTeas, getTeaById };
};

// export const useTea3 = () => {

//   const getAll = useCallback(async () => {
//     const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories`;
//     return await apiInstance.get(url);
//   }, []);

//   const getTea = async (id: number) => {
//     const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories/${id}`;
//     console.log(id);
//   };

//   return { getAll, getTea };
// };
