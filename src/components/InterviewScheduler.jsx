// components/InterviewScheduler.jsx
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import {
  format,
  addMonths,
  subMonths,
  isBefore,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from "date-fns";

const InterviewScheduler = ({ onSlotSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [viewMode, setViewMode] = useState("calendar"); // 'calendar' or 'list'

  // Fetch slots for the current month
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        setLoading(true);
        const month = currentMonth.getMonth() + 1;
        const year = currentMonth.getFullYear();

        const response = await fetch(
          `https://cpi-landing-webpage-backend-production.up.railway.app/api/interview-slots?month=${month}&year=${year}`
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

    if (isBefore(slotDateTime, now)) {
      toast.error("This slot has already passed");
      return;
    }

    if (slot.status !== "open") {
      const statusMessage = {
        booked: "This slot is already booked",
        pending: "This slot is pending approval",
      }[slot.status];
      toast.error(statusMessage);
      return;
    }

    const selectedSlotData = {
      date,
      time: slot.time,
      id: slot.id,
    };

    // Update local state
    setSelectedSlot(selectedSlotData);

    // Only update parent's state, don't trigger submission
    if (onSlotSelect) {
      onSlotSelect(selectedSlotData);
    }

    // Show selection confirmation
    toast.success(
      "Interview slot selected. Click 'Submit Application' when ready."
    );
  };

  const getSlotColor = (slot, dateStr) => {
    const now = new Date();
    const slotDate = new Date(`${dateStr}T${slot.time}`);

    if (isBefore(slotDate, now)) return "bg-gray-100 text-gray-400"; // Outdated

    switch (slot.status) {
      case "booked":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "open":
        return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  const getSlotStats = (dateSlots) => {
    const stats = { open: 0, pending: 0, booked: 0 };
    dateSlots.forEach((slot) => {
      stats[slot.status] = (stats[slot.status] || 0) + 1;
    });
    return stats;
  };

  const renderCalendarView = () => (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Calendar Header */}
      <div className="grid grid-cols-7 bg-gray-50 rounded-t-lg">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-3 text-center text-sm font-medium text-gray-500 border-r border-gray-200 last:border-r-0"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7">
        {calendarDays.map((date, index) => {
          const dateStr = format(date, "yyyy-MM-dd");
          const dateSlots = slots[dateStr] || [];
          const isCurrentMonth = isSameMonth(date, currentMonth);
          const isDateToday = isToday(date);

          return (
            <div
              key={index}
              className={`min-h-32 sm:min-h-40 border-r border-b border-gray-200 last:border-r-0 p-2 sm:p-3 ${
                !isCurrentMonth ? "bg-gray-50" : "bg-white"
              } ${isDateToday ? "bg-blue-50" : ""}`}
            >
              {/* Date Number */}
              <div
                className={`text-sm font-medium mb-1 ${
                  !isCurrentMonth
                    ? "text-gray-400"
                    : isDateToday
                    ? "text-blue-600"
                    : "text-gray-900"
                }`}
              >
                {format(date, "d")}
              </div>

              {/* Slots - Now shows all slots with scrollable container */}
              {dateSlots.length > 0 && (
                <div className="max-h-[200px] overflow-y-auto">
                  <div className="space-y-1">
                    {dateSlots.map((slot) => {
                      const isSlotOutdated = isBefore(
                        new Date(`${dateStr}T${slot.time}`),
                        new Date()
                      );
                      return (
                        <button
                          key={slot.id}
                          className={`w-full text-xs px-1 py-0.5 rounded border text-left transition-colors ${getSlotColor(
                            slot,
                            dateStr
                          )} ${
                            selectedSlot?.id === slot.id
                              ? "ring-2 ring-blue-500 bg-blue-100"
                              : ""
                          }`}
                          onClick={() => handleSlotClick(dateStr, slot)}
                          disabled={slot.status !== "open" || isSlotOutdated}
                        >
                          <div className="flex items-center justify-between">
                            <span className="truncate">{slot.time}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4">
      {Object.entries(slots).map(([date, dateSlots]) => {
        const stats = getSlotStats(dateSlots);
        return (
          <div
            key={date}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="bg-gray-50 px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">
                  {format(new Date(date), "EEEE, MMMM d")}
                </h4>
                <div className="flex gap-2 text-sm">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                    {stats.open} Open
                  </span>
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    {stats.pending} Pending
                  </span>
                  <span className="bg-red-100 text-red-800 px-2 py-1 rounded">
                    {stats.booked} Booked
                  </span>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {dateSlots.map((slot) => (
                  <Button
                    key={slot.id}
                    type="button"
                    variant="outline"
                    className={`h-16 ${getSlotColor(slot, date)} 
                      ${
                        selectedSlot?.id === slot.id
                          ? "ring-2 ring-blue-500 bg-blue-100"
                          : ""
                      }`}
                    onClick={() => handleSlotClick(date, slot)}
                    disabled={
                      slot.status !== "open" ||
                      isBefore(new Date(`${date}T${slot.time}`), new Date())
                    }
                  >
                    <div className="flex flex-col items-center">
                      <Clock className="h-4 w-4 mb-1" />
                      <span className="text-sm font-medium">{slot.time}</span>
                      <span className="text-xs capitalize">{slot.status}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Interview Calendar
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("calendar")}
              >
                Calendar
              </button>
              <button
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  viewMode === "list"
                    ? "bg-white shadow-sm"
                    : "hover:bg-gray-200"
                }`}
                onClick={() => setViewMode("list")}
              >
                List
              </button>
            </div>
          </div>
        </div>

        {/* Month Navigation */}
        <div className="flex items-center justify-between mt-4">
          <Button variant="outline" onClick={() => handleMonthChange("prev")}>
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline ml-2">Previous</span>
          </Button>

          <h3 className="text-lg font-semibold text-gray-900">
            {format(currentMonth, "MMMM yyyy")}
          </h3>

          <Button variant="outline" onClick={() => handleMonthChange("next")}>
            <span className="hidden sm:inline mr-2">Next</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-200 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-200 rounded"></div>
            <span>Pending</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-200 rounded"></div>
            <span>Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded"></div>
            <span>Expired</span>
          </div>
        </div>
      </div>

      {/* Selected Slot Info */}
      {selectedSlot && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">
                Selected Interview Slot
              </h4>
              <p className="text-sm text-gray-600">
                {format(new Date(selectedSlot.date), "EEEE, MMMM d, yyyy")} at{" "}
                {selectedSlot.time}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedSlot(null);
                if (onSlotSelect) {
                  onSlotSelect(null);
                }
                toast.info("Selection cleared");
              }}
              className="ml-auto text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Calendar Content */}
      {loading ? (
        <div className="flex justify-center items-center py-12 bg-white rounded-lg shadow-sm border">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-500">Loading interview slots...</p>
          </div>
        </div>
      ) : (
        <div>
          {viewMode === "calendar" ? renderCalendarView() : renderListView()}
        </div>
      )}

      {/* Summary Stats */}
      {!loading && Object.keys(slots).length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-4">
          <h4 className="font-medium text-gray-900 mb-3">Monthly Summary</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {(() => {
              const totalStats = { open: 0, pending: 0, booked: 0, total: 0 };
              Object.values(slots).forEach((dateSlots) => {
                dateSlots.forEach((slot) => {
                  totalStats[slot.status] = (totalStats[slot.status] || 0) + 1;
                  totalStats.total += 1;
                });
              });
              return (
                <>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {totalStats.total}
                    </div>
                    <div className="text-sm text-gray-500">Total Slots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {totalStats.open}
                    </div>
                    <div className="text-sm text-gray-500">Available</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {totalStats.pending}
                    </div>
                    <div className="text-sm text-gray-500">Pending</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {totalStats.booked}
                    </div>
                    <div className="text-sm text-gray-500">Booked</div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewScheduler;
