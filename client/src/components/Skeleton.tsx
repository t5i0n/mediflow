type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`bg-slate-200 rounded-lg animate-pulse ${className}`} />
  );
}

export default Skeleton;
