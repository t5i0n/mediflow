import Button from "./components/Button";
import Card from "./components/Card";

function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-8 p-6">
      <h1 className="text-4xl font-bold text-blue-600">MediFlow</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Dr. Helen Tesfaye
          </h2>
          <p className="text-slate-500 mb-4">Cardiology · 8 years experience</p>
          <Button onClick={() => alert("Hello from MediFlow!")}>
            Book Appointment
          </Button>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Dr. Liya Alemayehu
          </h2>
          <p className="text-slate-500 mb-4">
            Dermatology · 5 years experience
          </p>
          <Button onClick={() => alert("Hello from MediFlow!")}>
            Book Appointment
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default App;
