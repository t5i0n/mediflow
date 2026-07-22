import { motion } from "framer-motion";
import { type ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ReactNode;
  accent?: "blue" | "green" | "amber" | "violet";
  delay?: number;
};

const accentStyles = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  amber: "bg-amber-50 text-amber-600",
  violet: "bg-violet-50 text-violet-600",
};

function StatCard({
  label,
  value,
  icon,
  accent = "blue",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
    >
      <div
        className={`w-11 h-11 rounded-xl flex items-center justify-center ${accentStyles[accent]}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900 leading-tight">
          {value}
        </p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;
