import { useRef } from 'react';
import { Download, Upload, RotateCcw, Leaf } from 'lucide-react';
import { useMealStore } from '@/store/useMealStore';
import { exportJSON, importJSON } from '@/utils/io';
import type { AppState } from '@/types';

export function TopBar() {
  const foods = useMealStore((s) => s.foods);
  const mealItems = useMealStore((s) => s.mealItems);
  const goal = useMealStore((s) => s.goal);
  const lastPlanMessage = useMealStore((s) => s.lastPlanMessage);
  const lastPlanSuccess = useMealStore((s) => s.lastPlanSuccess);
  const importState = useMealStore((s) => s.importState);
  const resetAll = useMealStore((s) => s.resetAll);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const state: AppState = {
      foods,
      mealItems,
      goal,
      lastPlanMessage,
      lastPlanSuccess,
    };
    exportJSON(state);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const state = await importJSON(file);
      importState(state);
      alert('导入成功！');
    } catch (err) {
      alert('导入失败：' + (err as Error).message);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleReset = () => {
    if (confirm('确定要重置所有数据吗？此操作无法撤销。')) {
      resetAll();
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
      <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-primary-dark">
              营养配餐助手
            </h1>
            <p className="text-xs text-gray-500">
              控糖 · 增肌 · 均衡营养，一切尽在掌握
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-4 h-4" />
            导入
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </div>
      </div>
    </header>
  );
}
