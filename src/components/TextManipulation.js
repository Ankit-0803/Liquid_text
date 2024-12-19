


// // src/components/TextManipulation.js
// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { usePinch } from "@use-gesture/react";
// import "./../styles/textManipulation.css"; // Tailwind will apply utility classes

// const TextManipulation = () => {
//   const [lineSpacing, setLineSpacing] = useState(1.5); // Default line spacing
//   const [selectedLines, setSelectedLines] = useState([]); // Track selected lines

//   // Gesture handler for pinch-to-zoom
//   const bind = usePinch(({ offset: [, dy] }) => {
//     const newSpacing = lineSpacing + dy * 0.01; // Adjust sensitivity
//     setLineSpacing(Math.max(1, Math.min(newSpacing, 3))); // Constrain between 1 and 3
//   });

//   // Handle line selection
//   const toggleLineSelection = (index) => {
//     setSelectedLines((prev) =>
//       prev.includes(index)
//         ? prev.filter((i) => i !== index) // Deselect line
//         : [...prev, index] // Select line
//     );
//   };

//   // Text lines for demonstration
//   const lines = [
//     "This is a line of text for demonstration.",
//     "Another example of dynamic spacing adjustment.",
//     "Pinch to adjust the spacing between lines of text.",
//     "Select lines to overlap and compare contextually.",
//     "This feature helps in side-by-side comparison of lines.",
//   ];

//   return (
//     <motion.div
//       {...bind()} // Add gesture handler
//       className="text-container p-4 bg-white rounded-lg shadow-lg"
//       style={{ lineHeight: `${lineSpacing}em` }}
//     >
//       {lines.map((line, index) => (
//         <motion.p
//           key={index}
//           className={`text-line cursor-pointer ${selectedLines.includes(index) ? "bg-blue-100" : ""} p-2 mb-2`}
//           onClick={() => toggleLineSelection(index)}
//           style={{
//             position: selectedLines.includes(index) ? "absolute" : "static",
//             top: selectedLines.includes(index) ? `${index * 2}em` : "auto",
//           }}
//         >
//           {line}
//         </motion.p>
//       ))}
//     </motion.div>
//   );
// };

// export default TextManipulation;


import React, { useState, useRef, useEffect } from 'react';
import { motion } from "framer-motion";
import { usePinch } from "@use-gesture/react";

const TextManipulation = ({ pageContent = "", onTextExtracted }) => {
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [draggedLine, setDraggedLine] = useState(null);
  const [linePositions, setLinePositions] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const contentRef = useRef(null);
  
  // Initialize text lines from PDF content
  const lines = pageContent.split('\n').filter(line => line.trim());

  // Gesture handling for pinch zoom
  const bind = usePinch(({ offset: [, dy] }) => {
    const newSpacing = lineSpacing + dy * 0.01;
    setLineSpacing(Math.max(0.8, Math.min(newSpacing, 3)));
  });

  // Search functionality
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = [];
      lines.forEach((line, lineIndex) => {
        const regex = new RegExp(searchTerm, 'gi');
        const matches = [...line.matchAll(regex)];
        matches.forEach(match => {
          results.push({
            lineIndex,
            startIndex: match.index,
            endIndex: match.index + searchTerm.length,
            text: match[0]
          });
        });
      });
      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchTerm, lines]);

  // Line selection handling
  const toggleLineSelection = (index) => {
    const newSelected = new Set(selectedLines);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLines(newSelected);
  };

  // Drag functionality
  const handleDragStart = (e, index) => {
    setDraggedLine(index);
    const dragImg = document.createElement('div');
    e.dataTransfer.setDragImage(dragImg, 0, 0);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (draggedLine !== null) {
      const rect = contentRef.current.getBoundingClientRect();
      const y = e.clientY - rect.top;
      setLinePositions(prev => ({
        ...prev,
        [draggedLine]: y
      }));
    }
  };

  const handleDragEnd = () => {
    setDraggedLine(null);
  };

  // Reset functionality
  const resetLayout = () => {
    setLinePositions({});
    setSelectedLines(new Set());
    setLineSpacing(1.5);
  };

  return (
    <motion.div className="w-full max-w-4xl mx-auto p-4">
      {/* Search Controls */}
      <div className="mb-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search text..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-600">
            {searchResults.length > 0 ? 
              `${currentSearchIndex + 1} of ${searchResults.length}` : 
              'No results'}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <motion.div
        {...bind()}
        ref={contentRef}
        className="bg-white rounded-lg shadow-lg p-6 relative min-h-[400px]"
        onDragOver={handleDragOver}
      >
        {lines.map((line, index) => (
          <motion.p
            key={index}
            className={`transition-all duration-200 ease-in-out absolute w-full 
              ${selectedLines.has(index) ? 'bg-blue-100 cursor-move' : 'cursor-pointer'}
              ${draggedLine === index ? 'opacity-50' : 'opacity-100'}`}
            style={{ 
              lineHeight: `${lineSpacing}`,
              top: linePositions[index] || `${index * (lineSpacing * 1.5)}rem`,
              zIndex: draggedLine === index ? 1000 : selectedLines.has(index) ? 100 : 1
            }}
            onClick={() => toggleLineSelection(index)}
            draggable={selectedLines.has(index)}
            onDragStart={(e) => handleDragStart(e, index)}
            onDragEnd={handleDragEnd}
          >
            {line}
          </motion.p>
        ))}
      </motion.div>

      {/* Controls */}
      <div className="mt-4 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <div className="text-sm text-gray-600">
          Line spacing: {lineSpacing.toFixed(2)}
        </div>
        <button 
          onClick={resetLayout}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Reset Layout
        </button>
      </div>
    </motion.div>
  );
};

export default TextManipulation;