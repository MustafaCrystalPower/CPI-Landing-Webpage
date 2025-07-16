// components/InterviewScheduler.jsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { format, addMonths, subMonths, isBefore } from "date-fns";

const InterviewScheduler = ({ onSlotSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch slots for the current month
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();

        const response = await fetch(
          `http://cpi-landing-webpage-backend-production.up.railway.app/api/interview-slots?month=${month}&year=${year}`
        );

        if (!response.ok) throw new Error("Failed to fetch slots");

        const data = await response.json();
        setSlots(data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [currentMonth]);

  const handleMonthChange = (direction) => {
    setCurrentMonth(
      direction === "next"
        ? addMonths(currentMonth, 1)
        : subMonths(currentMonth, 1)
    );
  };

  const handleSlotClick = (date, slot) => {
    const now = new Date();
    const slotDateTime = new Date(`${date}T${slot.time}`);

    // Check if slot is outdated
    if (isBefore(slotDateTime, now)) {
      toast.error("This slot has already passed");
      return;
    }

    // Check slot status
    if (slot.status !== "open") {
      const statusMessage = {
        booked: "This slot is already booked",
        pending: "This slot is pending approval",
      }[slot.status];

      toast.error(statusMessage);
      return;
    }

    setSelectedSlot({ date, time: slot.time, id: slot._id });
    onSlotSelect({ date, time: slot.time, id: slot._id });
  };

  const getSlotColor = (slot, dateStr) => {
    const now = new Date();
    const slotDate = new Date(`${dateStr}T${slot.time}`);

    if (isBefore(slotDate, now)) return "bg-gray-200"; // Outdated

    switch (slot.status) {
      case "booked":
        return "bg-red-200";
      case "pending":
        return "bg-yellow-200";
      case "open":
        return "bg-green-200";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => handleMonthChange("prev")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="text-lg font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <Button variant="outline" onClick={() => handleMonthChange("next")}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(slots).map(([date, dateSlots]) => (
            <div key={date} className="space-y-2">
              <h4 className="font-medium">
                {format(new Date(date), "EEEE, MMMM d")}
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {dateSlots.map((slot) => (
                  <Button
                    key={slot._id}
                    type="button"
                    variant="outline"
                    className={`h-16 ${getSlotColor(slot, date)} 
                      ${selectedSlot?.id === slot._id ? "ring-2 ring-blue-500" : ""}`}
                    onClick={() => handleSlotClick(date, slot)}
                    disabled={
                      slot.status !== "open" ||
                      isBefore(new Date(`${date}T${slot.time}`), new Date())
                    }
                  >
                    <div className="flex flex-col items-center">
                      <span>{slot.time}</span>
                      <span className="text-xs capitalize">{slot.status}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;