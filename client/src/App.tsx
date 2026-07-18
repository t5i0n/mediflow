import Button from "./components/Button";

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-4xl font-bold text-blue-600">MediFlow</h1>
      <Button onClick={() => alert("Hello from MediFlow!")}>
        Book Appointment
      </Button>
      <Button onClick={() => alert("Cancel Appointment!")}>
        Cancel Appointment
      </Button>
    </div>
  );
}

export default App;
