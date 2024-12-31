import { Ban, Check } from "lucide-react";
import { useEffect, useState } from "react";

type NotificationProps = {
  message: string;
  status: "success" | "error";
};

export default function Notification({ message, status }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false); // Hide the notification after 4 seconds
    }, 4000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  return (
    <>
      {isVisible && (
        <div
          className="fixed top-4 right-4 z-700 w-72 shadow-lg rounded-lg overflow-hidden"
        >
          <div
            className={`p-4 ${
              status === "success" ? "bg-teal-500" : "bg-red-500"
            } text-white flex items-center`}
          >
            {status === "success" ? (
              <span className="w-6 h-6 mr-2"><Check /></span>
            ) : (
              <span className="w-6 h-6 mr-2"><Ban /></span>
            )}
            <p className="flex-1">{message}</p>
          </div>
          <div
            className={`h-1 ${
              status === "success" ? "bg-teal-300" : "bg-red-300"
            }`}
          />
        </div>
      )}
    </>
  );
}
