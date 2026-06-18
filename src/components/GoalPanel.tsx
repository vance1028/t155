import { useState } from 'react';
import { ChevronDown, ChevronUp, Target, Flame, Zap } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import {
  ALLERGEN_LABELS,
  MEAL_LABELS,
  type Allergen,
  type MealType,
} from '@/types';

export function GoalPanel() {
  const [expanded, setExpanded] = useState(true);
  const goal = useMealStore((s) => s.goal);
  const setGoal = useMealStore((s) => s.setGoal);
  const toggleExcludedAllergen = useMealStore((s) => s.toggleExcludedAllergen);
  const toggleMealEnabled = useMealStore((s) => s.toggleMealEnabled);

  const allergens: Allergen[] = [
    'gluten',
    'dairy',
    'nuts',
    'eggs',
    'soy',
    'seafood',
    'shellfish',
  ];
  const meals: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

  const macroTotal = goal.proteinRatio + goal.fatRatio + goal.carbsRatio;
  const macroValid = Math.abs(macroTotal - 100) < 0.5;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h2 className="font-display font-semibold text-gray-800">每日目标</h2>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {expanded && (
        <div className="px-5 pb-5 space-y-5 animate-fadeIn">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              热量目标区间 (kcal)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={goal.caloriesMin}
                onChange={(e) =>
                  setGoal({ caloriesMin: Math.max(0, Number(e.target.value)) })
                }
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="最低"
              />
              <span className="self-center text-gray-400">—</span>
              <input
                type="number"
                value={goal.caloriesMax}
                onChange={(e) =>
                  setGoal({ caloriesMax: Math.max(0, Number(e.target.value)) })
                }
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                placeholder="最高"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-yellow-500" />
              三大营养素供能比目标
              {!macroValid && (
                <span className="text-xs text-accent ml-2">
                  总和需等于 100%（当前 {macroTotal}%）
                </span>
              )}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <span className="text-xs text-gray-500">蛋白质</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goal.proteinRatio}
                    onChange={(e) =>
                      setGoal({ proteinRatio: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">脂肪</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goal.fatRatio}
                    onChange={(e) =>
                      setGoal({ fatRatio: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
              <div>
                <span className="text-xs text-gray-500">碳水</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={goal.carbsRatio}
                    onChange={(e) =>
                      setGoal({ carbsRatio: Math.max(0, Number(e.target.value)) })
                    }
                    className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                  <span className="text-xs text-gray-400">%</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              钠上限 (mg)
            </label>
            <input
              type="number"
              value={goal.sodiumMax}
              onChange={(e) =>
                setGoal({ sodiumMax: Math.max(0, Number(e.target.value)) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              膳食纤维目标 (g)
            </label>
            <input
              type="number"
              value={goal.fiberMin}
              onChange={(e) =>
                setGoal({ fiberMin: Math.max(0, Number(e.target.value)) })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              启用餐次
            </label>
            <div className="flex flex-wrap gap-2">
              {meals.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMealEnabled(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    goal.mealsEnabled[m]
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                  }`}
                >
                  {MEAL_LABELS[m]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              排除过敏原
            </label>
            <div className="flex flex-wrap gap-2">
              {allergens.map((a) => (
                <button
                  key={a}
                  onClick={() => toggleExcludedAllergen(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    goal.excludedAllergens.includes(a)
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {ALLERGEN_LABELS[a]}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
