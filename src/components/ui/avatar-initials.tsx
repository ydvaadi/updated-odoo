import { cn } from "@/lib/utils";

interface AvatarInitialsProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const AvatarInitials = ({ initials, size = "md", className }: AvatarInitialsProps) => {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
  };

  return (
    <div
      className={cn(
        "avatar-initials flex items-center justify-center rounded-full",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};