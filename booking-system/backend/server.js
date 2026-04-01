const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = 5000;

// In-memory database
let bookings = [];

// Available time slots
const allSlots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
];

// =============================
// TEST ROUTE
// =============================
app.get("/", (req, res) => {
  res.send("API is running...");
});

// =============================
// GET AVAILABLE SLOTS
// =============================
app.get("/api/slots", (req, res) => {
  const { date, resource } = req.query;

  if (!date || !resource) {
    return res.status(400).json({
      message: "Date and resource are required",
    });
  }

  const bookedSlots = bookings
    .filter(
      (b) => b.date === date && b.resource === resource
    )
    .map((b) => b.time);

  const availableSlots = allSlots.filter(
    (slot) => !bookedSlots.includes(slot)
  );

  res.json(availableSlots);
});

// =============================
// CREATE BOOKING
// =============================
app.post("/api/bookings", (req, res) => {
  const { name, email, date, time, resource } = req.body;

  // Validation
  if (!name || !email || !date || !time || !resource) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Check for conflict
  const conflict = bookings.find(
    (b) =>
      b.date === date &&
      b.time === time &&
      b.resource === resource
  );

  if (conflict) {
    return res.status(400).json({
      message: "This slot is already booked",
    });
  }

  // Create booking
  const newBooking = {
    id: uuidv4(),
    name,
    email,
    date,
    time,
    resource,
  };

  bookings.push(newBooking);

  res.status(201).json(newBooking);
});

// =============================
// GET BOOKINGS BY DATE + RESOURCE
// =============================
app.get("/api/bookings/:date/:resource", (req, res) => {
  const { date, resource } = req.params;

  const result = bookings.filter(
    (b) => b.date === date && b.resource === resource
  );

  res.json(result);
});

// =============================
// DELETE BOOKING
// =============================
app.delete("/api/bookings/:id", (req, res) => {
  const { id } = req.params;

  const exists = bookings.find((b) => b.id === id);

  if (!exists) {
    return res.status(404).json({
      message: "Booking not found",
    });
  }

  bookings = bookings.filter((b) => b.id !== id);

  res.json({
    message: "Booking deleted successfully",
  });
});

// =============================
// START SERVER
// =============================
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});