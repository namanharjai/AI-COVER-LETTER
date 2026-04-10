import { useState } from "react";
import axios from "axios";

function App() {
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    skills: "",
    description: "",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [extractedInfo, setExtractedInfo] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type === 'application/pdf') {
      // Extract contact info from PDF
      const formData = new FormData();
      formData.append('pdf', selectedFile);

      try {
        const response = await axios.post('http://localhost:5000/debug-pdf', selectedFile, {
          headers: {
            'Content-Type': 'application/pdf',
          },
        });
        setExtractedInfo(response.data.contactInfo);
      } catch (err) {
        console.error('Error extracting PDF info:', err);
        setExtractedInfo(null);
      }
    } else {
      setExtractedInfo(null);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setResult("");

    // Validate required fields
    if (!form.role || !form.company) {
      setResult("Error: Please fill in Job Role and Company Name");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (file) formData.append("resume", file);

    try {
      const res = await axios.post("http://localhost:5000/generate", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setResult(res.data.data || res.data);
    } catch (err) {
      console.error("Full error object:", err);

      let errorMsg = "Error generating cover letter";

      if (err.response) {
        errorMsg = err.response.data?.error || `Server error: ${err.response.status}`;
      } else if (err.request) {
        errorMsg = "No response from server. Is it running on http://localhost:5000?";
      } else {
        errorMsg = err.message;
      }

      setResult(`Error: ${errorMsg}`);
    }

    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: "20px",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      <div style={{
        maxWidth: "800px",
        margin: "0 auto",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
          color: "white",
          padding: "40px 30px",
          textAlign: "center"
        }}>
          <h1 style={{
            margin: "0",
            fontSize: "2.5rem",
            fontWeight: "700",
            textShadow: "0 2px 4px rgba(0,0,0,0.2)"
          }}>
            AI Cover Letter Generator
          </h1>
          <p style={{
            margin: "10px 0 0 0",
            opacity: "0.9",
            fontSize: "1.1rem"
          }}>
            Level 3 - Advanced AI-Powered Cover Letters with PDF Resume Analysis
          </p>
        </div>

        {/* Form */}
        <div style={{ padding: "40px 30px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            marginBottom: "30px"
          }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "0.9rem"
              }}>
                Your Name *
              </label>
              <input
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "0.9rem"
              }}>
                Job Role *
              </label>
              <input
                name="role"
                placeholder="e.g., Software Engineer, Product Manager"
                onChange={handleChange}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "0.9rem"
              }}>
                Company Name *
              </label>
              <input
                name="company"
                placeholder="e.g., Google, Microsoft, StartupXYZ"
                onChange={handleChange}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
              <label style={{
                fontWeight: "600",
                marginBottom: "8px",
                color: "#374151",
                fontSize: "0.9rem"
              }}>
                Key Skills
              </label>
              <input
                name="skills"
                placeholder="e.g., React, Python, Leadership, Communication"
                onChange={handleChange}
                style={{
                  padding: "12px 16px",
                  border: "2px solid #e5e7eb",
                  borderRadius: "8px",
                  fontSize: "1rem",
                  transition: "border-color 0.2s",
                  outline: "none"
                }}
                onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
                onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
              />
            </div>
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              fontWeight: "600",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "0.9rem",
              display: "block"
            }}>
              Job Description
            </label>
            <textarea
              name="description"
              placeholder="Paste the job description here for better personalization..."
              onChange={handleChange}
              rows={4}
              style={{
                width: "100%",
                padding: "12px 16px",
                border: "2px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "1rem",
                resize: "vertical",
                transition: "border-color 0.2s",
                outline: "none",
                fontFamily: "inherit"
              }}
              onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
              onBlur={(e) => e.target.style.borderColor = "#e5e7eb"}
            />
          </div>

          <div style={{ marginBottom: "30px" }}>
            <label style={{
              fontWeight: "600",
              marginBottom: "8px",
              color: "#374151",
              fontSize: "0.9rem",
              display: "block"
            }}>
              Upload Resume (PDF)
            </label>
            <div style={{
              border: "2px dashed #d1d5db",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
              background: "#f9fafb",
              transition: "border-color 0.2s, background-color 0.2s"
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#4f46e5";
              e.currentTarget.style.backgroundColor = "#eef2ff";
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.backgroundColor = "#f9fafb";
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.style.borderColor = "#d1d5db";
              e.currentTarget.style.backgroundColor = "#f9fafb";
              const files = e.dataTransfer.files;
              if (files.length > 0) {
                handleFileChange({ target: { files } });
              }
            }}>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="resume-upload"
              />
              <label htmlFor="resume-upload" style={{
                cursor: "pointer",
                color: "#6b7280",
                fontSize: "0.9rem"
              }}>
                {file ? `📄 ${file.name}` : "Click to upload or drag & drop your resume PDF"}
              </label>
            </div>
          </div>

          {/* Extracted Contact Information */}
          {extractedInfo && (
            <div style={{
              marginBottom: "30px",
              padding: "20px",
              background: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "8px"
            }}>
              <h4 style={{
                margin: "0 0 15px 0",
                color: "#0369a1",
                fontSize: "1rem",
                fontWeight: "600"
              }}>
                📋 Extracted Contact Information
              </h4>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "10px",
                fontSize: "0.9rem"
              }}>
                <div>
                  <strong>Email:</strong> {extractedInfo.email || "Not found"}
                </div>
                <div>
                  <strong>Phone:</strong> {extractedInfo.phone || "Not found"}
                </div>
                <div>
                  <strong>LinkedIn:</strong> {extractedInfo.linkedin || "Not found"}
                </div>
                <div>
                  <strong>Location:</strong> {extractedInfo.location || "Not found"}
                </div>
              </div>
              <p style={{
                margin: "10px 0 0 0",
                fontSize: "0.8rem",
                color: "#64748b"
              }}>
                This information will be automatically included in your cover letter.
              </p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              background: loading ? "#9ca3af" : "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.3)"
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(79, 70, 229, 0.4)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)";
              }
            }}
          >
            {loading ? (
              <span>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite", marginRight: "8px" }}>⟳</span>
                Generating Cover Letter...
              </span>
            ) : (
              "Generate Cover Letter"
            )}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{
            padding: "30px",
            background: "#f8fafc",
            borderTop: "1px solid #e2e8f0"
          }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px"
            }}>
              <h3 style={{
                margin: "0",
                color: "#1f2937",
                fontSize: "1.3rem",
                fontWeight: "600"
              }}>
                Generated Cover Letter
              </h3>
              <button
                onClick={copyToClipboard}
                style={{
                  padding: "8px 16px",
                  background: copied ? "#10b981" : "#4f46e5",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: "500",
                  transition: "background-color 0.2s"
                }}
              >
                {copied ? "✓ Copied!" : "📋 Copy to Clipboard"}
              </button>
            </div>

            <div style={{
              background: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "20px",
              whiteSpace: "pre-wrap",
              fontFamily: "'Times New Roman', serif",
              lineHeight: "1.6",
              color: "#374151",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              {result}
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
