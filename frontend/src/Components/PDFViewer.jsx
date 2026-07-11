import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import worker from "pdfjs-dist/build/pdf.worker.min.js?url";

pdfjs.GlobalWorkerOptions.workerSrc = worker;

export default function PDFViewer({ file, onClose }) {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [scale, setScale] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
  };

  const onDocumentLoadError = (err) => {
    console.error("PDF LOAD ERROR:", err);
    setError("Failed to load PDF ❌");
  };

  // 🔍 Scroll Zoom (smooth UX)
  const handleWheel = (e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      setScale((prev) =>
        e.deltaY < 0 ? Math.min(prev + 0.1, 2.5) : Math.max(prev - 0.1, 0.6)
      );
    }
  };

  if (!file) {
    return (
      <div style={overlayStyle}>
        <div style={modalStyle}>
          <button onClick={onClose} style={closeBtn}>✖</button>
          <h2>No PDF file provided ❌</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onWheel={handleWheel}>
      <div style={modalStyle}>

        {/* ❌ CLOSE */}
        <button onClick={onClose} style={closeBtn}>✖</button>

        {/* 🧰 TOOLBAR */}
        <div style={toolbar}>
          <button onClick={() => setScale(s => Math.max(0.6, s - 0.2))}>
            ➖
          </button>

          <span style={{ fontWeight: "bold" }}>
            {Math.round(scale * 100)}%
          </span>

          <button onClick={() => setScale(s => Math.min(2.5, s + 0.2))}>
            ➕
          </button>

          <div style={{ marginLeft: "30px" }}>
            <button
              onClick={() => setPageNumber(p => p - 1)}
              disabled={pageNumber <= 1}
            >
              ⬅
            </button>

            <span style={{ margin: "0 10px" }}>
              {pageNumber} / {numPages || "--"}
            </span>

            <button
              onClick={() => setPageNumber(p => p + 1)}
              disabled={pageNumber >= numPages}
            >
              ➡
            </button>
          </div>
        </div>

        {/* 📄 PDF */}
        <div style={pdfContainer}>
          {error ? (
            <h3>{error}</h3>
          ) : (
            <Document
              file={file}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<p>Loading PDF... ⏳</p>}
            >
              <div style={pageWrapper}>
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                />
              </div>
            </Document>
          )}
        </div>

      </div>
    </div>
  );
}

/* 🎨 STYLES */

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0,0,0,0.85)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999
};

const modalStyle = {
  background: "#111",
  color: "white",
  padding: "20px",
  borderRadius: "12px",
  position: "relative",
  width: "90%",
  maxWidth: "900px",
  maxHeight: "90vh",
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
};

const closeBtn = {
  position: "absolute",
  top: "10px",
  right: "15px",
  border: "none",
  background: "red",
  color: "white",
  cursor: "pointer",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "16px"
};

const toolbar = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "10px",
  background: "#222",
  padding: "10px 15px",
  borderRadius: "8px"
};

const pdfContainer = {
  overflow: "auto",
  width: "100%",
  display: "flex",
  justifyContent: "center"
};

const pageWrapper = {
  transition: "all 0.3s ease"
};