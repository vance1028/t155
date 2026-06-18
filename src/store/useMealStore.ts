import { create } from 'zustand';
import type {
  Allergen,
  AppState,
  DailyGoal,
  Food,
  MealItem,
  MealType,
} from '@/types';
import { defaultFoods } from '@/data/defaultFoods';
import { generateId } from '@/utils/id';
import { loadState, saveState } from '@/utils/io';
import { strategies, defaultStrategy } from '@/strategies';

function buildInitialFoods(): Food[] {
  return defaultFoods.map((f) => ({ ...f, id: generateId() }));
}

function buildDefaultGoal(): DailyGoal {
  return {
    caloriesMin: 1800,
    caloriesMax: 2000,
    proteinRatio: 25,
    fatRatio: 25,
    carbsRatio: 50,
    sodiumMax: 2000,
    fiberMin: 25,
    excludedAllergens: [],
    excludedFoods: [],
    mealsEnabled: {
      breakfast: true,
      lunch: true,
      dinner: true,
      snack: true,
    },
  };
}

function getInitialState(): AppState {
  const saved = loadState();
  if (saved) {
    return saved;
  }
  return {
    foods: buildInitialFoods(),
    mealItems: [],
    goal: buildDefaultGoal(),
    lastPlanMessage: '',
    lastPlanSuccess: true,
  };
}

interface MealStore extends AppState {
  setGoal: (goal: Partial<DailyGoal>) => void;
  addFood: (food: Omit<Food, 'id'>) => void;
  updateFood: (id: string, food: Partial<Food>) => void;
  deleteFood: (id: string) => void;
  addMealItem: (foodId: string, mealType: MealType, amount?: number) => void;
  updateMealItem: (id: string, amount: number) => void;
  deleteMealItem: (id: string) => void;
  clearMealItems: () => void;
  toggleExcludedAllergen: (a: Allergen) => void;
  toggleExcludedFood: (id: string) => void;
  toggleMealEnabled: (meal: MealType) => void;
  runSmartPlan: (strategyKey?: string) => void;
  importState: (state: AppState) => void;
  resetAll: () => void;
}

export const useMealStore = create<MealStore>((set, get) => ({
  ...getInitialState(),

  setGoal: (goal) =>
    set((state) => {
      const next = { ...state, goal: { ...state.goal, ...goal } };
      saveState(next);
      return next;
    }),

  addFood: (food) =>
    set((state) => {
      const next = { ...state, foods: [...state.foods, { ...food, id: generateId() }] };
      saveState(next);
      return next;
    }),

  updateFood: (id, food) =>
    set((state) => {
      const next = {
        ...state,
        foods: state.foods.map((f) => (f.id === id ? { ...f, ...food } : f)),
      };
      saveState(next);
      return next;
    }),

  deleteFood: (id) =>
    set((state) => {
      const next = {
        ...state,
        foods: state.foods.filter((f) => f.id !== id),
        mealItems: state.mealItems.filter((m) => m.foodId !== id),
      };
      saveState(next);
      return next;
    }),

  addMealItem: (foodId, mealType, amount = 100) =>
    set((state) => {
      const next = {
        ...state,
        mealItems: [
          ...state.mealItems,
          { id: generateId(), foodId, amount, mealType },
        ],
      };
      saveState(next);
      return next;
    }),

  updateMealItem: (id, amount) =>
    set((state) => {
      const next = {
        ...state,
        mealItems: state.mealItems.map((m) =>
          m.id === id ? { ...m, amount: Math.max(1, amount) } : m
        ),
      };
      saveState(next);
      return next;
    }),

  deleteMealItem: (id) =>
    set((state) => {
      const next = {
        ...state,
        mealItems: state.mealItems.filter((m) => m.id !== id),
      };
      saveState(next);
      return next;
    }),

  clearMealItems: () =>
    set((state) => {
      const next = { ...state, mealItems: [] };
      saveState(next);
      return next;
    }),

  toggleExcludedAllergen: (a) =>
    set((state) => {
      const has = state.goal.excludedAllergens.includes(a);
      const next = {
        ...state,
        goal: {
          ...state.goal,
          excludedAllergens: has
            ? state.goal.excludedAllergens.filter((x) => x !== a)
            : [...state.goal.excludedAllergens, a],
        },
      };
      saveState(next);
      return next;
    }),

  toggleExcludedFood: (id) =>
    set((state) => {
      const has = state.goal.excludedFoods.includes(id);
      const next = {
        ...state,
        goal: {
          ...state.goal,
          excludedFoods: has
            ? state.goal.excludedFoods.filter((x) => x !== id)
            : [...state.goal.excludedFoods, id],
        },
      };
      saveState(next);
      return next;
    }),

  toggleMealEnabled: (meal) =>
    set((state) => {
      const next = {
        ...state,
        goal: {
          ...state.goal,
          mealsEnabled: {
            ...state.goal.mealsEnabled,
            [meal]: !state.goal.mealsEnabled[meal],
          },
        },
      };
      saveState(next);
      return next;
    }),

  runSmartPlan: (strategyKey = defaultStrategy) =>
    set((state) => {
      const strategy = strategies[strategyKey] ?? strategies[defaultStrategy];
      const result = strategy.plan(state.foods, state.goal);
      const next = {
        ...state,
        mealItems: result.items,
        lastPlanMessage: result.message + (result.warnings?.length ? '：' + result.warnings.join('；') : ''),
        lastPlanSuccess: result.success,
      };
      saveState(next);
      return next;
    }),

  importState: (state) => {
    saveState(state);
    set(state);
  },

  resetAll: () => {
    const initial: AppState = {
      foods: buildInitialFoods(),
      mealItems: [],
      goal: buildDefaultGoal(),
      lastPlanMessage: '',
      lastPlanSuccess: true,
    };
    saveState(initial);
    set(initial);
  },
}));
