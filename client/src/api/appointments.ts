import { api } from "./axios";

type CreateAppointmentInput = {
  doctorId: string;
  date: string;
  timeSlot: string;
  reason?: string;
};

export async function createAppointment(data: CreateAppointmentInput) {
  const response = await api.post("/appointments", data);
  return response.data;
}
