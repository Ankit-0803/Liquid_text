// import React from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core";
// import "@react-pdf-viewer/core/lib/styles/index.css";

// const PDFViewer = ({ fileUrl }) => {
//   return (
//     <Worker workerUrl="https://unpkg.com/pdfjs-dist/build/pdf.worker.min.js">
//       <Viewer fileUrl={fileUrl} />
//     </Worker>
//   );
// };

// export default PDFViewer;

import React, { useEffect } from "react";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";

const PDFViewer = ({ 
  fileUrl, 
  onPageChange, 
  onTextExtracted,
  plugins = [] 
}) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    onPageChange: (e) => {
      onPageChange && onPageChange(e.currentPage + 1);
    },
  });

  // Text extraction plugin
  const textExtractionPlugin = {
    onPageChange: async (e) => {
      try {
        const page = e.currentPage;
        const textContent = await page.getTextContent();
        const extractedText = textContent.items
          .map(item => item.str)
          .join('\n');
        onTextExtracted && onTextExtracted(extractedText);
      } catch (error) {
        console.error('Error extracting text:', error);
      }
    },
  };

  return (
    <div className="h-screen">
      <Viewer
        fileUrl={fileUrl}
        plugins={[defaultLayoutPluginInstance, textExtractionPlugin, ...plugins]}
      />
    </div>
  );
};

export default PDFViewer;