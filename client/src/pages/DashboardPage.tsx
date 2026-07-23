import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Calendar, Clock, CheckCircle2, Users, Plus } from "lucide-react";
import { api } from "../api/axios";
import { useAuth } from "../contexts/useAuth";
import StatCard from "../components/StatCard";
import AppointmentListItem from "../components/AppointmentListItem";

type PatientAppointment = {
  id: string;
  status: string;
  date: string;
  timeSlot: string;
  doctor: { firstName: string; lastName: string };
  department: { name: string };
};

type DoctorAppointment = {
  id: string;
  status: string;
  date: string;
  timeSlot: string;
  patient: { firstName: string; lastName: string };
  department: { name: string };
};

function initialsOf(first: string, last: string) {
  return `${first[0] ?? ""}${last[0] ?? ""}`.toUpperCase();
}

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: myAppointments } = useQuery({
    queryKey: ["my-appointments"],
    queryFn: async () =>
      (await api.get<PatientAppointment[]>("/appointments")).data,
    enabled: user?.role === "PATIENT",
  });

  const { data: doctorAppointments } = useQuery({
    queryKey: ["doctor-appointments"],
    queryFn: async () =>
      (await api.get<DoctorAppointment[]>("/appointments/doctor/mine")).data,
    enabled: user?.role === "DOCTOR",
  });

  const { data: allAppointments } = useQuery({
    queryKey: ["admin-appointments"],
    queryFn: async () =>
      (await api.get<DoctorAppointment[]>("/appointments/admin/all")).data,
    enabled: user?.role === "ADMIN",
  });

  const greeting = `Welcome back${user ? `, ${user.email.split("@")[0]}` : ""}`;

  const patientUpcoming =
    myAppointments?.filter(
      (a) => a.status === "PENDING" || a.status === "APPROVED",
    ) ?? [];
  const doctorUpcoming =
    doctorAppointments?.filter(
      (a) => a.status === "PENDING" || a.status === "APPROVED",
    ) ?? [];
  const adminUpcoming =
    allAppointments?.filter(
      (a) => a.status === "PENDING" || a.status === "APPROVED",
    ) ?? [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-4 mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            {greeting}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Here's what's happening today.
          </p>
        </div>

        {user?.role === "PATIENT" && (
          <button
            onClick={() => navigate("/doctors")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-semibold px-4 py-2.5 rounded-lg transition-colors"
          >
            <Plus size={18} />
            Book
          </button>
        )}
      </motion.div>

      {user?.role === "PATIENT" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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

      <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-3">
        Upcoming appointments
      </h2>

      {user?.role === "PATIENT" && patientUpcoming.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          No upcoming appointments.
        </p>
      )}
      {user?.role === "PATIENT" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {patientUpcoming.map((appt) => (
            <AppointmentListItem
              key={appt.id}
              initials={initialsOf(appt.doctor.firstName, appt.doctor.lastName)}
              title={`Dr. ${appt.doctor.firstName} ${appt.doctor.lastName}`}
              subtitle={appt.department.name}
              status={appt.status}
              date={appt.date}
              timeSlot={appt.timeSlot}
            />
          ))}
        </div>
      )}

      {user?.role === "DOCTOR" && doctorUpcoming.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          No upcoming appointments.
        </p>
      )}
      {user?.role === "DOCTOR" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctorUpcoming.map((appt) => (
            <AppointmentListItem
              key={appt.id}
              initials={initialsOf(
                appt.patient.firstName,
                appt.patient.lastName,
              )}
              title={`${appt.patient.firstName} ${appt.patient.lastName}`}
              subtitle={appt.department.name}
              status={appt.status}
              date={appt.date}
              timeSlot={appt.timeSlot}
            />
          ))}
        </div>
      )}

      {user?.role === "ADMIN" && adminUpcoming.length === 0 && (
        <p className="text-slate-400 dark:text-slate-500 text-sm">
          No upcoming appointments.
        </p>
      )}
      {user?.role === "ADMIN" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {adminUpcoming.map((appt) => (
            <AppointmentListItem
              key={appt.id}
              initials={initialsOf(
                appt.patient.firstName,
                appt.patient.lastName,
              )}
              title={`${appt.patient.firstName} ${appt.patient.lastName}`}
              subtitle={appt.department.name}
              status={appt.status}
              date={appt.date}
              timeSlot={appt.timeSlot}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
