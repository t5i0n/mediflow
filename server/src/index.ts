import express from "express";
import cors from "cors";
import "dotenv/config";
import { prisma } from "./lib/prisma.js";
import authRoutes from "./routes/auth.routes.js";
import { requireAuth } from "./middleware/auth.middleware.js";
import appointmentRoutes from "./routes/appointments.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/appointments", appointmentRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "MediFlow API is running" });
});

app.get("/api/departments", requireAuth, async (req, res) => {
  const departments = await prisma.department.findMany();
  res.json(departments);
});

app.get("/api/doctors", requireAuth, async (req, res) => {
  const doctors = await prisma.doctor.findMany({
    include: { department: true },
  });
  res.json(doctors);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
