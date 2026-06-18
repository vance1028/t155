import type { DailyGoal, Food, MealPlanResult } from '@/types';

export interface MealPlannerStrategy {
  name: string;
  plan(foods: Food[], goal: DailyGoal): MealPlanResult;
}
