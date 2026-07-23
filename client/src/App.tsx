import { BrowserRouter, Routes, Route } from "react-router-dom";
import DoctorsPage from "./pages/DoctorsPage";
import DashboardPage from "./pages/DashboardPage";
import LoginPage from "./pages/LoginPage";
import DepartmentsPage from "./pages/DepartmentsPage";
import { AuthProvider } from "./contexts/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import MyAppointmentsPage from "./pages/MyAppointmentsPage";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import { ThemeProvider } from "./contexts/ThemeProvider";
import AppLayout from "./layouts/AppLayout";
import BookAppointmentPage from "./pages/BookAppointmentPage";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctors"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DoctorsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DepartmentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-appointments"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <MyAppointmentsPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor-dashboard"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <DoctorDashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={["ADMIN"]}>
                  <AppLayout>
                    <AdminDashboardPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/book"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <BookAppointmentPage />
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
