type SkeletonProps = {
  className?: string;
};

function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse ${className}`}
    />
  );
}

export default Skeleton;
