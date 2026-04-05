import { useState } from "react";
import axios from "axios";

export default function App() {
  const [date, setDate] = useState("");
  const [resource, setResource] = useState("Room");
  const [slots, setSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchSlots = async () => {
    if (!date) return alert("Please select a date");

    setLoading(true);
    try {
    const res = await axios.get("http://localhost:5000/api/slots", {
      params: { date, resource },
    });
    setSlots(res.data);
    fetchBookings();
    } catch (err) {
      alert("Error fetching slots");
    }
    setLoading(false);
  };


  // Fetch existing bookings
  const fetchBookings = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bookings/${date}/${resource}`
      );
      setBookings(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Book a slot
  const bookSlot = async () => {
     if (!name || !email || !selectedTime) {
      return alert("Please fill all fields");
    }

    try {
    await axios.post("http://localhost:5000/api/bookings", {
      name,
      email,
      date,
      time: selectedTime,
      resource,
    });

     setMessage("✅ Booking successful!");
      setName("");
      setEmail("");
      setSelectedTime(null);

      fetchSlots();
    } catch (err) {
      alert("Booking failed (slot may already be taken)");
    }
  };

        // Delete booking
  const deleteBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${id}`);
      setMessage("❌ Booking cancelled");

      fetchSlots();
    } catch (err) {
      alert("Error deleting booking");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-xl">
        
        <h1 className="text-3xl font-bold mb-6 text-center">
          📅 Hotel Resturant Booking System
        </h1>


      {/* Resource */}
      
       <div className="flex gap-2 mb-4">
        <select
        className="border p-2 flex-1"
        value={resource}
        onChange={(e) => setResource(e.target.value)}
      >
        <option>Room</option>
        <option>Table</option>
      </select>

      {/* Date */}
      <input
        type="date"
        className="border p-2 flext-1"
        onChange={(e) => setDate(e.target.value)}
      />
      </div>

      <button
        onClick={fetchSlots}
        className="bg-blue-500 text-white px-4 py-2 w-full rounded-lg"
      >
        {loading ? "Loading..." : "Check Availability"}
      </button>

      {/* Slots */}
      <div className="mt-4 flex flex-wrap gap-2">
        {slots.length === 0 && !loading && (
           <p className="text-gray-500">No slots available</p>
          )}

        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedTime(slot)}
            className={`px-4 py-2 rounded-lg border transition ${
              selectedTime === slot
                ? "bg-green-500 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            {slot}
          </button>
        ))}
      </div>

      {/* Booking Form */}
      {selectedTime && (
        <div className="mt-6">
          <h2 className="font-semibold mb-2">
              Selected: {selectedTime}
            </h2>

          <input
            placeholder="Name"
            value={name}
            className="border p-2 w-full mb-2"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            value={email}
            className="border p-2 w-full mb-2"
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={bookSlot}
            className="bg-green-500 text-white px-4 py-2 w-full rounded-lg"
          >
            Book Now
          </button>
        </div>
      )}

      {/*Message */}
      {message && (
        <p className="mt-4 text-center text-sm text-gray-700">
          {messgae}
        </p>
      )}

      {/* Booking List */}
      <div className="mt-6">
        <h2 className="font-bold mb-2">📋 Bookings</h2>
      {bookings.length === 0 && (
            <p className="text-gray-500">No bookings yet</p>
          )}

          {bookings.map((b) => (
            <div
              key={b.id}
              className="border p-2 mb-2 flex justify-between items-center rounded-lg"
            >
              <span>
                {b.time} - {b.name}
              </span>

              <button
                onClick={() => deleteBooking(b.id)}
                className="text-red-500 hover:underline"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
