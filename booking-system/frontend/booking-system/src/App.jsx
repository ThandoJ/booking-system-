import { useState } from "react";
import { motion } from "framer-motion";

export default function App() {
  const [date, setDate] = useState("");
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [bookings, setBookings] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);

  // Seat Layout (like airplane rows)
  const seats = [
    { id: "1A", class: "first" },
    { id: "1B", class: "first" },
    { id: "1C", class: "first" },
    { id: "1D", class: "first" },

    { id: "2A", class: "business" },
    { id: "2B", class: "business" },
    { id: "2C", class: "business" },
    { id: "2D", class: "business" },

    { id: "3A", class: "economy" },
    { id: "3B", class: "economy" },
    { id: "3C", class: "economy" },
    { id: "3D", class: "economy" },

    { id: "4A", class: "economy" },
    { id: "4B", class: "economy" },
    { id: "4C", class: "economy" },
    { id: "4D", class: "economy" }
  ];

  const getSeatColor = (seatClass) => {
    switch (seatClass) {
      case "first":
        return "bg-yellow-500";
      case "business":
        return "bg-blue-500";
      case "economy":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  const bookSeat = () => {
    if (!name || !email || !date) {
      setMessage("Please fill all fields");
      return;
    }

    const newBooking = {
      id: Date.now(),
      seat: selectedSeat,
      name,
      email,
      date
    };

    setBookings([...bookings, newBooking]);
    setBookedSeats([...bookedSeats, selectedSeat]);

    setSelectedSeat(null);
    setName("");
    setEmail("");
    setMessage("");
  };

  const deleteBooking = (id) => {
    const bookingToDelete = bookings.find((b) => b.id === id);

    setBookings(bookings.filter((b) => b.id !== id));
    setBookedSeats(bookedSeats.filter((s) => s !== bookingToDelete.seat));
  };

  const updateBooking = (id) => {
    const newName = prompt("Enter new name:");
    if (!newName) return;

    setBookings(
      bookings.map((b) =>
        b.id === id ? { ...b, name: newName } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-900 to-gray-900 text-white">
      {/* Header */}
      <header className="p-6 text-center">
        <h1 className="text-3xl font-bold">✈️ AeroLux Airlines</h1>
      </header>

      {/* Hero Section */}
      <section className="text-center p-6">
        <h2 className="text-4xl font-bold">Fly Beyond Limits</h2>
        <p>Luxury travel made simple</p>
      </section>

      {/* Booking Section */}
      <section className="bg-white text-black max-w-3xl mx-auto p-6 rounded-xl shadow-xl">
        <input
          type="date"
          className="border p-2 w-full mb-4"
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Seat Map */}
        <div className="grid grid-cols-4 gap-3">
          {seats.map((s) => {
            const booked = bookedSeats.includes(s.id);
            return (
              <motion.button
                key={s.id}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={booked}
                onClick={() => setSelectedSeat(s.id)}
                className={`p-3 text-white rounded-lg shadow ${
                  booked
                    ? "bg-red-500 cursor-not-allowed"
                    : getSeatColor(s.class)
                } ${
                  selectedSeat === s.id ? "ring-4 ring-black" : ""
                }`}
              >
                {s.id}
              </motion.button>
            );
          })}
        </div>

        {message && <p className="text-red-500 mt-3">{message}</p>}

        {/* Form */}
        {selectedSeat && (
          <div className="mt-4">
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={bookSeat}
              className="bg-green-600 text-white w-full p-2 rounded-lg"
            >
              Confirm Booking
            </button>
          </div>
        )}
      </section>

      {/* Bookings List */}
      <section className="p-6 max-w-3xl mx-auto">
        <h2 className="text-xl font-bold mb-3">Bookings</h2>
        {bookings.map((b) => (
          <div
            key={b.id}
            className="flex justify-between items-center border p-3 mt-2 rounded-lg bg-gray-800"
          >
            <span>
              {b.seat} - {b.name} ({b.date})
            </span>
            <div>
              <button
                onClick={() => updateBooking(b.id)}
                className="text-blue-400 mr-3"
              >
                Edit
              </button>
              <button
                onClick={() => deleteBooking(b.id)}
                className="text-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

