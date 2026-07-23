import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import Skeleton from "../components/Skeleton";

type Appointment = {
  id: string;
  date: string;
  timeSlot: string;
  status: string;
  patient: { firstName: string; lastName: string };
  doctor: { firstName: string; lastName: string };
  department: { name: string };
};

const statusStyles: Record<string, string> = {
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

function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments/admin/all");
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
          Admin Dashboard — All Appointments
        </h1>
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
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
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4 mb-2">
        Admin Dashboard — All Appointments
      </h1>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Doctor</th>
              <th className="px-4 py-3 font-medium">Department</th>
              <th className="px-4 py-3 font-medium">Date / Time</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((appt) => (
              <tr
                key={appt.id}
                className="border-t border-slate-100 dark:border-slate-800"
              >
                <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                  {appt.patient.firstName} {appt.patient.lastName}
                </td>
                <td className="px-4 py-3 text-slate-800 dark:text-slate-200">
                  Dr. {appt.doctor.firstName} {appt.doctor.lastName}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {appt.department.name}
                </td>
                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                  {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full border ${statusStyles[appt.status]}`}
                  >
                    {appt.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboardPage;
