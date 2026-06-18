import type {
  DailyGoal,
  Food,
  FoodCategory,
  MealItem,
  MealPlanResult,
  MealType,
} from '@/types';
import type { MealPlannerStrategy } from './types';
import { generateId } from '@/utils/id';
import { summarizeNutrition } from '@/utils/nutrition';

const MEAL_DISTRIBUTION: Record<MealType, number> = {
  breakfast: 0.25,
  lunch: 0.35,
  dinner: 0.3,
  snack: 0.1,
};

const MEAL_CATEGORIES: Record<MealType, FoodCategory[]> = {
  breakfast: ['staple', 'protein', 'fruit'],
  lunch: ['staple', 'protein', 'vegetable'],
  dinner: ['staple', 'protein', 'vegetable'],
  snack: ['fruit', 'protein', 'fat'],
};

const CATEGORY_PORTION: Record<FoodCategory, number> = {
  staple: 150,
  protein: 120,
  vegetable: 150,
  fruit: 150,
  fat: 10,
  snack: 30,
};

function filterFoods(foods: Food[], goal: DailyGoal): Food[] {
  return foods.filter((food) => {
    if (goal.excludedFoods.includes(food.id)) return false;
    if (food.allergens.some((a) => goal.excludedAllergens.includes(a))) return false;
    return true;
  });
}

function pickByCategory(foods: Food[], category: FoodCategory): Food | null {
  const matches = foods.filter((f) => f.category === category);
  if (matches.length === 0) return null;
  return matches[Math.floor(Math.random() * matches.length)];
}

function createMealItems(
  meal: MealType,
  foods: Food[],
  calorieTarget: number
): MealItem[] {
  const categories = MEAL_CATEGORIES[meal];
  const items: MealItem[] = [];
  let usedCalories = 0;

  for (const category of categories) {
    const food = pickByCategory(foods, category);
    if (!food) continue;

    let portion = CATEGORY_PORTION[category];
    const foodCalories = (food.calories * portion) / 100;

    if (usedCalories + foodCalories > calorieTarget * 1.1) {
      portion = Math.max(30, portion * 0.6);
    }

    usedCalories += (food.calories * portion) / 100;
    items.push({
      id: generateId(),
      foodId: food.id,
      amount: Math.round(portion),
      mealType: meal,
    });
  }

  return items;
}

function adjustPortions(
  items: MealItem[],
  foods: Food[],
  goal: DailyGoal
): MealItem[] {
  if (items.length === 0) return items;

  const targetCalories = (goal.caloriesMin + goal.caloriesMax) / 2;
  const iterations = 20;
  const adjusted = items.map((i) => ({ ...i }));

  for (let iter = 0; iter < iterations; iter++) {
    const summary = summarizeNutrition(adjusted, foods);
    const calorieDiff = summary.totalCalories - targetCalories;

    if (Math.abs(calorieDiff) < 50) break;

    const factor = calorieDiff > 0 ? 0.95 : 1.05;
    for (const item of adjusted) {
      item.amount = Math.max(20, Math.round(item.amount * factor));
    }
  }

  return adjusted;
}

function adjustMacros(
  items: MealItem[],
  foods: Food[],
  goal: DailyGoal
): MealItem[] {
  if (items.length === 0) return items;

  const adjusted = items.map((i) => ({ ...i }));
  const foodMap = new Map(foods.map((f) => [f.id, f]));
  const iterations = 15;

  for (let iter = 0; iter < iterations; iter++) {
    const summary = summarizeNutrition(adjusted, foods);
    const proteinDiff = summary.proteinEnergyRatio - goal.proteinRatio;
    const fatDiff = summary.fatEnergyRatio - goal.fatRatio;

    for (const item of adjusted) {
      const food = foodMap.get(item.foodId);
      if (!food) continue;

      if (proteinDiff > 5 && food.protein > 15) {
        item.amount = Math.max(20, Math.round(item.amount * 0.95));
      } else if (proteinDiff < -5 && food.protein > 10) {
        item.amount = Math.round(item.amount * 1.05);
      }

      if (fatDiff > 5 && food.fat > 10) {
        item.amount = Math.max(20, Math.round(item.amount * 0.95));
      } else if (fatDiff < -5 && food.fat > 5 && food.fat < 15) {
        item.amount = Math.round(item.amount * 1.05);
      }
    }
  }

  return adjusted;
}

export const greedyPlanner: MealPlannerStrategy = {
  name: 'Greedy Planner',

  plan(foods: Food[], goal: DailyGoal): MealPlanResult {
    const warnings: string[] = [];
    const availableFoods = filterFoods(foods, goal);

    if (availableFoods.length === 0) {
      return {
        items: [],
        success: false,
        message: '没有可用食材：请检查过敏原排除和忌口设置',
      };
    }

    const hasCategory = (cat: FoodCategory) =>
      availableFoods.some((f) => f.category === cat);
    const requiredCategories: FoodCategory[] = [
      'staple',
      'protein',
      'vegetable',
    ];
    const missing = requiredCategories.filter((c) => !hasCategory(c));
    if (missing.length > 0) {
      warnings.push(
        `缺少食材类别: ${missing.map((m) => m).join('、')}，可能影响配餐质量`
      );
    }

    const enabledMeals = (Object.keys(goal.mealsEnabled) as MealType[]).filter(
      (m) => goal.mealsEnabled[m]
    );

    if (enabledMeals.length === 0) {
      return {
        items: [],
        success: false,
        message: '没有启用任何餐次',
      };
    }

    const totalDistribution = enabledMeals.reduce(
      (sum, m) => sum + MEAL_DISTRIBUTION[m],
      0
    );
    const targetCalories = (goal.caloriesMin + goal.caloriesMax) / 2;

    let allItems: MealItem[] = [];
    for (const meal of enabledMeals) {
      const mealCalorieTarget =
        (targetCalories * MEAL_DISTRIBUTION[meal]) / totalDistribution;
      const mealItems = createMealItems(meal, availableFoods, mealCalorieTarget);
      allItems = allItems.concat(mealItems);
    }

    allItems = adjustPortions(allItems, foods, goal);
    allItems = adjustMacros(allItems, foods, goal);

    const summary = summarizeNutrition(allItems, foods);
    const finalWarnings = [...warnings];

    if (summary.totalCalories < goal.caloriesMin * 0.9) {
      finalWarnings.push(
        `总热量偏低：${Math.round(summary.totalCalories)} kcal，目标 ${goal.caloriesMin}-${goal.caloriesMax} kcal`
      );
    }
    if (summary.totalCalories > goal.caloriesMax * 1.1) {
      finalWarnings.push(
        `总热量偏高：${Math.round(summary.totalCalories)} kcal，目标 ${goal.caloriesMin}-${goal.caloriesMax} kcal`
      );
    }
    if (summary.totalSodium > goal.sodiumMax) {
      finalWarnings.push(
        `钠超标：${Math.round(summary.totalSodium)} mg，上限 ${goal.sodiumMax} mg`
      );
    }

    const success =
      summary.totalCalories >= goal.caloriesMin * 0.9 &&
      summary.totalCalories <= goal.caloriesMax * 1.1 &&
      summary.totalSodium <= goal.sodiumMax;

    return {
      items: allItems,
      success,
      message: success
        ? `配餐成功！共 ${allItems.length} 项食材`
        : '配餐完成，但部分指标未达标',
      warnings: finalWarnings,
    };
  },
};
