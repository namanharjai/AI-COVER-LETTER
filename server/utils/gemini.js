import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateCoverLetter = async (data) => {
  const { name, role, company, skills, description, resumeText, contactInfo } = data;

  console.log("Generating cover letter with data:", {
    name,
    role,
    company,
    contactInfo,
    hasResumeText: !!resumeText
  });

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

  const prompt = `
Write a highly personalized professional cover letter based on the following information:

CANDIDATE INFORMATION:
- Name: ${name || 'Not provided'}
- Applying for: ${role}
- Target Company: ${company}
- Key Skills: ${skills || 'Not specified'}

CONTACT INFORMATION (MUST INCLUDE IN LETTER):
- Email: ${contactInfo?.email || 'Not found in resume'}
- Phone: ${contactInfo?.phone || 'Not found in resume'}
- LinkedIn: ${contactInfo?.linkedin || 'Not found in resume'}
- Location: ${contactInfo?.location || 'Not found in resume'}

JOB DESCRIPTION:
${description || 'Not provided'}

RESUME CONTENT:
${resumeText || 'No resume uploaded'}

CRITICAL INSTRUCTIONS FOR COVER LETTER FORMAT:
1. Start with the candidate's contact information at the TOP of the letter (email, phone, LinkedIn)
2. Include the date
3. Add company contact information (use generic if not known)
4. Use proper business letter salutation
5. Write 3-4 paragraphs of personalized content using resume details
6. End with professional closing and signature with FULL contact information

EXAMPLE FORMAT:
[Your Name]
[Your Email] | [Your Phone] | [Your LinkedIn] | [Your Location]
[Date]

[Hiring Manager Name or "Hiring Team"]
[Company Name]
[Company Address]

Dear Hiring Manager,

[Personalized content paragraphs...]

Sincerely,
[Your Name]
[Your Email]
[Your Phone]
[Your LinkedIn]

MUST include ALL contact information in both header and signature sections. Do NOT omit any contact details that are provided.

Generate the complete cover letter with proper formatting:
`;

  // Retry logic for temporary failures
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();
      
      console.log("Generated cover letter preview:", generatedText.substring(0, 200) + "...");
      console.log("Contact info in result:", {
        hasEmail: generatedText.includes(contactInfo?.email || ''),
        hasPhone: generatedText.includes(contactInfo?.phone || ''),
        hasLinkedIn: generatedText.includes(contactInfo?.linkedin || '')
      });
      
      // Post-process: Ensure contact information is included
      let finalText = generatedText;
      if (contactInfo && (contactInfo.email || contactInfo.phone || contactInfo.linkedin)) {
        // Check if contact info is already in the letter
        const hasContactInfo = (contactInfo.email && generatedText.includes(contactInfo.email)) ||
                              (contactInfo.phone && generatedText.includes(contactInfo.phone)) ||
                              (contactInfo.linkedin && generatedText.includes(contactInfo.linkedin));
        
        if (!hasContactInfo) {
          console.log("Contact info missing from AI response, appending manually");
          
          // Create contact info string
          const contactLines = [];
          if (contactInfo.email) contactLines.push(contactInfo.email);
          if (contactInfo.phone) contactLines.push(contactInfo.phone);
          if (contactInfo.linkedin) contactLines.push(contactInfo.linkedin);
          
          const contactString = contactLines.join(' | ');
          
          // Try to add it after the name/signature
          if (name && finalText.includes(name)) {
            // Add after the signature
            finalText = finalText.replace(
              new RegExp(`${name}\\s*$`, 'm'),
              `${name}\n${contactString}`
            );
          } else {
            // Append at the end
            finalText += `\n\n${contactString}`;
          }
        }
      }
      
      return finalText;
    } catch (err) {
      attempts++;
      console.log(`Attempt ${attempts} failed:`, err.message);

      if (attempts >= maxAttempts) {
        throw err;
      }

      // Wait 2 seconds before retry
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
};;
