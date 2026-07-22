import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

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
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-slate-100 text-slate-400 border-slate-200",
  RESCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
};

function MyAppointmentsPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments");
      return response.data;
    },
  });

  if (isLoading)
    return <p className="p-6 text-slate-500">Loading your appointments...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Failed to load appointments.</p>;

  return (
    <div className="p-6 max-w-2xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
        My Appointments
      </h1>

      {data?.length === 0 && (
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8 text-center">
          <p className="text-slate-500">You don't have any appointments yet.</p>
        </div>
      )}

      {data?.map((appt) => (
        <div
          key={appt.id}
          className="bg-white rounded-2xl shadow-md border border-slate-100 p-5 flex items-center justify-between"
        >
          <div>
            <h2 className="font-semibold text-slate-900">
              Dr. {appt.doctor.firstName} {appt.doctor.lastName}
            </h2>
            <p className="text-slate-500 text-sm">
              {appt.department.name} ·{" "}
              {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}
            </p>
            {appt.reason && (
              <p className="text-slate-400 text-sm mt-1">{appt.reason}</p>
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
