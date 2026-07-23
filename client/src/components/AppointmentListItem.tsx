type AppointmentListItemProps = {
  initials: string;
  title: string;
  subtitle: string;
  status: string;
  date: string;
  timeSlot: string;
};

const statusPillStyles: Record<string, string> = {
  PENDING: "bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400",
  APPROVED: "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400",
  REJECTED: "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400",
  COMPLETED:
    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  CANCELLED:
    "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500",
  RESCHEDULED: "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400",
};

function AppointmentListItem({
  initials,
  title,
  subtitle,
  status,
  date,
  timeSlot,
}: AppointmentListItemProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-semibold text-sm">
          {initials}
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusPillStyles[status] ?? statusPillStyles.PENDING}`}
        >
          {status}
        </span>
      </div>

      <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-3">
        {subtitle}
      </p>

      <p className="text-slate-400 dark:text-slate-500 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
        {new Date(date).toLocaleDateString(undefined, {
          weekday: "short",
          month: "short",
          day: "numeric",
        })}{" "}
        · {timeSlot}
      </p>
    </div>
  );
}

export default AppointmentListItem;
