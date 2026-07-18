import Button from "./Button";
import Card from "./Card";

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
  return (
    <Card>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">{name}</h2>
      <p className="text-slate-500 mb-4">
        {specialty} · {yearsExperience} years experience
      </p>
      <Button onClick={onBook}>Book Appointment</Button>
    </Card>
  );
}

export default DoctorCard;
