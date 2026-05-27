import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectDB } from "./src/config/database.js";

const PORT = config.port || 3000;

// DB connect first, then start server
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.log("❌ DB connection failed:", err.message);
    });