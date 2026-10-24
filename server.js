require("dotenv").config();

const express = require("express");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "vehicle_service_db",
  waitForConnections: true,
  connectionLimit: 10,
  dateStrings: true
});

const allowedStatuses = ["Pending", "In Progress", "Completed"];

app.get("/api/bookings", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, customer_name, phone, vehicle_number, vehicle_type, service_type, DATE_FORMAT(service_date, '%Y-%m-%d') AS service_date, status, created_at FROM bookings ORDER BY id DESC"
    );
    res.json(rows);
  } catch (error) {
    console.error("Loading bookings failed:", error.message);
    res.status(500).json({ message: "Could not load bookings. Check your database setup." });
  }
});

app.post("/api/bookings", async (req, res) => {
  try {
    const {
      customer_name, phone, vehicle_number,
      vehicle_type, service_type, service_date
    } = req.body || {};

    if (
      typeof customer_name !== "string" || !customer_name.trim() ||
      typeof phone !== "string" || !phone.trim() ||
      typeof vehicle_number !== "string" || !vehicle_number.trim() ||
      typeof vehicle_type !== "string" || !vehicle_type ||
      typeof service_type !== "string" || !service_type ||
      typeof service_date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(service_date)
    ) {
      return res.status(400).json({ message: "Please fill in all fields with valid values." });
    }

    const validVehicleTypes = ["Bike", "Car", "Scooter", "Other"];
    const validServices = [
      "General Service", "Oil Change", "Engine Repair",
      "Brake Repair", "Tyre Service", "Other Repair"
    ];

    if (!validVehicleTypes.includes(vehicle_type) || !validServices.includes(service_type)) {
      return res.status(400).json({ message: "Please choose a valid vehicle type and service." });
    }

    const [result] = await pool.execute(
      `INSERT INTO bookings
       (customer_name, phone, vehicle_number, vehicle_type, service_type, service_date)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        customer_name.trim(),
        phone.trim(),
        vehicle_number.trim().toUpperCase(),
        vehicle_type,
        service_type,
        service_date
      ]
    );

    res.status(201).json({ message: "Booking added successfully!", id: result.insertId });
  } catch (error) {
    console.error("Adding booking failed:", error.message);
    res.status(500).json({ message: "Could not add booking. Check your database connection." });
  }
});

app.patch("/api/bookings/:id/status", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body || {};

    if (!Number.isInteger(id) || id < 1 || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid booking ID or status." });
    }

    const [result] = await pool.execute(
      "UPDATE bookings SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json({ message: "Status updated successfully!" });
  } catch (error) {
    console.error("Updating status failed:", error.message);
    res.status(500).json({ message: "Could not update status." });
  }
});

app.delete("/api/bookings/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ message: "Invalid booking ID." });
    }

    const [result] = await pool.execute("DELETE FROM bookings WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Booking not found." });
    }

    res.json({ message: "Booking deleted successfully!" });
  } catch (error) {
    console.error("Deleting booking failed:", error.message);
    res.status(500).json({ message: "Could not delete booking." });
  }
});

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log("MySQL connected successfully!");
    connection.release();

    app.listen(PORT, () => {
      console.log(`Vehicle Service Management System: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    console.error("Check that MySQL is running, database.sql has been executed, and .env credentials are correct.");
    process.exitCode = 1;
  }
}

startServer();
