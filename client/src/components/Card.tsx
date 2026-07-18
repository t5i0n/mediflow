type CardProps = {
  children: React.ReactNode;
};

function Card({ children }: CardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100">
      {children}
    </div>
  );
}

export default Card;
