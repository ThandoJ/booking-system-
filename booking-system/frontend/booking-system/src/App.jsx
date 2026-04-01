import { useState } from "react";
import axios from "axios";

export default function App() {
  const [date, setDate] = useState("");
  const [resource, setResource] = useState("Room");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const fetchSlots = async () => {
    const res = await axios.get("http://localhost:5000/api/slots", {
      params: { date, resource },
    });
    setSlots(res.data);
  };

  const bookSlot = async () => {
    await axios.post("http://localhost:5000/api/bookings", {
      name,
      email,
      date,
      time: selectedTime,
      resource,
    });

    alert("Booking successful!");
    fetchSlots();
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">
        Booking System
      </h1>

      {/* Resource */}
      <select
        className="border p-2 mr-2"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
      >
        <option>Room</option>
        <option>Table</option>
      </select>

      {/* Date */}
      <input
        type="date"
        className="border p-2 mr-2"
        onChange={(e) => setDate(e.target.value)}
      />

      <button
        onClick={fetchSlots}
        className="bg-blue-500 text-white px-4 py-2"
      >
        Check Availability
      </button>

      {/* Slots */}
      <div className="mt-4 flex gap-2 flex-wrap">
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedTime(slot)}
            className={`px-4 py-2 border ${
              selectedTime === slot
                ? "bg-green-500 text-white"
                : ""
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Booking Form */}
      {selectedTime && (
        <div className="mt-6">
          <input
            placeholder="Name"
            className="border p-2 mr-2"
            onChange={(e) => setName(e.target.value)}
          />
          <input
            placeholder="Email"
            className="border p-2 mr-2"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={bookSlot}
            className="bg-green-500 text-white px-4 py-2"
          >
            Book Now
          </button>
        </div>
      )}
    </div>
  );
}