import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
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

  const { data, isLoading, isError } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => {
      const response = await api.get<Doctor[]>("/doctors");
      return response.data;
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

      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
        {data?.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={`Dr. ${doctor.firstName} ${doctor.lastName}`}
            specialty={doctor.specialization}
            yearsExperience={doctor.yearsExperience ?? 0}
            onBook={() =>
              setBookedDoctor(`Dr. ${doctor.firstName} ${doctor.lastName}`)
            }
          />
        ))}
      </div>
    </div>
  );
}

export default DoctorsPage;
