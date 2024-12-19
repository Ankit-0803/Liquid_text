import React from "react";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer = ({ fileUrl }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js">
      <Viewer fileUrl={fileUrl} />
    </Worker>
  );
};

export default PDFViewer;
