import { Flame, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { summarizeNutrition, round0, round1 } from '@/utils/nutrition';
import { ProgressBar } from './ProgressBar';
import { MacroDonutChart } from './MacroDonutChart';

export function NutritionDashboard() {
  const mealItems = useMealStore((s) => s.mealItems);
  const foods = useMealStore((s) => s.foods);
  const goal = useMealStore((s) => s.goal);
  const lastPlanMessage = useMealStore((s) => s.lastPlanMessage);
  const lastPlanSuccess = useMealStore((s) => s.lastPlanSuccess);

  const summary = summarizeNutrition(mealItems, foods);
  const targetCalories = (goal.caloriesMin + goal.caloriesMax) / 2;

  const inCalorieRange =
    summary.totalCalories >= goal.caloriesMin * 0.95 &&
    summary.totalCalories <= goal.caloriesMax * 1.05;

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-warning" />
            <span className="text-sm opacity-90">今日总热量</span>
          </div>
          {summary.totalCalories > 0 && (
            <div
              className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                inCalorieRange ? 'bg-white/20' : 'bg-accent/80'
              }`}
            >
              {inCalorieRange ? (
                <>
                  <CheckCircle2 className="w-3 h-3" />
                  在目标区间
                </>
              ) : (
                <>
                  <AlertTriangle className="w-3 h-3" />
                  {summary.totalCalories < goal.caloriesMin * 0.95
                    ? '偏低'
                    : '偏高'}
                </>
              )}
            </div>
          )}
        </div>
        <div className="flex items-end gap-2">
          <span className="text-5xl font-display font-bold tracking-tight">
            {round0(summary.totalCalories)}
          </span>
          <span className="text-sm opacity-80 pb-1.5">
            kcal / {goal.caloriesMin}-{goal.caloriesMax}
          </span>
        </div>
        <div className="mt-3 h-1.5 bg-white/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-warning rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, (summary.totalCalories / goal.caloriesMax) * 100)}%`,
            }}
          />
        </div>
      </div>

      <MacroDonutChart summary={summary} goal={goal} />

      <div className="space-y-2">
        <ProgressBar
          label="蛋白质"
          value={summary.totalProtein}
          target={Math.round((targetCalories * (goal.proteinRatio / 100)) / 4)}
          unit=" g"
        />
        <ProgressBar
          label="脂肪"
          value={summary.totalFat}
          target={Math.round((targetCalories * (goal.fatRatio / 100)) / 9)}
          unit=" g"
        />
        <ProgressBar
          label="碳水化合物"
          value={summary.totalCarbs}
          target={Math.round((targetCalories * (goal.carbsRatio / 100)) / 4)}
          unit=" g"
        />
        <ProgressBar
          label="钠"
          value={summary.totalSodium}
          target={goal.sodiumMax}
          unit=" mg"
        />
        <ProgressBar
          label="膳食纤维"
          value={summary.totalFiber}
          target={goal.fiberMin}
          unit=" g"
          warnAbove={false}
        />
      </div>

      {lastPlanMessage && (
        <div
          className={`p-3 rounded-xl text-sm flex items-start gap-2 ${
            lastPlanSuccess
              ? 'bg-success/10 border border-success/20 text-primary-dark'
              : 'bg-accent/10 border border-accent/20 text-accent'
          }`}
        >
          {lastPlanSuccess ? (
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
          )}
          <span>{lastPlanMessage}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 border border-gray-100 text-xs text-gray-500 space-y-1">
        <div className="flex justify-between">
          <span>蛋白质供能</span>
          <span className="font-medium text-gray-700">
            {round1(summary.proteinEnergyRatio)}% (
            {round1(summary.totalProtein * 4)} kcal)
          </span>
        </div>
        <div className="flex justify-between">
          <span>脂肪供能</span>
          <span className="font-medium text-gray-700">
            {round1(summary.fatEnergyRatio)}% (
            {round1(summary.totalFat * 9)} kcal)
          </span>
        </div>
        <div className="flex justify-between">
          <span>碳水供能</span>
          <span className="font-medium text-gray-700">
            {round1(summary.carbsEnergyRatio)}% (
            {round1(summary.totalCarbs * 4)} kcal)
          </span>
        </div>
      </div>
    </div>
  );
}
