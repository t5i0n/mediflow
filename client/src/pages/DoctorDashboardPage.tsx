import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  patient: { firstName: string; lastName: string };
  department: { name: string };
};

function DoctorDashboardPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>(
        "/appointments/doctor/mine",
      );
      return response.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await api.patch(`/appointments/${id}/status`, {
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["doctor-appointments"] });
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex flex-col gap-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
          Doctor Dashboard
        </h1>
        <div className="flex flex-col gap-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between"
            >
              <div className="flex-1">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-48" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-8 w-20 rounded-lg" />
                <Skeleton className="h-8 w-20 rounded-lg" />
              </div>
            </div>
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

  const pending = data?.filter((a) => a.status === "PENDING") ?? [];
  const upcoming = data?.filter((a) => a.status === "APPROVED") ?? [];

  return (
    <div className="p-6 max-w-3xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mt-4">
        Doctor Dashboard
      </h1>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Pending Requests ({pending.length})
        </h2>
        {pending.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            No pending requests.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {pending.map((appt) => (
            <div
              key={appt.id}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {appt.patient.firstName} {appt.patient.lastName}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}{" "}
                  · {appt.department.name}
                </p>
                {appt.reason && (
                  <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                    {appt.reason}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    statusMutation.mutate({ id: appt.id, status: "APPROVED" })
                  }
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    statusMutation.mutate({ id: appt.id, status: "REJECTED" })
                  }
                  className="bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-700 dark:text-red-400 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
          Upcoming ({upcoming.length})
        </h2>
        {upcoming.length === 0 && (
          <p className="text-slate-400 dark:text-slate-500 text-sm">
            Nothing approved yet.
          </p>
        )}
        <div className="flex flex-col gap-3">
          {upcoming.map((appt) => (
            <div
              key={appt.id}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-md border border-slate-100 dark:border-slate-800 p-5 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {appt.patient.firstName} {appt.patient.lastName}
                </h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm">
                  {new Date(appt.date).toLocaleDateString()} at {appt.timeSlot}{" "}
                  · {appt.department.name}
                </p>
              </div>
              <button
                onClick={() =>
                  statusMutation.mutate({ id: appt.id, status: "COMPLETED" })
                }
                className="bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                Mark Completed
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default DoctorDashboardPage;
