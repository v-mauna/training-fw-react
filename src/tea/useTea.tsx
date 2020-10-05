import { useCallback } from 'react';
import apiInstance from '../core/apiInstance';
import { Tea } from '../shared/models';

const images: Array<string> = [
  'green',
  'black',
  'herbal',
  'oolong',
  'dark',
  'puer',
  'white',
  'yellow',
];

export const useTea = () => {
  const getTeas = useCallback(async (): Promise<Tea[]> => {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories`;
    const { data } = await apiInstance.get(url);
    return data.map((item: any) => fromJsonToTea(item));
  }, []);

  const getTeaById = async (id: number): Promise<Tea | undefined> => {
    const url = `${process.env.REACT_APP_DATA_SERVICE}/tea-categories/${id}`;
    const { data } = await apiInstance.get(url);
    return fromJsonToTea(data);
  };

  const fromJsonToTea = (obj: any): Tea => {
    return {
      ...obj,
      image: require(`../assets/images/${images[obj.id - 1]}.jpg`),
    };
  };

  return { getTeas, getTeaById };
};
