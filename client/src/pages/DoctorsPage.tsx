import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../api/axios";
import { createAppointment } from "../api/appointments";
import DoctorCard from "../components/DoctorCard";

type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  yearsExperience: number | null;
  department: { name: string };
};

function DoctorsPage() {
  const [bookedDoctor, setBookedDoctor] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get<Doctor[]>("/doctors");
      return response.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: (_, variables) => {
      const doctor = data?.find((d) => d.id === variables.doctorId);
      setBookedDoctor(
        doctor ? `Dr. ${doctor.firstName} ${doctor.lastName}` : "the doctor",
      );
      setBookingError(null);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setBookingError(error.response.data.error);
      } else {
        setBookingError("Failed to book appointment");
      }
      setBookedDoctor(null);
    },
  });

  if (isLoading)
    return <p className="p-6 text-slate-500">Loading doctors...</p>;
  if (isError)
    return <p className="p-6 text-red-600">Failed to load doctors.</p>;

  return (
    <div className="p-6 flex flex-col items-center gap-8">
      <h1 className="text-3xl font-bold text-slate-900 mt-4">Our Doctors</h1>

      {bookedDoctor && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-medium">
          ✅ Appointment booked with {bookedDoctor}!
        </div>
      )}
      {bookingError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg font-medium">
          {bookingError}
        </div>
      )}

      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
        {data?.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            specialty={doctor.specialization}
            yearsExperience={doctor.yearsExperience ?? 0}
            onBook={() =>
              bookingMutation.mutate({
                doctorId: doctor.id,
                date: "2026-08-01",
                timeSlot: "10:00",
                reason: "General consultation",
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorsPage;
