"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Habit = {
  text: string;
  completed: boolean;
};

export default function Home() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("habits");
    if (saved) setHabits(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

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

  const completedCount = habits.filter((h) => h.completed).length;
  const progress =
    habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Habit Tracker</h1>

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
        <ul className="space-y-2">
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
      </div>
    </main>
  );
}