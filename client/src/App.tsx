import Navbar from "./components/Navbar";
import DoctorCard from "./components/DoctorCard";

const doctors = [
  { name: "Dr. Helen Tesfaye", specialty: "Cardiology", yearsExperience: 8 },
  { name: "Dr. Liya Alemayehu", specialty: "Dermatology", yearsExperience: 5 },
  { name: "Dr. Samson Bekele", specialty: "Neurology", yearsExperience: 12 },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="p-6 flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold text-slate-900 mt-4">Our Doctors</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor.name}
              name={doctor.name}
              specialty={doctor.specialty}
              yearsExperience={doctor.yearsExperience}
              onBook={() => alert(`Booking with ${doctor.name}!`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
