import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import BookingStepper from "../components/BookingStepper";

type Department = {
  id: string;
  name: string;
  description: string | null;
};

type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  department: { id: string; name: string };
};

function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await api.get<Department[]>("/departments")).data,
  });

  const { data: doctors, isLoading: doctorsLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: async () => (await api.get<Doctor[]>("/doctors")).data,
    enabled: step === 2,
  });

  const doctorsInDepartment =
    doctors?.filter((doc) => doc.department.id === selectedDepartment?.id) ??
    [];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-1">
        New appointment
      </p>
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
        Book an appointment
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mb-8">
        Four steps. About ninety seconds.
      </p>

      <BookingStepper currentStep={step} />

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Which department?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Choose the medical specialty you need.
            </p>

            {isLoading && (
              <p className="text-slate-400 text-sm">Loading departments...</p>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {departments?.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept)}
                  className={`text-left px-4 py-3 rounded-xl border font-medium transition-colors ${
                    selectedDepartment?.id === dept.id
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-blue-300"
                  }`}
                >
                  {dept.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && selectedDepartment && (
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Choose a doctor
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              {doctorsInDepartment.length} specialist
              {doctorsInDepartment.length !== 1 ? "s" : ""} in{" "}
              {selectedDepartment.name}.
            </p>

            {doctorsLoading && (
              <p className="text-slate-400 text-sm">Loading doctors...</p>
            )}

            <div className="flex flex-col gap-3">
              {doctorsInDepartment.map((doc) => {
                const initials =
                  `${doc.firstName[0]}${doc.lastName[0]}`.toUpperCase();
                return (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc)}
                    className={`flex items-center gap-3 text-left px-4 py-3 rounded-xl border transition-colors ${
                      selectedDoctor?.id === doc.id
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                        : "border-slate-200 dark:border-slate-700 hover:border-blue-300"
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-semibold text-sm shrink-0">
                      {initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        Dr. {doc.firstName} {doc.lastName}
                      </p>
                      <p className="text-slate-500 dark:text-slate-400 text-sm">
                        {doc.specialization}
                      </p>
                    </div>
                  </button>
                );
              })}

              {!doctorsLoading && doctorsInDepartment.length === 0 && (
                <p className="text-slate-400 text-sm">
                  No doctors available in this department yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          disabled={step === 1}
          onClick={() => setStep((s) => s - 1)}
          className="px-4 py-2 rounded-lg font-medium text-slate-500 dark:text-slate-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          ← Back
        </button>
        <button
          disabled={
            (step === 1 && !selectedDepartment) ||
            (step === 2 && !selectedDoctor)
          }
          onClick={() => setStep((s) => s + 1)}
          className="px-5 py-2 rounded-lg font-medium bg-slate-800 dark:bg-slate-700 text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-900 dark:hover:bg-slate-600 transition-colors"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}

export default BookAppointmentPage;
