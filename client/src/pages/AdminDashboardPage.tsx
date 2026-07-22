import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

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
  PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
  APPROVED: "bg-green-50 text-green-700 border-green-200",
  REJECTED: "bg-red-50 text-red-700 border-red-200",
  COMPLETED: "bg-slate-100 text-slate-600 border-slate-200",
  CANCELLED: "bg-slate-100 text-slate-400 border-slate-200",
  RESCHEDULED: "bg-blue-50 text-blue-700 border-blue-200",
};

function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments/admin/all");
      return response.data;
    },
  });

  if (isLoading)
    return <p className="p-6 text-slate-500">Loading system data...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Failed to load appointments.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-slate-900 mt-4 mb-2">
        Admin Dashboard — All Appointments
      </h1>

      <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500 text-left">
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
              <tr key={appt.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-800">
                  {appt.patient.firstName} {appt.patient.lastName}
                </td>
                <td className="px-4 py-3 text-slate-800">
                  Dr. {appt.doctor.firstName} {appt.doctor.lastName}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {appt.department.name}
                </td>
                <td className="px-4 py-3 text-slate-500">
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
