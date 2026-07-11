import { useState, useEffect } from "react";
import { Document, Page } from "react-pdf";

const BookReader = ({ pdfUrl, userEmail }) => {
  const [numPages, setNumPages] = useState(null);

  const PREVIEW_PAGES = 3;

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  // 🚫 Disable right click
  useEffect(() => {
    const disableRightClick = (e) => e.preventDefault();
    document.addEventListener("contextmenu", disableRightClick);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
    };
  }, []);

  return (
    <div style={{ textAlign: "center", position: "relative" }}>

      {/* 💧 Watermark */}
      <div style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        opacity: 0.1,
        fontSize: "40px",
        transform: "rotate(-30deg)",
        pointerEvents: "none"
      }}>
        {userEmail}
      </div>

      {/* 📄 PDF */}
      <Document file={pdfUrl} onLoadSuccess={onLoadSuccess}>
        {Array.from(
          new Array(Math.min(PREVIEW_PAGES, numPages)),
          (el, index) => (
            <Page key={index} pageNumber={index + 1} />
          )
        )}
      </Document>

      {/* 🔒 Limit Message */}
      {numPages > PREVIEW_PAGES && (
        <p style={{ color: "red", marginTop: "20px" }}>
          Preview only. Buy to read full book.
        </p>
      )}
    </div>
  );
};

export default BookReader;