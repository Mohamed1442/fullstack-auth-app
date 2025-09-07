import { cn } from "@utils/cn";

type LoaderSize = "xs" | "sm" | "md" | "lg";

interface MainLoaderProps {
  size?: LoaderSize;
  className?: string;
}

const sizeClasses: Record<LoaderSize, string> = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-12 h-12",
  lg: "w-20 h-20",
};

const MainLoader = ({ size = "md", className }: MainLoaderProps) => {
  return (
    <div
      className="flex items-center justify-center"
      role="status"
      aria-label="Loading"
    >
      <div
        className={cn(
          "border-4 border-white border-b-primary rounded-full animate-rotate",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
};

export default MainLoader;
