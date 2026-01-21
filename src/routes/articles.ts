import { Router, type Request, type Response } from "express";
import { pool } from "../db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function isNonEmptyString(value: unknown, maxLen: number): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLen;
}

// GET /articles (public)
router.get("/", async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await pool.execute(
      `SELECT a.id, a.title, a.body, a.category, a.created_at, a.submitted_by, u.email AS submitter_email
       FROM articles a
       JOIN users u ON u.id = a.submitted_by
       ORDER BY a.created_at DESC`
    );

    res.status(200).json(rows);
    return;
  } catch (error) {
    console.error("GET /articles error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
});

// POST /articles (protected)
router.post("/", requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const bodyObj = (req.body ?? {}) as { title?: unknown; body?: unknown; category?: unknown };
    const { title, body, category } = bodyObj;

    if (!isNonEmptyString(title, 255) || !isNonEmptyString(body, 50000) || !isNonEmptyString(category, 100)) {
      res.status(400).json({ error: "Invalid title, body, or category" });
      return;
    }

    // requireAuth should always set req.user, but keep a safe guard
    if (!req.user) {
      res.status(401).json({ error: "Not authenticated" });
      return;
    }

    const cleanTitle = title.trim();
    const cleanBody = body.trim();
    const cleanCategory = category.trim();

    const [result] = await pool.execute(
      "INSERT INTO articles (title, body, category, submitted_by) VALUES (?, ?, ?, ?)",
      [cleanTitle, cleanBody, cleanCategory, req.user.id]
    );

    const insertId = (result as { insertId: number }).insertId;

    res.status(201).json({
      id: insertId,
      title: cleanTitle,
      body: cleanBody,
      category: cleanCategory,
      submitted_by: req.user.id,
    });
    return;
  } catch (error) {
    console.error("POST /articles error:", error);
    res.status(500).json({ error: "Server error" });
    return;
  }
});

export default router;
