
// import React, { useState } from "react";
// import { Worker, Viewer } from "@react-pdf-viewer/core"; // Correct import for Viewer
// import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
// import "@react-pdf-viewer/core/lib/styles/index.css";
// import "@react-pdf-viewer/default-layout/lib/styles/index.css";
// import TextManipulation from "./TextManipulation";

// const DocumentViewer = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(0);

//   const defaultLayoutPluginInstance = defaultLayoutPlugin();

//   const handlePageChange = (e) => {
//     setCurrentPage(e.target.value);
//   };

//   const onDocumentLoad = ({ numPages }) => {
//     setTotalPages(numPages);
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h2 className="text-3xl font-semibold text-center mb-6">Interactive Document Viewer</h2>

//       {/* Render the PDF Viewer */}
//       <div className="border border-gray-300 rounded-lg mb-6">
//         {/* <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.16.105/build/pdf.worker.min.js`}> */}
//         <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>

//           <Viewer
//             fileUrl="/sample.pdf" // Make sure the file path is correct
//             plugins={[defaultLayoutPluginInstance]}
//             onDocumentLoadSuccess={onDocumentLoad}
//           />
//         </Worker>
//       </div>

//       {/* Navigation Controls */}
//       <div className="mb-6 flex justify-center items-center space-x-4">
//         <button
//           onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
//           disabled={currentPage <= 1}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           Previous Page
//         </button>
//         <span className="text-lg">
//           Page {currentPage} of {totalPages}
//         </span>
//         <button
//           onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
//           disabled={currentPage >= totalPages}
//           className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
//         >
//           Next Page
//         </button>
//       </div>

//       {/* Integrate Text Manipulation */}
//       <TextManipulation />
//     </div>
//   );
// };

// export default DocumentViewer;



import React, { useState, useCallback } from "react";
import { Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import TextManipulation from "./TextManipulation";
import PDFViewer from "./PDFViewer";

const DocumentViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const handlePageChange = useCallback((pageNumber) => {
    setCurrentPage(pageNumber);
  }, []);

  const handleTextExtracted = useCallback((text) => {
    setExtractedText(text);
  }, []);

  const onDocumentLoad = ({ numPages }) => {
    setTotalPages(numPages);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-semibold text-center mb-6">
        Interactive Document Viewer
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* PDF Viewer Section */}
        <div className="border border-gray-300 rounded-lg">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <PDFViewer
              fileUrl="/sample.pdf"
              onPageChange={handlePageChange}
              onTextExtracted={handleTextExtracted}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        </div>

        {/* Text Manipulation Section */}
        <div className="border border-gray-300 rounded-lg bg-white p-4">
          <TextManipulation 
            pageContent={extractedText}
            currentPage={currentPage}
          />
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex justify-center items-center space-x-4">
        <button
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Previous Page
        </button>
        <span className="text-lg">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
        >
          Next Page
        </button>
      </div>
    </div>
  );
};

export default DocumentViewer;