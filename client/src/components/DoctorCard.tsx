import { motion } from "framer-motion";
import Card from "./Card";
import Button from "./Button";

type DoctorCardProps = {
  name: string;
  specialty: string;
  yearsExperience: number;
  onBook: () => void;
};

function DoctorCard({
  name,
  specialty,
  yearsExperience,
  onBook,
}: DoctorCardProps) {
  const initials = name
    .replace("Dr. ", "")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="w-full sm:w-72"
    >
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 flex items-center justify-center font-semibold text-lg">
            {initials}
          </div>
          <div>
            <h2 className="font-semibold text-slate-900 dark:text-white">
              {name}
            </h2>
            <p className="text-slate-400 dark:text-slate-500 text-xs">
              {yearsExperience} years experience
            </p>
          </div>
        </div>

        <span className="inline-block bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-medium px-2.5 py-1 rounded-full mb-4">
          {specialty}
        </span>

        <Button onClick={onBook}>Book Appointment</Button>
      </Card>
    </motion.div>
  );
}

export default DoctorCard;
