import { TopBar } from '@/components/TopBar';
import { GoalPanel } from '@/components/GoalPanel';
import { FoodLibrary } from '@/components/FoodLibrary';
import { MealSection } from '@/components/MealSection';
import { NutritionDashboard } from '@/components/NutritionDashboard';
import { SmartMealButton } from '@/components/SmartMealButton';
import type { MealType } from '@/types';

const MEAL_ORDER: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];

export default function App() {
  return (
    <div className="min-h-screen bg-cream">
      <TopBar />
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid grid-cols-12 gap-6">
          <aside className="col-span-12 lg:col-span-3 space-y-4">
            <GoalPanel />
            <div className="h-[calc(100vh-280px)] min-h-[500px]">
              <FoodLibrary />
            </div>
          </aside>

          <section className="col-span-12 lg:col-span-6 space-y-4">
            <SmartMealButton />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MEAL_ORDER.map((meal) => (
                <MealSection key={meal} meal={meal} />
              ))}
            </div>
          </section>

          <aside className="col-span-12 lg:col-span-3">
            <div className="sticky top-20">
              <NutritionDashboard />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
