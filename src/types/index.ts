export type Allergen =
  | 'gluten'
  | 'dairy'
  | 'nuts'
  | 'eggs'
  | 'soy'
  | 'seafood'
  | 'shellfish';

export const ALLERGEN_LABELS: Record<Allergen, string> = {
  gluten: '含麸质',
  dairy: '含奶类',
  nuts: '含坚果',
  eggs: '含蛋类',
  soy: '含大豆',
  seafood: '含鱼类',
  shellfish: '含甲壳类',
};

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  sodium: number;
  fiber: number;
  allergens: Allergen[];
  category?: FoodCategory;
}

export type FoodCategory = 'staple' | 'protein' | 'vegetable' | 'fruit' | 'fat' | 'snack';

export const CATEGORY_LABELS: Record<FoodCategory, string> = {
  staple: '主食',
  protein: '蛋白质',
  vegetable: '蔬菜',
  fruit: '水果',
  fat: '油脂',
  snack: '零食',
};

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export const MEAL_LABELS: Record<MealType, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
  snack: '加餐',
};

export const MEAL_ICONS: Record<MealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
  snack: '🍎',
};

export interface MealItem {
  id: string;
  foodId: string;
  amount: number;
  mealType: MealType;
}

export interface DailyGoal {
  caloriesMin: number;
  caloriesMax: number;
  proteinRatio: number;
  fatRatio: number;
  carbsRatio: number;
  sodiumMax: number;
  fiberMin: number;
  excludedAllergens: Allergen[];
  excludedFoods: string[];
  mealsEnabled: Record<MealType, boolean>;
}

export interface NutritionSummary {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalSodium: number;
  totalFiber: number;
  proteinEnergyRatio: number;
  fatEnergyRatio: number;
  carbsEnergyRatio: number;
}

export interface MealPlanResult {
  items: MealItem[];
  message: string;
  success: boolean;
  warnings?: string[];
}

export interface AppState {
  foods: Food[];
  mealItems: MealItem[];
  goal: DailyGoal;
  lastPlanMessage: string;
  lastPlanSuccess: boolean;
}
