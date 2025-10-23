import React, { useState, useRef } from "react";

export default function PromptBooking() {
  const [prompt, setPrompt] = useState("");
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({ progress: 0, message: "" });
  const eventSourceRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setTicket(null);
    setLoading(true);
    setProgress({ progress: 0, message: "" });

    try {
      const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";
      const url = `${API_BASE.replace(/\/+$/,'')}/api/prompt/book`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Server returned ${res.status}${txt ? `: ${txt}` : ""}`);
      }

      const json = await res.json();
      // Expect json = { success, message, bookingDetails, pdfPath, ... }
      if (json && json.bookingDetails) {
        setTicket(json.bookingDetails);
      } else {
        setTicket(json);
      }

      // open pdf in new tab if available
      if (json && json.pdfPath) {
        const pdfUrl = json.pdfPath.startsWith("http") ? json.pdfPath : `${API_BASE.replace(/\/+$/,'')}${json.pdfPath}`;
        window.open(pdfUrl, "_blank");
      }
    } catch (err) {
      console.error("Prompt booking error:", err);
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to bottom right, #dbeafe, #e0e7ff, #f3e8ff)",
        padding: 24,
        color: "#111827",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px)",
          padding: 32,
          borderRadius: 16,
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
        }}
      >
        <h1 style={{
          marginTop: 0,
          marginBottom: 8,
          fontSize: "2.25rem",
          fontWeight: 700,
          color: "#1f2937",
          textAlign: "center"
        }}>🤖 AI Prompt Booking</h1>
        <p style={{
          textAlign: "center",
          color: "#4b5563",
          fontSize: "1.125rem",
          marginBottom: 32,
          lineHeight: 1.6
        }}>
          Describe your travel needs in natural language and let AI handle the booking for you!<br/>
          <small style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Example: "Book 2 AC 3-Tier tickets from Chennai to Trichy on 2025-01-15. Passengers: P2, 25, Male; P2, 23, Female. Contact: 9876543210, amuthan@example.com"
          </small>
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 16, marginTop: 12 }}
        >
          <input
            id="sourceStation"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Example: Book 2 sleeper tickets from Chennai to Trichy on 2025-10-10 for Amuthan"
            style={{
              flex: 1,
              padding: 16,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              fontSize: "1rem",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              transition: "all 0.3s ease",
              outline: "none",
              fontFamily: "inherit"
            }}
            onFocus={(e) => e.target.style.borderColor = "#4f46e5"}
            onBlur={(e) => e.target.style.borderColor = "#d1d5db"}
          />
          <button
            style={{
              padding: "16px 24px",
              borderRadius: "9999px",
              backgroundColor: "#4f46e5",
              color: "white",
              fontWeight: 600,
              fontSize: "1rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              transition: "all 0.3s ease",
              minWidth: "140px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#4338ca"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#4f46e5"}
          >
            {loading ? "🔄 Booking..." : "🚀 Book Ticket"}
          </button>
        </form>
        {loading && (
          <div style={{
            color: "#4f46e5",
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "rgba(79, 70, 229, 0.05)",
            border: "1px solid rgba(79, 70, 229, 0.2)",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500",
            textAlign: "center"
          }}>
            🤖 AI is automating your booking... This may take 30-60 seconds
            <br/>
            <small style={{ color: "#6b7280", fontSize: "0.875rem" }}>
              {progress.message || "Step 1: Signing in → Step 2: Filling form → Step 3: Booking ticket"}
            </small>
            {progress.progress > 0 && (
              <div style={{
                marginTop: "12px",
                width: "100%",
                height: "8px",
                backgroundColor: "rgba(79, 70, 229, 0.1)",
                borderRadius: "4px",
                overflow: "hidden"
              }}>
                <div style={{
                  width: `${progress.progress}%`,
                  height: "100%",
                  backgroundColor: "#4f46e5",
                  transition: "width 0.3s ease"
                }}></div>
              </div>
            )}
          </div>
        )}
        {error && (
          <div style={{
            color: "#dc2626",
            marginTop: "24px",
            padding: "16px",
            backgroundColor: "rgba(254, 226, 226, 0.8)",
            border: "1px solid rgba(220, 38, 38, 0.2)",
            borderRadius: "8px",
            fontSize: "1rem",
            fontWeight: "500"
          }}>❌ {error}</div>
        )}
        {ticket && (
          <div className="result-area">
            {ticket?.pdfPath ? (
              <div className="pdf-result-card" style={{ marginTop: 20 }}>
                <h3 style={{ margin: 0 }}>🎉 Ticket Ready</h3>
                <p style={{ marginTop: 8, marginBottom: 12 }}>Your ticket PDF is ready — preview below or download.</p>
                <div style={{ width: '100%', height: 600, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
                  <iframe
                    title="Ticket PDF"
                    src={ticket.pdfPath}
                    style={{ width: '100%', height: '100%', border: 0 }}
                  />
                </div>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                  <a
                    className="download-btn"
                    href={ticket.pdfPath}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-block',
                      padding: '10px 16px',
                      background: '#6b46ff',
                      color: 'white',
                      borderRadius: 8,
                      textDecoration: 'none'
                    }}
                  >
                    ⬇️ Download Ticket PDF
                  </a>
                  <button
                    onClick={() => window.open(ticket.pdfPath, '_blank', 'noopener')}
                    style={{
                      padding: '10px 16px',
                      borderRadius: 8,
                      border: '1px solid #ddd',
                      background: '#fff'
                    }}
                  >
                    🔍 Open in new tab
                  </button>
                </div>
              </div>
            ) : (
              // when no pdf yet, keep previous empty state / feedback area
              <div style={{ marginTop: 20 }}>
                {loading ? <p>Processing... please wait.</p> : <p>No ticket yet.</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
