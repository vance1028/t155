import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import {
  MEAL_ICONS,
  MEAL_LABELS,
  type Food,
  type MealType,
} from '@/types';
import { MealItemRow } from './MealItemRow';
import { summarizeNutrition, round0 } from '@/utils/nutrition';

interface Props {
  meal: MealType;
}

export function MealSection({ meal }: Props) {
  const mealItems = useMealStore((s) => s.mealItems);
  const foods = useMealStore((s) => s.foods);
  const addMealItem = useMealStore((s) => s.addMealItem);
  const deleteMealItem = useMealStore((s) => s.deleteMealItem);
  const mealsEnabled = useMealStore((s) => s.goal.mealsEnabled);
  const toggleMealEnabled = useMealStore((s) => s.toggleMealEnabled);

  const [showPicker, setShowPicker] = useState(false);

  const items = mealItems.filter((i) => i.mealType === meal);
  const enabled = mealsEnabled[meal];

  const foodMap = new Map(foods.map((f) => [f.id, f]));
  const mealSummary = summarizeNutrition(items, foods);

  const clearMeal = () => {
    if (items.length === 0) return;
    if (confirm(`清空${MEAL_LABELS[meal]}？`)) {
      items.forEach((i) => deleteMealItem(i.id));
    }
  };

  if (!enabled) {
    return (
      <div className="bg-white/50 rounded-2xl border border-dashed border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 opacity-50">
            <span className="text-2xl">{MEAL_ICONS[meal]}</span>
            <span className="font-display font-semibold text-gray-400">
              {MEAL_LABELS[meal]}
            </span>
            <span className="text-xs text-gray-400">（已停用）</span>
          </div>
          <button
            onClick={() => toggleMealEnabled(meal)}
            className="text-xs text-primary hover:underline"
          >
            启用
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{MEAL_ICONS[meal]}</span>
          <div>
            <h3 className="font-display font-semibold text-gray-800">
              {MEAL_LABELS[meal]}
            </h3>
            <p className="text-[11px] text-gray-400">
              {round0(mealSummary.totalCalories)} kcal · {items.length} 项
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button
            onClick={clearMeal}
            className="p-1.5 rounded-lg text-gray-300 hover:bg-gray-100 hover:text-accent transition-colors"
            title="清空此餐"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="flex-1 min-h-[100px] px-4 py-2 space-y-0.5">
        {items.length === 0 ? (
          <div className="h-full flex items-center justify-center py-6 text-gray-300 text-sm">
            尚未添加食材
          </div>
        ) : (
          items.map((item) => (
            <MealItemRow
              key={item.id}
              item={item}
              food={foodMap.get(item.foodId)}
            />
          ))
        )}
      </div>

      <button
        onClick={() => setShowPicker(true)}
        className="mx-4 mb-3 py-2 rounded-lg border border-dashed border-gray-200 text-gray-500 text-sm hover:border-primary hover:text-primary hover:bg-primary/5 transition-colors flex items-center justify-center gap-1"
      >
        <Plus className="w-4 h-4" />
        添加食材
      </button>

      {showPicker && (
        <MealPicker
          meal={meal}
          foods={foods}
          onPick={(foodId) => {
            addMealItem(foodId, meal, 100);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

function MealPicker({
  meal,
  foods,
  onPick,
  onClose,
}: {
  meal: MealType;
  foods: Food[];
  onPick: (foodId: string) => void;
  onClose: () => void;
}) {
  const goal = useMealStore((s) => s.goal);
  const [search, setSearch] = useState('');

  const filtered = foods.filter((f) => {
    if (goal.excludedFoods.includes(f.id)) return false;
    if (f.allergens.some((a) => goal.excludedAllergens.includes(a))) return false;
    return f.name.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-display font-semibold text-gray-800">
            添加到{MEAL_LABELS[meal]}
          </h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            关闭
          </button>
        </div>
        <div className="px-4 py-3 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索食材..."
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            autoFocus
          />
        </div>
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">
              无可用食材
            </div>
          ) : (
            filtered.map((f) => (
              <button
                key={f.id}
                onClick={() => onPick(f.id)}
                className="w-full px-5 py-3 text-left hover:bg-gray-50 border-b border-gray-50 flex items-center justify-between transition-colors"
              >
                <span className="font-medium text-gray-800 text-sm">
                  {f.name}
                </span>
                <span className="text-xs text-gray-400">
                  {f.calories} kcal/100g
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
