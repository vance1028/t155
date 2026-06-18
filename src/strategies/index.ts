import { greedyPlanner } from './greedyPlanner';
import type { MealPlannerStrategy } from './types';

export const strategies: Record<string, MealPlannerStrategy> = {
  greedy: greedyPlanner,
};

export const defaultStrategy = 'greedy';

export * from './types';
