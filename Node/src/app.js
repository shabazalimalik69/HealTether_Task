require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: [
      "http://127.0.0.1:5173",
    ],
    credentials: true,
    exposedHeaders: ["Content-Disposition"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
    res.send("HomePage");
  });
const PORT = process.env.PORT || 7000;


(async () => {
  try {
  
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Database connection failed", err);
    process.exit(1);
  }
})();