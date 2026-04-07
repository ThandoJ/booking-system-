const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());
app.use(express.json());

let bookings = [];

app.get("/api/bookings/:date", (req, res) => {
  const result = bookings.filter(b => b.date === req.params.date);
  res.json(result);
});

app.post("/api/bookings", (req, res) => {
  const { name, email, date, seat } = req.body;

  const conflict = bookings.find(b => b.date === date && b.seat === seat);
  if (conflict) return res.status(400).json({ message: "Seat taken" });

  const newBooking = { id: uuidv4(), name, email, date, seat };
  bookings.push(newBooking);
  res.json(newBooking);
});

app.put("/api/bookings/:id", (req, res) => {
  const { id } = req.params;
  const { date, seat } = req.body;

  const booking = bookings.find(b => b.id === id);
  if (!booking) return res.status(404).json({ message: "Not found" });

  const conflict = bookings.find(b => b.date === date && b.seat === seat && b.id !== id);
  if (conflict) return res.status(400).json({ message: "Seat taken" });

  booking.date = date;
  booking.seat = seat;
  res.json(booking);
});

app.delete("/api/bookings/:id", (req, res) => {
  bookings = bookings.filter(b => b.id !== req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000"));
