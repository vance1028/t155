import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import {
  ALLERGEN_LABELS,
  CATEGORY_LABELS,
  type Allergen,
  type Food,
  type FoodCategory,
} from '@/types';
import { useMealStore } from '@/store/useMealStore';

interface Props {
  food?: Food | null;
  onClose: () => void;
}

const emptyFood: Omit<Food, 'id'> = {
  name: '',
  category: 'vegetable',
  calories: 0,
  protein: 0,
  fat: 0,
  carbs: 0,
  sodium: 0,
  fiber: 0,
  allergens: [],
};

export function FoodEditor({ food, onClose }: Props) {
  const addFood = useMealStore((s) => s.addFood);
  const updateFood = useMealStore((s) => s.updateFood);
  const [form, setForm] = useState<Omit<Food, 'id'>>(
    food ?? emptyFood
  );

  useEffect(() => {
    setForm(food ?? emptyFood);
  }, [food]);

  const categories: FoodCategory[] = [
    'staple',
    'protein',
    'vegetable',
    'fruit',
    'fat',
    'snack',
  ];
  const allergens: Allergen[] = [
    'gluten',
    'dairy',
    'nuts',
    'eggs',
    'soy',
    'seafood',
    'shellfish',
  ];

  const toggleAllergen = (a: Allergen) => {
    setForm((f) => ({
      ...f,
      allergens: f.allergens.includes(a)
        ? f.allergens.filter((x) => x !== a)
        : [...f.allergens, a],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('请填写食材名称');
      return;
    }
    if (food) {
      updateFood(food.id, form);
    } else {
      addFood(form);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h3 className="font-display font-semibold text-gray-800">
            {food ? '编辑食材' : '新增食材'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              食材名称 *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
              placeholder="例如：鸡胸肉"
              autoFocus
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              类别
            </label>
            <select
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value as FoodCategory })
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {CATEGORY_LABELS[c]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'calories', label: '热量 (kcal/100g)' },
              { key: 'protein', label: '蛋白质 (g/100g)' },
              { key: 'fat', label: '脂肪 (g/100g)' },
              { key: 'carbs', label: '碳水 (g/100g)' },
              { key: 'sodium', label: '钠 (mg/100g)' },
              { key: 'fiber', label: '膳食纤维 (g/100g)' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-gray-500 mb-1 block">{label}</label>
                <input
                  type="number"
                  step="0.1"
                  value={(form as any)[key]}
                  onChange={(e) =>
                    setForm({ ...form, [key]: Number(e.target.value) } as any)
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
              </div>
            ))}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              过敏原标签
            </label>
            <div className="flex flex-wrap gap-2">
              {allergens.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => toggleAllergen(a)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    form.allergens.includes(a)
                      ? 'bg-accent text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {ALLERGEN_LABELS[a]}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors shadow-md"
            >
              {food ? '保存修改' : '添加食材'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
