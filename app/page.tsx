"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Habit = {
  text: string;
  completed: boolean;
};

type DailyProgress = {
  date: string;
  completed: number;
  total: number;
  percentage: number;
};

export default function Home() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);
  const [dailyHistory, setDailyHistory] = useState<DailyProgress[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
    const savedHistory = localStorage.getItem("dailyHistory");
    if (savedHistory) setDailyHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem("dailyHistory", JSON.stringify(dailyHistory));
  }, [dailyHistory]);

  const addHabit = () => {
    if (!habit.trim()) return;
    setHabits([...habits, { text: habit, completed: false }]);
    setHabit("");
  };

  const toggleHabit = (index: number) => {
    setHabits(
      habits.map((h, i) =>
        i === index ? { ...h, completed: !h.completed } : h
      )
    );
  };

  const deleteHabit = (index: number) => {
    setHabits(habits.filter((_, i) => i !== index));
  };

  const completeDay = () => {
    const today = new Date().toISOString().split("T")[0];
    const completedCount = habits.filter((h) => h.completed).length;
    const percentage =
      habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

    // Add to history if not already recorded for today
    if (!dailyHistory.some((d) => d.date === today)) {
      setDailyHistory([
        ...dailyHistory,
        {
          date: today,
          completed: completedCount,
          total: habits.length,
          percentage,
        },
      ]);
    }

    // Reset habits for next day
    setHabits(habits.map((h) => ({ ...h, completed: false })));
  };

  const deleteDay = (date: string) => {
    setDailyHistory(dailyHistory.filter((d) => d.date !== date));
  };

  const completedCount = habits.filter((h) => h.completed).length;
  const progress =
    habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Main Box - Today's Habits */}
        <div className="bg-white p-8 rounded-2xl shadow-xl mb-8">
          <h1 className="text-2xl font-bold mb-4 text-center">Today's Habits</h1>

          {/* 入力フォーム */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={habit}
              onChange={(e) => setHabit(e.target.value)}
              placeholder="New habit..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            />
            <button
              onClick={addHabit}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition transform hover:scale-105"
            >
              Add
            </button>
          </div>

          {/* 進捗 */}
          <div className="text-sm text-gray-600 mb-2">
            {completedCount} / {habits.length} completed ({progress}%)
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
            <motion.div
              className="bg-green-500 h-3"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* リスト */}
          <ul className="space-y-2 mb-4">
            <AnimatePresence>
              {habits.map((h, index) => (
                <motion.li
                  key={h.text + index}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  layout
                  className="flex justify-between items-center bg-gray-50 p-2 rounded-lg shadow-sm"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={h.completed}
                      onChange={() => toggleHabit(index)}
                      className="w-4 h-4"
                    />
                    <motion.span
                      animate={{
                        scale: h.completed ? 1.05 : 1,
                        color: h.completed ? "#9CA3AF" : "#111827",
                      }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className={`transition-all duration-300 ${
                        h.completed ? "line-through" : ""
                      }`}
                    >
                      {h.text}
                    </motion.span>
                  </div>
                  <button
                    onClick={() => deleteHabit(index)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          {/* Complete Day Button */}
          <button
            onClick={completeDay}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition transform hover:scale-105"
          >
            Complete Day & Log Progress
          </button>
        </div>

        {/* Daily Progress History */}
        {dailyHistory.length > 0 && (
          <div className="bg-white p-8 rounded-2xl shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Daily Progress</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {[...dailyHistory].reverse().map((day, index) => (
                  <motion.div
                    key={day.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg border border-gray-200"
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">
                        {new Date(day.date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </div>
                      <div className="text-sm text-gray-600">
                        {day.completed} / {day.total} completed
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="min-w-12">
                        <motion.div
                          animate={{ width: `${day.percentage}%` }}
                          className="h-2 bg-green-500 rounded-full"
                        />
                      </div>
                      <div className="text-xl font-bold text-green-600 min-w-12 text-right">
                        {day.percentage}%
                      </div>
                      <button
                        onClick={() => deleteDay(day.date)}
                        className="text-red-500 hover:text-red-700 transition ml-2 text-lg"
                      >
                        ✕
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}