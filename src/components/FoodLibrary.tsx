import { useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, UtensilsCrossed, Ban } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { FoodEditor } from './FoodEditor';
import {
  ALLERGEN_LABELS,
  CATEGORY_LABELS,
  MEAL_LABELS,
  type Food,
  type MealType,
} from '@/types';

export function FoodLibrary() {
  const foods = useMealStore((s) => s.foods);
  const deleteFood = useMealStore((s) => s.deleteFood);
  const addMealItem = useMealStore((s) => s.addMealItem);
  const toggleExcludedFood = useMealStore((s) => s.toggleExcludedFood);
  const excludedFoods = useMealStore((s) => s.goal.excludedFoods);
  const excludedAllergens = useMealStore((s) => s.goal.excludedAllergens);
  const mealsEnabled = useMealStore((s) => s.goal.mealsEnabled);

  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Food | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [pickerFood, setPickerFood] = useState<Food | null>(null);

  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const filteredFoods = useMemo(() => {
    return foods.filter(
      (f) => f.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [foods, search]);

  const isFoodExcluded = (f: Food) =>
    excludedFoods.includes(f.id) ||
    f.allergens.some((a) => excludedAllergens.includes(a));

  const handleAddToMeal = (food: Food, meal: MealType) => {
    addMealItem(food.id, meal, 100);
    setPickerFood(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      <div className="px-4 py-4 border-b border-gray-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-primary" />
            <h2 className="font-display font-semibold text-gray-800">食材库</h2>
            <span className="text-xs text-gray-400">({foods.length})</span>
          </div>
          <button
            onClick={() => {
              setEditing(null);
              setShowEditor(true);
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-medium hover:bg-primary-dark transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            新增
          </button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索食材..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
        {filteredFoods.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            暂无匹配的食材
          </div>
        ) : (
          filteredFoods.map((food) => {
            const excluded = isFoodExcluded(food);
            return (
              <div
                key={food.id}
                className={`px-4 py-3 hover:bg-gray-50 transition-colors group ${
                  excluded ? 'opacity-50' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-gray-800 text-sm truncate">
                        {food.name}
                      </span>
                      {food.category && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                          {CATEGORY_LABELS[food.category]}
                        </span>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      {food.calories} kcal · 蛋白{food.protein}g · 脂肪
                      {food.fat}g · 碳水{food.carbs}g
                    </div>
                    {food.allergens.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {food.allergens.map((a) => (
                          <span
                            key={a}
                            className="text-[10px] px-1.5 py-0.5 rounded bg-accent/10 text-accent"
                          >
                            {ALLERGEN_LABELS[a]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleExcludedFood(food.id)}
                      title={excluded ? '取消忌口' : '加入忌口'}
                      className={`p-1.5 rounded-lg hover:bg-gray-100 transition-colors ${
                        excludedFoods.includes(food.id)
                          ? 'text-accent opacity-100'
                          : 'text-gray-400'
                      }`}
                    >
                      <Ban className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditing(food);
                        setShowEditor(true);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-primary transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`确定删除「${food.name}」？`)) {
                          deleteFood(food.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-accent transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => setPickerFood(food)}
                  disabled={excluded}
                  className="mt-2 w-full py-1.5 text-xs rounded-lg bg-primary/5 text-primary font-medium hover:bg-primary/10 transition-colors disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  + 添加到餐次
                </button>
              </div>
            );
          })
        )}
      </div>

      {pickerFood && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-5">
            <h3 className="font-display font-semibold text-gray-800 mb-3">
              「{pickerFood.name}」添加到
            </h3>
            <div className="space-y-2">
              {meals
                .filter((m) => mealsEnabled[m])
                .map((m) => (
                  <button
                    key={m}
                    onClick={() => handleAddToMeal(pickerFood, m)}
                    className="w-full py-2.5 px-4 rounded-lg bg-gray-50 hover:bg-primary hover:text-white text-sm text-gray-700 font-medium transition-colors text-left"
                  >
                    {MEAL_LABELS[m]}
                  </button>
                ))}
            </div>
            <button
              onClick={() => setPickerFood(null)}
              className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              取消
            </button>
          </div>
        </div>
      )}

      {showEditor && (
        <FoodEditor
          food={editing}
          onClose={() => {
            setShowEditor(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
