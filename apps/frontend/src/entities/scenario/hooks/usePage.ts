import { useAppSelector } from '@/shared/lib/store';
import { scenariosSelector } from '../model/scenarioSlice';

export const usePage = () => {
  const scenarios = useAppSelector(scenariosSelector);
  return {
    scenarios,
  };
};
