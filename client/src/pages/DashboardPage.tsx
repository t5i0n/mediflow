import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Calendar, Clock, CheckCircle2, Users } from "lucide-react";
import { api } from "../api/axios";
import { useAuth } from "../contexts/useAuth";
import StatCard from "../components/StatCard";

type Appointment = {
  id: string;
  status: string;
  date: string;
  timeSlot: string;
};

function DashboardPage() {
  const { user } = useAuth();

  const { data: myAppointments } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments");
      return response.data;
    },
    enabled: user?.role === "PATIENT",
  });

  const { data: doctorAppointments } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>(
        "/appointments/doctor/mine",
      );
      return response.data;
    },
    enabled: user?.role === "DOCTOR",
  });

  const { data: allAppointments } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () => {
      const response = await api.get<Appointment[]>("/appointments/admin/all");
      return response.data;
    },
    enabled: user?.role === "ADMIN",
  });

  const greeting = `Welcome back${user ? `, ${user.email.split("@")[0]}` : ""}`;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-900">{greeting}</h1>
        <p className="text-slate-500 mt-1">Here's what's happening today.</p>
      </motion.div>

      {user?.role === "PATIENT" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Upcoming appointments"
            value={
              myAppointments?.filter((a) => a.status === "APPROVED").length ?? 0
            }
            icon={<Calendar size={20} />}
            accent="blue"
            delay={0}
          />
          <StatCard
            label="Pending requests"
            value={
              myAppointments?.filter((a) => a.status === "PENDING").length ?? 0
            }
            icon={<Clock size={20} />}
            accent="amber"
            delay={0.1}
          />
          <StatCard
            label="Completed visits"
            value={
              myAppointments?.filter((a) => a.status === "COMPLETED").length ??
              0
            }
            icon={<CheckCircle2 size={20} />}
            accent="green"
            delay={0.2}
          />
        </div>
      )}

      {user?.role === "DOCTOR" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Pending requests"
            value={
              doctorAppointments?.filter((a) => a.status === "PENDING")
                .length ?? 0
            }
            icon={<Clock size={20} />}
            accent="amber"
            delay={0}
          />
          <StatCard
            label="Approved upcoming"
            value={
              doctorAppointments?.filter((a) => a.status === "APPROVED")
                .length ?? 0
            }
            icon={<Calendar size={20} />}
            accent="blue"
            delay={0.1}
          />
          <StatCard
            label="Completed"
            value={
              doctorAppointments?.filter((a) => a.status === "COMPLETED")
                .length ?? 0
            }
            icon={<CheckCircle2 size={20} />}
            accent="green"
            delay={0.2}
          />
        </div>
      )}

      {user?.role === "ADMIN" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            label="Total appointments"
            value={allAppointments?.length ?? 0}
            icon={<Users size={20} />}
            accent="violet"
            delay={0}
          />
          <StatCard
            label="Pending across system"
            value={
              allAppointments?.filter((a) => a.status === "PENDING").length ?? 0
            }
            icon={<Clock size={20} />}
            accent="amber"
            delay={0.1}
          />
          <StatCard
            label="Completed"
            value={
              allAppointments?.filter((a) => a.status === "COMPLETED").length ??
              0
            }
            icon={<CheckCircle2 size={20} />}
            accent="green"
            delay={0.2}
          />
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
