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

app.get("/api/doctors/:id/slots", requireAuth, async (req, res) => {
  const id = req.params.id as string;
  const { date } = req.query;

  if (typeof date !== "string") {
    return res
      .status(400)
      .json({ error: "date query param is required (YYYY-MM-DD)" });
  }

  // Generate every possible slot: 09:00 to 17:00, every 30 minutes
  const allSlots: string[] = [];
  for (let hour = 9; hour < 17; hour++) {
    allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
    allSlots.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  // Find which of those are already booked for this doctor on this date
  const startOfDay = new Date(`${date}T00:00:00.000Z`);
  const endOfDay = new Date(`${date}T23:59:59.999Z`);

  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      doctorId: id,
      date: { gte: startOfDay, lte: endOfDay },
      status: { notIn: ["CANCELLED", "REJECTED"] },
    },
    select: { timeSlot: true },
  });

  const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot));

  const slots = allSlots.map((time) => ({
    time,
    available: !bookedSlots.has(time),
  }));

  res.json(slots);
});
