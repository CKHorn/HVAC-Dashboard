const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json({ limit: "50mb" }));

console.log("API KEY SET:", !!process.env.ANTHROPIC_API_KEY);
console.log("API KEY PREFIX:", process.env.ANTHROPIC_API_KEY?.substring(0,15));

app.use(express.static("public"));

app.post("/api/claude", async (req, res) => {
  try {
    console.log("Request received:", req.body?.model, "max_tokens:", req.body?.max_tokens);
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify(req.body)
    });
    console.log("Anthropic response status:", response.status);
    const data = await response.json();
    if(data.error) console.log("Anthropic error:", JSON.stringify(data.error));
    res.json(data);
  } catch (err) {
    console.log("Server error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
