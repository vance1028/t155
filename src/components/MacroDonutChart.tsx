import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { NutritionSummary, DailyGoal } from '@/types';

interface Props {
  summary: NutritionSummary;
  goal: DailyGoal;
}

const COLORS = ['#1a5c3a', '#e07a5f', '#f2cc8f'];

export function MacroDonutChart({ summary, goal }: Props) {
  const data = [
    {
      name: '蛋白质',
      value: summary.proteinEnergyRatio,
      target: goal.proteinRatio,
      grams: summary.totalProtein,
    },
    {
      name: '脂肪',
      value: summary.fatEnergyRatio,
      target: goal.fatRatio,
      grams: summary.totalFat,
    },
    {
      name: '碳水',
      value: summary.carbsEnergyRatio,
      target: goal.carbsRatio,
      grams: summary.totalCarbs,
    },
  ];

  const total = data.reduce((s, d) => s + d.value, 0);
  const hasData = total > 0.1;

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
      <h3 className="font-display font-semibold text-gray-800 mb-2 text-center">
        三大营养素供能比
      </h3>
      <div className="h-56">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                isAnimationActive
              >
                {data.map((_, idx) => (
                  <Cell key={idx} fill={COLORS[idx]} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, _name, props: any) => {
                  const d = props.payload;
                  return [
                    `${value.toFixed(1)}% (${d.grams.toFixed(1)}g)，目标 ${d.target}%`,
                    d.name,
                  ];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-300 text-sm">
            添加食材以查看供能比
          </div>
        )}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-2 text-center">
        {data.map((d, idx) => (
          <div key={d.name}>
            <div className="flex items-center justify-center gap-1">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: COLORS[idx] }}
              />
              <span className="text-xs font-medium text-gray-600">{d.name}</span>
            </div>
            <div className="text-sm font-bold text-gray-800 mt-0.5">
              {d.value.toFixed(1)}%
            </div>
            <div className="text-[10px] text-gray-400">
              目标 {d.target}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
