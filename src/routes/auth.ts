import "dotenv/config";
import { Router, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../db.js";

const router = Router();

function isValidEmail(email: unknown): email is string {
  return typeof email === "string" && email.includes("@") && email.length <= 255;
}

function isValidPassword(password: unknown): password is string {
  return typeof password === "string" && password.length >= 8 && password.length <= 100;
}

// POST /auth/register
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const bodyObj = (req.body ?? {}) as { email?: unknown; password?: unknown };
    const { email, password } = bodyObj;

    if (!isValidEmail(email) || !isValidPassword(password)) {
      res.status(400).json({ error: "Invalid email or password (min 8 chars)" });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(
      "INSERT INTO users (email, password_hash) VALUES (?, ?)",
      [email, passwordHash]
    );

    const insertId = (result as { insertId: number }).insertId;

    res.status(201).json({ id: insertId, email });
    return;
  } catch (error: unknown) {
    const err = error as { code?: string };

    if (err.code === "ER_DUP_ENTRY") {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    console.error("Register error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
});

// POST /auth/login
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const bodyObj = (req.body ?? {}) as { email?: unknown; password?: unknown };
    const { email, password } = bodyObj;

    if (!isValidEmail(email) || typeof password !== "string") {
      res.status(400).json({ error: "Invalid email or password" });
      return;
    }

    const [rows] = await pool.execute("SELECT id, email, password_hash FROM users WHERE email = ?", [email]);
    const users = rows as Array<{ id: number; email: string; password_hash: string }>;

    if (users.length === 0) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const user = users[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      res.status(500).json({ error: "JWT_SECRET is not configured" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email }, secret, { expiresIn: "2h" });

    res.status(200).json({ token });
    return;
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
});

export default router;
