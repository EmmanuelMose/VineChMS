import dotenv from "dotenv";
import app from "./index";

dotenv.config();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🌿 VineChMS Server running on http://localhost:${PORT}`);
  console.log(`🔵 API available at http://localhost:${PORT}/api`);
  console.log(`🟡 Health check: http://localhost:${PORT}`);
});