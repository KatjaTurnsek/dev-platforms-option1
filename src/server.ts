import "dotenv/config";
import express from "express";
import authRouter from "./routes/auth.js";
import articlesRouter from "./routes/articles.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => res.send("Hello from Option 1!"));
app.get("/health", (_req, res) => res.status(200).json({ status: "ok" }));

app.use("/auth", authRouter);
app.use("/articles", articlesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
