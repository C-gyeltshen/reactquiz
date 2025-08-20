import { Play } from "lucide-react";
import { useState } from "react";

interface StartScreenProps {
  onStart: () => void;
}
export default function StartScreen({ onStart }: StartScreenProps) {
  const [isStarting, setIsStarting] = useState(false);

  const handleStartClick = () => {
    if (isStarting) return; // Prevent multiple clicks
    setIsStarting(true);
    onStart();
  };

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        Coding Quiz Game
      </h1>
      <p className="text-gray-600 mb-8">Test your programming knowledge!</p>
      <button
        onClick={handleStartClick}
        disabled={isStarting}
        className={`inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg transition-colors ${
          isStarting ? "opacity-75 cursor-not-allowed" : "hover:bg-blue-700"
        }`}
      >
        <Play className="w-5 h-5 mr-2" />
        Start Quiz
      </button>
    </div>
  );
}
