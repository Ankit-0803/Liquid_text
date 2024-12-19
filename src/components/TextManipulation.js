// import React, { useState } from "react";
// import { motion } from "framer-motion";
// import { usePinch } from "@use-gesture/react";
// import "./../styles/textManipulation.css";

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
//       className="text-container"
//       style={{ lineHeight: `${lineSpacing}em` }}
//     >
//       {lines.map((line, index) => (
//         <motion.p
//           key={index}
//           className={`text-line ${selectedLines.includes(index) ? "selected" : ""}`}
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



// src/components/TextManipulation.js
import React, { useState } from "react";
import { motion } from "framer-motion";
import { usePinch } from "@use-gesture/react";
import "./../styles/textManipulation.css"; // Tailwind will apply utility classes

const TextManipulation = () => {
  const [lineSpacing, setLineSpacing] = useState(1.5); // Default line spacing
  const [selectedLines, setSelectedLines] = useState([]); // Track selected lines

  // Gesture handler for pinch-to-zoom
  const bind = usePinch(({ offset: [, dy] }) => {
    const newSpacing = lineSpacing + dy * 0.01; // Adjust sensitivity
    setLineSpacing(Math.max(1, Math.min(newSpacing, 3))); // Constrain between 1 and 3
  });

  // Handle line selection
  const toggleLineSelection = (index) => {
    setSelectedLines((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index) // Deselect line
        : [...prev, index] // Select line
    );
  };

  // Text lines for demonstration
  const lines = [
    "This is a line of text for demonstration.",
    "Another example of dynamic spacing adjustment.",
    "Pinch to adjust the spacing between lines of text.",
    "Select lines to overlap and compare contextually.",
    "This feature helps in side-by-side comparison of lines.",
  ];

  return (
    <motion.div
      {...bind()} // Add gesture handler
      className="text-container p-4 bg-white rounded-lg shadow-lg"
      style={{ lineHeight: `${lineSpacing}em` }}
    >
      {lines.map((line, index) => (
        <motion.p
          key={index}
          className={`text-line cursor-pointer ${selectedLines.includes(index) ? "bg-blue-100" : ""} p-2 mb-2`}
          onClick={() => toggleLineSelection(index)}
          style={{
            position: selectedLines.includes(index) ? "absolute" : "static",
            top: selectedLines.includes(index) ? `${index * 2}em` : "auto",
          }}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  );
};

export default TextManipulation;
