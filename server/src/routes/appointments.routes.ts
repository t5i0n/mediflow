import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import {
  requireAuth,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = Router();

const createAppointmentSchema = z.object({
  doctorId: z.string(),
  date: z.string(), // "2026-08-01"
  timeSlot: z.string(), // "09:30"
  reason: z.string().optional(),
});

router.post("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  // 1. Validate the incoming data shape
  const parsed = createAppointmentSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid appointment data" });
  }
  const { doctorId, date, timeSlot, reason } = parsed.data;

  // 2. Find the Patient profile linked to the logged-in user
  const patient = await prisma.patient.findUnique({
    where: { userId: req.user!.userId },
  });
  if (!patient) {
    return res
      .status(403)
      .json({ error: "Only patients can book appointments" });
  }

  // 3. Check the doctor actually exists
  const doctor = await prisma.doctor.findUnique({ where: { id: doctorId } });
  if (!doctor) {
    return res.status(404).json({ error: "Doctor not found" });
  }

  // 4. Try to create the appointment — the database itself blocks double-booking
  try {
    const appointment = await prisma.appointment.create({
      data: {
        patientId: patient.id,
        doctorId,
        departmentId: doctor.departmentId,
        date: new Date(date),
        timeSlot,
        reason,
      },
      include: { doctor: true, department: true },
    });
    res.status(201).json(appointment);
  } catch (error) {
    console.error("Appointment creation error:", error);

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return res
        .status(409)
        .json({ error: "This time slot is already booked" });
    }

    res.status(500).json({ error: "Failed to create appointment" });
  }
});

router.get("/", requireAuth, async (req: AuthenticatedRequest, res) => {
  const patient = await prisma.patient.findUnique({
    where: { userId: req.user!.userId },
  });
  if (!patient) {
    return res
      .status(403)
      .json({ error: "Only patients can view their appointments" });
  }

  const appointments = await prisma.appointment.findMany({
    where: { patientId: patient.id },
    include: { doctor: true, department: true },
    orderBy: { date: "asc" },
  });
  res.json(appointments);
});

// Get appointments for the logged-in doctor
router.get(
  "/doctor/mine",
  requireAuth,
  requireRole("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    const appointments = await prisma.appointment.findMany({
      where: { doctorId: doctor.id },
      include: { patient: true, department: true },
      orderBy: { date: "asc" },
    });
    res.json(appointments);
  },
);

// Update an appointment's status (approve/reject/complete)
router.patch(
  "/:id/status",
  requireAuth,
  requireRole("DOCTOR"),
  async (req: AuthenticatedRequest, res) => {
    const id = req.params.id as string;
    const { status } = req.body;

    const validStatuses = ["APPROVED", "REJECTED", "COMPLETED"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const doctor = await prisma.doctor.findUnique({
      where: { userId: req.user!.userId },
    });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor profile not found" });
    }

    // Make sure this appointment actually belongs to THIS doctor
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment || appointment.doctorId !== doctor.id) {
      return res
        .status(403)
        .json({ error: "You can't modify this appointment" });
    }

    const updated = await prisma.appointment.update({
      where: { id },
      data: { status },
      include: { patient: true, department: true },
    });

    res.json(updated);
  },
);

// Admin: view ALL appointments across the system
router.get(
  "/admin/all",
  requireAuth,
  requireRole("ADMIN"),
  async (req: AuthenticatedRequest, res) => {
    const appointments = await prisma.appointment.findMany({
      include: { patient: true, doctor: true, department: true },
      orderBy: { date: "desc" },
    });
    res.json(appointments);
  },
);
export default router;
