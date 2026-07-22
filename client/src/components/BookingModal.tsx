import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";
import Modal from "./Modal";

type Slot = { time: string; available: boolean };

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  doctorId: string;
  doctorName: string;
  onConfirm: (date: string, timeSlot: string) => void;
};

function BookingModal({
  isOpen,
  onClose,
  doctorId,
  doctorName,
  onConfirm,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const { data: slots, isLoading } = useQuery({
    queryKey: ["slots", doctorId, selectedDate],
    queryFn: async () => {
      const response = await api.get<Slot[]>(`/doctors/${doctorId}/slots`, {
        params: { date: selectedDate },
      });
      return response.data;
    },
    enabled: selectedDate !== "", // only fetch once a date is picked
  });

  function handleConfirm() {
    if (selectedDate && selectedTime) {
      onConfirm(selectedDate, selectedTime);
      setSelectedDate("");
      setSelectedTime(null);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Book with ${doctorName}`}>
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Select a date
          </label>
          <input
            type="date"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime(null);
            }}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {selectedDate && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Select a time
            </label>
            {isLoading && (
              <p className="text-slate-500 text-sm">Loading slots...</p>
            )}
            <div className="grid grid-cols-4 gap-2">
              {slots?.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => setSelectedTime(slot.time)}
                  className={`text-sm py-2 rounded-lg border transition-colors ${
                    !slot.available
                      ? "bg-slate-100 text-slate-300 border-slate-100 cursor-not-allowed"
                      : selectedTime === slot.time
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-slate-700 border-slate-300 hover:border-blue-400"
                  }`}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleConfirm}
          disabled={!selectedDate || !selectedTime}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg transition-colors mt-2"
        >
          Confirm Booking
        </button>
      </div>
    </Modal>
  );
}

export default BookingModal;
