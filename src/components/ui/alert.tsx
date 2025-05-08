import { AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  title?: string;
  description: string;
  variant?: "default" | "destructive";
  className?: string;
}

export function Alert({
  title,
  description,
  variant = "default",
  className,
}: AlertProps) {
  return (
    <div
      className={cn(
        "border p-4 rounded-md flex items-start gap-3",
        variant === "destructive"
          ? "bg-red-50 border-red-300 text-red-800"
          : "bg-gray-50 border-gray-300 text-gray-800",
        className
      )}
    >
      <AlertTriangle className="w-5 h-5 mt-1" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <p className="text-sm">{description}</p>
      </div>
    </div>
  );
}
