import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import BookingStepper from "../components/BookingStepper";

type Department = {
  id: string;
  name: string;
  description: string | null;
};

function BookAppointmentPage() {
  const [step, setStep] = useState(1);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const { data: departments, isLoading } = useQuery({
    queryKey: ["departments"],
    queryFn: async () => (await api.get<Department[]>("/departments")).data,
  });

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
          disabled={step === 1 && !selectedDepartment}
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
