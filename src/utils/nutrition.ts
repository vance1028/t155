import type { Food, MealItem, NutritionSummary } from '@/types';

export const ENERGY_PER_GRAM = {
  protein: 4,
  fat: 9,
  carbs: 4,
} as const;

export function scaleNutrient(per100g: number, amount: number): number {
  return (per100g * amount) / 100;
}

export function computeItemNutrition(item: MealItem, food: Food) {
  return {
    calories: scaleNutrient(food.calories, item.amount),
    protein: scaleNutrient(food.protein, item.amount),
    fat: scaleNutrient(food.fat, item.amount),
    carbs: scaleNutrient(food.carbs, item.amount),
    sodium: scaleNutrient(food.sodium, item.amount),
    fiber: scaleNutrient(food.fiber, item.amount),
  };
}

export function summarizeNutrition(items: MealItem[], foods: Food[]): NutritionSummary {
  const foodMap = new Map(foods.map((f) => [f.id, f]));

  let totalCalories = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalCarbs = 0;
  let totalSodium = 0;
  let totalFiber = 0;

  for (const item of items) {
    const food = foodMap.get(item.foodId);
    if (!food) continue;
    const n = computeItemNutrition(item, food);
    totalCalories += n.calories;
    totalProtein += n.protein;
    totalFat += n.fat;
    totalCarbs += n.carbs;
    totalSodium += n.sodium;
    totalFiber += n.fiber;
  }

  const proteinEnergy = totalProtein * ENERGY_PER_GRAM.protein;
  const fatEnergy = totalFat * ENERGY_PER_GRAM.fat;
  const carbsEnergy = totalCarbs * ENERGY_PER_GRAM.carbs;
  const totalMacroEnergy = proteinEnergy + fatEnergy + carbsEnergy;

  const proteinEnergyRatio = totalMacroEnergy > 0 ? (proteinEnergy / totalMacroEnergy) * 100 : 0;
  const fatEnergyRatio = totalMacroEnergy > 0 ? (fatEnergy / totalMacroEnergy) * 100 : 0;
  const carbsEnergyRatio = totalMacroEnergy > 0 ? (carbsEnergy / totalMacroEnergy) * 100 : 0;

  return {
    totalCalories,
    totalProtein,
    totalFat,
    totalCarbs,
    totalSodium,
    totalFiber,
    proteinEnergyRatio,
    fatEnergyRatio,
    carbsEnergyRatio,
  };
}

export function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function round0(n: number): number {
  return Math.round(n);
}
