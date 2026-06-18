import { useState } from 'react';
import { Sparkles, Trash2 } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';

export function SmartMealButton() {
  const runSmartPlan = useMealStore((s) => s.runSmartPlan);
  const clearMealItems = useMealStore((s) => s.clearMealItems);
  const mealItems = useMealStore((s) => s.mealItems);
  const [loading, setLoading] = useState(false);

  const handlePlan = () => {
    setLoading(true);
    setTimeout(() => {
      runSmartPlan();
      setLoading(false);
    }, 300);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex gap-2">
        <button
          onClick={handlePlan}
          disabled={loading}
          className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-primary to-primary-light text-white font-medium text-sm shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles
            className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`}
          />
          {loading ? '配餐中...' : '一键智能配餐'}
        </button>
        {mealItems.length > 0 && (
          <button
            onClick={() => {
              if (confirm('清空所有餐次？')) {
                clearMealItems();
              }
            }}
            className="px-4 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-accent transition-colors"
            title="清空餐单"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      <p className="mt-2 text-[11px] text-gray-400 text-center">
        基于你的目标和食材库，自动搭配一日三餐
      </p>
    </div>
  );
}
