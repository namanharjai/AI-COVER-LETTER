import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRouter from "./routes/generate.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Debug endpoint to test PDF parsing
app.post("/debug-pdf", express.raw({ type: 'application/pdf', limit: '10mb' }), async (req, res) => {
  try {
    const pdf = await import('pdf-parse');
    const data = await pdf.default(req.body);
    const text = data.text;

    // Extract contact info
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g;
    const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin:?\s*|www\.linkedin\.com\/in\/)([a-zA-Z0-9-]+)/gi;

    const contactInfo = {
      email: text.match(emailRegex)?.[0] || null,
      phone: text.match(phoneRegex)?.[0] || null,
      linkedin: text.match(linkedinRegex)?.[0] || null,
      textLength: text.length,
      preview: text.substring(0, 500) + '...'
    };

    res.json({ success: true, contactInfo, fullText: text });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Use the proper generate router with PDF parsing
app.use("/generate", generateRouter);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});