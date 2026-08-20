import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ currentPage = 1, onPageChange }) {
  // Generar rango de números de página alrededor de currentPage
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = start + maxVisible - 1;

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <button 
        className="pagination-btn" 
        onClick={handlePrev}
        disabled={currentPage <= 1}
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} /> Anterior
      </button>

      {getPageNumbers().map((pageNum) => (
        <button
          key={pageNum}
          className={`pagination-btn ${pageNum === currentPage ? 'active' : ''}`}
          onClick={() => onPageChange && onPageChange(pageNum)}
        >
          {pageNum}
        </button>
      ))}

      <button 
        className="pagination-btn" 
        onClick={handleNext}
        aria-label="Página siguiente"
      >
        Siguiente <ChevronRight size={18} />
      </button>
    </div>
  );
}
