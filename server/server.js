import express from "express";
import compression from "compression";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(compression());


app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});


const distPath = path.join(__dirname, "..", "client", "dist");
app.use(express.static(distPath));


app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
