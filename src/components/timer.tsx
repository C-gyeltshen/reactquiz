import { TimerIcon } from "lucide-react";

interface TimerProps {
  timeLeft: number;
}
export default function Timer({ timeLeft }: TimerProps) {
  // Add warning class when time is below or equal to 10 seconds
  const isLowTime = timeLeft <= 10;
  return (
    <div
      className={`flex items-center justify-center space-x-2 text-2xl font-bold mb-8 ${
        isLowTime ? "text-red-600 red warning danger" : "text-gray-700"
      }`}
      data-testid="timer"
    >
      <TimerIcon className={`w-6 h-6 ${isLowTime ? "animate-pulse" : ""}`} />
      <span>{timeLeft}s</span>
    </div>
  );
}
