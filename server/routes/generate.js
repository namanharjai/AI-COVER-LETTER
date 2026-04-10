import express from "express";
import multer from "multer";
import pdf from "pdf-parse";
import { generateCoverLetter } from "../utils/gemini.js";

const router = express.Router();
const upload = multer();

// Function to extract contact information from resume text
const extractContactInfo = (text) => {
  const contactInfo = {
    email: null,
    phone: null,
    linkedin: null,
    location: null
  };

  // Email regex patterns
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatch = text.match(emailRegex);
  if (emailMatch) {
    contactInfo.email = emailMatch[0];
  }

  // Phone regex patterns (various formats)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/g;
  const phoneMatch = text.match(phoneRegex);
  if (phoneMatch) {
    contactInfo.phone = phoneMatch[0];
  }

  // LinkedIn patterns
  const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin:?\s*|www\.linkedin\.com\/in\/)([a-zA-Z0-9-]+)/gi;
  const linkedinMatch = text.match(linkedinRegex);
  if (linkedinMatch) {
    // Clean up the LinkedIn URL
    const linkedin = linkedinMatch[0].replace(/linkedin:?\s*/gi, '').replace(/^www\./, '');
    contactInfo.linkedin = linkedin.startsWith('http') ? linkedin : `https://${linkedin}`;
  }

  // Location patterns (city, state/country)
  const locationRegex = /(?:Location|Address|City)[\s:]*([^\n\r,]{1,50}(?:,\s*[A-Z]{2})?|[^\n\r]{1,50},\s*[A-Z]{2}(?:\s+\d{5})?|[^\n\r]{1,50},\s*[A-Z][a-z]+(?:,\s*[A-Z]{2})?)/gi;
  const locationMatch = text.match(locationRegex);
  if (locationMatch) {
    contactInfo.location = locationMatch[0].replace(/(?:Location|Address|City)[\s:]*:?/gi, '').trim();
  }

  return contactInfo;
};

router.post("/", upload.single("resume"), async (req, res) => {
  try {
    let resumeText = "";
    let contactInfo = {};

    if (req.file) {
      const data = await pdf(req.file.buffer);
      resumeText = data.text;

      // Clean up the extracted text
      resumeText = resumeText
        .replace(/\n+/g, '\n') // Remove excessive newlines
        .replace(/\s+/g, ' ') // Normalize spaces
        .trim();

      // Extract contact information
      contactInfo = extractContactInfo(resumeText);

      console.log("Extracted contact info:", contactInfo);
      console.log("Resume text preview:", resumeText.substring(0, 300) + "...");
    }

    const result = await generateCoverLetter({
      ...req.body,
      resumeText,
      contactInfo,
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Error in generate route:", err);
    res.status(500).json({ success: false, error: "AI Error" });
  }
});

export default router;
