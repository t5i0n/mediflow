import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "../api/axios";
import { createAppointment } from "../api/appointments";
import DoctorCard from "../components/DoctorCard";
import BookingModal from "../components/BookingModal";
import Skeleton from "../components/Skeleton";

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
  const [activeDoctor, setActiveDoctor] = useState<Doctor | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get<Doctor[]>("/doctors");
      return response.data;
    },
  });

  const bookingMutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: () => {
      setBookedDoctor(
        activeDoctor
          ? `Dr. ${activeDoctor.firstName} ${activeDoctor.lastName}`
          : "the doctor",
      );
      setBookingError(null);
      setActiveDoctor(null);
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        setBookingError(error.response.data.error);
      } else {
        setBookingError("Failed to book appointment");
      }
    },
  });

  if (isLoading) {
    return (
      <div className="p-6 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Our Doctors</h1>
        <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="w-full sm:w-72 bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <Skeleton className="h-5 w-24 mb-4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }
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
            onBook={() => {
              setBookingError(null);
              setActiveDoctor(doctor);
            }}
          />
        ))}
      </div>

      {activeDoctor && (
        <BookingModal
          isOpen={!!activeDoctor}
          onClose={() => setActiveDoctor(null)}
          doctorId={activeDoctor.id}
          doctorName={`${activeDoctor.firstName} ${activeDoctor.lastName}`}
          onConfirm={(date, timeSlot) =>
            bookingMutation.mutate({
              doctorId: activeDoctor.id,
              date,
              timeSlot,
              reason: "General consultation",
            })
          }
        />
      )}
    </div>
  );
}

export default DoctorsPage;
