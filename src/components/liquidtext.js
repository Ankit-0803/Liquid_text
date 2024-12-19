import React, { useState, useRef, useEffect } from 'react';

const LiquidText = () => {
  // Existing state
  const [currentPage, setCurrentPage] = useState(0);
  const [lineSpacing, setLineSpacing] = useState(1.5);
  const [initialTouchDistance, setInitialTouchDistance] = useState(null);
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [draggedLine, setDraggedLine] = useState(null);
  const [linePositions, setLinePositions] = useState({});
  
  // Search-related state
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(-1);
  const contentRef = useRef(null);

  const pages = [
    {
      id: 0,
      content: `Page 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.`
    },
    {
      id: 1,
      content: `Page 2
Duis aute irure dolor in reprehenderit in voluptate velit.
Excepteur sint occaecat cupidatat non proident, sunt in culpa.
Qui officia deserunt mollit anim id est laborum dolor.`
    },
    {
      id: 2,
      content: `Page 3
Nam libero tempore, cum soluta nobis est eligendi optio.
Cumque nihil impedit quo minus id quod maxime placeat.
Facere possimus, omnis voluptas assumenda est dolor.`
    }
  ];

  // Search functionality
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const results = [];
      pages.forEach((page, pageIndex) => {
        const lines = page.content.split('\n');
        lines.forEach((line, lineIndex) => {
          const regex = new RegExp(searchTerm, 'gi');
          const matches = [...line.matchAll(regex)];
          matches.forEach(match => {
            results.push({
              pageIndex,
              lineIndex,
              startIndex: match.index,
              endIndex: match.index + searchTerm.length,
              text: match[0]
            });
          });
        });
      });
      setSearchResults(results);
      setCurrentSearchIndex(results.length > 0 ? 0 : -1);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(-1);
    }
  }, [searchTerm]);

  // Navigate to next search result
  const goToNextSearchResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      const result = searchResults[nextIndex];
      if (result.pageIndex !== currentPage) {
        setCurrentPage(result.pageIndex);
      }
    }
  };

  // Navigate to previous search result
  const goToPrevSearchResult = () => {
    if (searchResults.length > 0) {
      const prevIndex = (currentSearchIndex - 1 + searchResults.length) % searchResults.length;
      setCurrentSearchIndex(prevIndex);
      const result = searchResults[prevIndex];
      if (result.pageIndex !== currentPage) {
        setCurrentPage(result.pageIndex);
      }
    }
  };

  // Highlight search results in text
  const highlightSearchResults = (text, lineIndex) => {
    if (!searchTerm || searchTerm.length < 2) return text;

    const currentPageResults = searchResults.filter(
      result => result.pageIndex === currentPage && result.lineIndex === lineIndex
    );

    if (currentPageResults.length === 0) return text;

    let result = [];
    let lastIndex = 0;

    currentPageResults.forEach((match, index) => {
      const isCurrentMatch = searchResults.indexOf(match) === currentSearchIndex;
      
      result.push(text.substring(lastIndex, match.startIndex));
      result.push(
        <span 
          key={index}
          className={`${isCurrentMatch ? 'bg-yellow-300' : 'bg-yellow-100'}`}
        >
          {text.substring(match.startIndex, match.endIndex)}
        </span>
      );
      lastIndex = match.endIndex;
    });

    result.push(text.substring(lastIndex));
    return result;
  };

  // Existing gesture handlers
  const getTouchDistance = (touches) => {
    return Math.hypot(
      touches[0].clientX - touches[1].clientX,
      touches[0].clientY - touches[1].clientY
    );
  };

  const handleTouchStart = (e) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      setInitialTouchDistance(getTouchDistance(e.touches));
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialTouchDistance !== null) {
      e.preventDefault();
      const currentDistance = getTouchDistance(e.touches);
      const scale = currentDistance / initialTouchDistance;
      const newSpacing = Math.min(Math.max(scale * 1.5, 0.8), 3);
      setLineSpacing(newSpacing);
    }
  };

  const handleTouchEnd = () => {
    setInitialTouchDistance(null);
  };

  // Existing navigation handlers
  const goToNextPage = () => {
    if (currentPage < pages.length - 1) {
      setCurrentPage(prev => prev + 1);
      resetPageState();
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
      resetPageState();
    }
  };

  // Reset handlers
  const resetPageState = () => {
    setSelectedLines(new Set());
    setLinePositions({});
  };

  const resetLayout = () => {
    setLinePositions({});
    setSelectedLines(new Set());
    setLineSpacing(1.5);
  };

  // Existing line manipulation handlers
  const toggleLineSelection = (index) => {
    const newSelected = new Set(selectedLines);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedLines(newSelected);
  };

  const handleDragStart = (e, index) => {
    setDraggedLine(index);
    const dragImg = document.createElement('div');
    dragImg.style.opacity = '0';
    document.body.appendChild(dragImg);
    e.dataTransfer.setDragImage(dragImg, 0, 0);
    document.body.removeChild(dragImg);
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

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      {/* Search Bar */}
      <div className="mb-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search text..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={goToPrevSearchResult}
            disabled={searchResults.length === 0}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            ↑
          </button>
          <button
            onClick={goToNextSearchResult}
            disabled={searchResults.length === 0}
            className="px-4 py-2 bg-gray-100 rounded-lg disabled:opacity-50"
          >
            ↓
          </button>
          <span className="text-sm text-gray-600">
            {searchResults.length > 0 ? 
              `${currentSearchIndex + 1} of ${searchResults.length}` : 
              'No results'}
          </span>
        </div>
      </div>

      {/* Page Navigation */}
      <div className="mb-4 flex justify-between items-center bg-gray-100 p-4 rounded-lg">
        <button 
          onClick={goToPrevPage}
          disabled={currentPage === 0}
          className={`px-4 py-2 rounded ${currentPage === 0 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Previous Page
        </button>
        <span className="text-lg font-semibold">
          Page {currentPage + 1} of {pages.length}
        </span>
        <button 
          onClick={goToNextPage}
          disabled={currentPage === pages.length - 1}
          className={`px-4 py-2 rounded ${currentPage === pages.length - 1 ? 'bg-gray-300' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
        >
          Next Page
        </button>
      </div>

      {/* Content Area */}
      <div 
        ref={contentRef}
        className="bg-white rounded-lg shadow-lg p-6 relative min-h-[400px]"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        onDragOver={handleDragOver}
      >
        {pages[currentPage].content.split('\n').map((line, index) => (
          <p
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
            {highlightSearchResults(line, index)}
          </p>
        ))}
      </div>
      
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
    </div>
  );
};

export default LiquidText;