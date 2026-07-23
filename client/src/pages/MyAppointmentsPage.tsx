import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import Skeleton from "../components/Skeleton";

type Appointment = {
  id: string;
  date: string;
  timeSlot: string;
  status:
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "COMPLETED"
    | "CANCELLED"
    | "RESCHEDULED";
  reason: string | null;
  doctor: { firstName: string; lastName: string; specialization: string };
  department: { name: string };
};

const statusStyles: Record<Appointment["status"], string> = {
  PENDING:
    "bg-yellow-50 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
  APPROVED:
    "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  REJECTED:
    "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  COMPLETED:
    "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700",
  CANCELLED:
    "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700",
  RESCHEDULED:
    "bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
};

function MyAppointmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
          My Appointments
        </h1>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between"
          >
            <div className="flex-1">
              <Skeleton className="h-4 w-40 mb-2" />
              <Skeleton className="h-3 w-56" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="p-6 text-red-600 dark:text-red-400">
        Failed to load appointments.
      </p>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
        My Appointments
      </h1>

      {data?.length === 0 && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            You don't have any appointments yet.
          </p>
        </div>
      )}

      {data?.map((appt) => (
        <div
          key={appt.id}
          className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between"
        >
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              Dr. {appt.doctor.firstName} {appt.doctor.lastName}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {appt.department.name} ·{" "}
              {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
            </p>
            {appt.reason && (
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                {appt.reason}
              </p>
            )}
          </div>
          <span
            className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles[appt.status]}`}
          >
            {appt.status}
          </span>
        </div>
      ))}
    </div>
  );
}

export default MyAppointmentsPage;
