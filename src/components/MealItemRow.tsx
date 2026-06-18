import { Minus, Plus, Trash2 } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { computeItemNutrition, round0 } from '@/utils/nutrition';
import type { Food, MealItem } from '@/types';

interface Props {
  item: MealItem;
  food: Food | undefined;
}

export function MealItemRow({ item, food }: Props) {
  const updateMealItem = useMealStore((s) => s.updateMealItem);
  const deleteMealItem = useMealStore((s) => s.deleteMealItem);

  if (!food) return null;
  const n = computeItemNutrition(item, food);

  return (
    <div className="group py-2 border-b border-gray-50 last:border-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-medium text-gray-800 truncate">
              {food.name}
            </span>
          </div>
          <div className="text-[11px] text-gray-400 mt-0.5">
            {round0(n.calories)} kcal · 蛋白{round0(n.protein)}g · 脂肪
            {round0(n.fat)}g · 碳水{round0(n.carbs)}g
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateMealItem(item.id, item.amount - 10)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <div className="w-16 relative">
            <input
              type="number"
              value={item.amount}
              onChange={(e) =>
                updateMealItem(item.id, Math.max(1, Number(e.target.value)))
              }
              className="w-full px-2 py-1 text-center text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary"
            />
            <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none">
              g
            </span>
          </div>
          <button
            onClick={() => updateMealItem(item.id, item.amount + 10)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            onClick={() => deleteMealItem(item.id)}
            className="w-6 h-6 rounded-md flex items-center justify-center text-gray-300 hover:bg-gray-100 hover:text-accent transition-colors opacity-0 group-hover:opacity-100"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
