// ==========================================================
// NEXUS STUDIO — Express.js + PostgreSQL Backend Server
// Author: Harshada Dinesh Lonare (B.Tech IT - SVPCET, Nagpur)
// ==========================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";
import bcrypt from "bcrypt";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// PostgreSQL Pool Connection
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/nexus_studio_db"
});

// Health Check API
app.get("/api/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ONLINE",
      database: "PostgreSQL v16",
      timestamp: result.rows[0].now
    });
  } catch (err) {
    res.status(500).json({ status: "ERROR", message: err.message });
  }
});

// 1. AUTHENTICATION APIs (Project 4 - SecureFlow)
app.post("/api/auth/register", async (req, res) => {
  const { fullName, email, password, role } = req.body;
  try {
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, role, status)
       VALUES ($1, $2, $3, $4, 'active') RETURNING id, full_name, email, role, created_at`,
      [fullName, email.toLowerCase(), passwordHash, role || "Student Member"]
    );
    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    const user = result.rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password." });
    }
    res.json({
      success: true,
      user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. RESTAURANT APIs (Project 1 - Dragon Pearl)
app.get("/api/restaurant/menu", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM restaurant_menu_items ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/restaurant/orders", async (req, res) => {
  const { customerName, phone, address, items, subtotal, gst, deliveryFee, total, paymentMethod } = req.body;
  const orderCode = `DP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
  try {
    const result = await pool.query(
      `INSERT INTO restaurant_orders (order_code, customer_name, customer_phone, customer_address, items, subtotal, gst, delivery_fee, total, payment_method)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
      [orderCode, customerName, phone, address, JSON.stringify(items), subtotal, gst, deliveryFee, total, paymentMethod || "Cash on Delivery"]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/restaurant/reservations", async (req, res) => {
  const { guestName, email, phone, partySize, date, time, specialRequests } = req.body;
  const bookingCode = `DP-RES-2026-${Math.floor(100 + Math.random() * 900)}`;
  const tableNumber = Math.floor(1 + Math.random() * 18);
  try {
    const result = await pool.query(
      `INSERT INTO reservations (booking_code, guest_name, email, phone, party_size, reservation_date, reservation_time, table_number, special_requests)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [bookingCode, guestName, email, phone, partySize, date, time, tableNumber, specialRequests]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. CHRONOLUX WATCH APIs (Project 2 - ChronoLux)
app.get("/api/watches/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/watches/orders", async (req, res) => {
  const { customerName, email, address, city, state, postalCode, totalAmount, items } = req.body;
  const orderNumber = `CV-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  try {
    const result = await pool.query(
      `INSERT INTO orders (order_number, customer_name, email, shipping_address, city, state, postal_code, total_amount, items)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [orderNumber, customerName, email, address, city, state, postalCode, totalAmount, JSON.stringify(items)]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4. STUDENT HUB APIs (Project 6 - Student Hub)
app.get("/api/students", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM students ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/students", async (req, res) => {
  const { university_id, full_name, department, academic_year, semester, email, contact, gpa, academic_interest } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO students (university_id, full_name, department, academic_year, semester, email, contact, gpa, academic_interest)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [university_id, full_name, department, academic_year, semester, email, contact, gpa, academic_interest]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5. PORTFOLIO CONTACT (Project 3 - Harshada's Portfolio)
app.post("/api/contact", async (req, res) => {
  const { senderName, email, subject, message } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO contact_messages (sender_name, email, subject, message)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [senderName, email, subject, message]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 6. SQL QUERY CONSOLE (For Faculty Evaluation)
app.post("/api/sql/execute", async (req, res) => {
  const { query } = req.body;
  const start = performance.now();
  try {
    const result = await pool.query(query);
    const end = performance.now();
    res.json({
      command: result.command,
      rowCount: result.rowCount,
      columns: result.fields ? result.fields.map(f => f.name) : [],
      rows: result.rows,
      executionTimeMs: (end - start).toFixed(2)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`NEXUS STUDIO Backend running on http://localhost:${PORT}`);
});
