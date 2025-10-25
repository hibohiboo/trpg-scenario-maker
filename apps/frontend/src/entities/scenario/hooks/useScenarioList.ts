import type { Scenario } from '@trpg-scenario-maker/ui/scenario/types';
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/shared/lib/store';
import { getCountSample, readScenarioAction } from '../actions/scenarioActions';
import { scenariosSelector, scenarioSlice } from '../model/scenarioSlice';

export const useScenarioList = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(readScenarioAction());
    (async () => {
      console.log('scenario count', await getCountSample());
    })();
  }, [dispatch]);

  const scenarios = useAppSelector(scenariosSelector);
  const isLoading = useAppSelector(
    (state) => state[scenarioSlice.reducerPath].isLoading,
  );

  const handleClick = (scenario: Scenario) => {
    // TODO: 詳細画面への遷移実装
    console.log('Clicked scenario:', scenario.id);
    navigate(`/scenario/${scenario.id}`);
  };

  return {
    scenarios,
    isLoading,
    onClick: handleClick,
  };
};
