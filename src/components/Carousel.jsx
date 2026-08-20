import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Star } from 'lucide-react';

export default function Carousel({ title, items = [], loading = false, onItemClick, maxItems = 12 }) {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  // Limitar items a 12 (o maxItems pasados por prop)
  const displayedItems = items.slice(0, maxItems);

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setShowLeftArrow(scrollLeft > 10);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollPosition();
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
    }
    return () => {
      if (currentRef) currentRef.removeEventListener('scroll', checkScrollPosition);
      window.removeEventListener('resize', checkScrollPosition);
    };
  }, [displayedItems, loading]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    const scrollAmount = direction === 'left' ? -clientWidth * 0.75 : clientWidth * 0.75;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <section className="carousel-section">
      <div className="carousel-header">
        <h3 className="carousel-title">{title}</h3>
        <span className="carousel-count-badge">
          {loading ? '...' : `${displayedItems.length} resultados`}
        </span>
      </div>

      <div className="carousel-wrapper">
        {/* Botón Izquierda */}
        {showLeftArrow && !loading && (
          <button 
            className="carousel-arrow carousel-arrow-left" 
            onClick={() => handleScroll('left')}
            aria-label="Anterior"
          >
            <ChevronLeft size={24} color="white" />
          </button>
        )}

        {/* Contenedor Deslizable */}
        <div className="carousel-track" ref={scrollRef}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="carousel-card-skeleton glass" />
            ))
          ) : displayedItems.length === 0 ? (
            <p className="carousel-empty">No hay contenidos disponibles.</p>
          ) : (
            displayedItems.map((item, index) => (
              <motion.div
                key={item.id || index}
                whileHover={{ scale: 1.05, y: -6 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                onClick={() => onItemClick && onItemClick(item)}
                className="carousel-card glass"
              >
                <div className="carousel-poster-wrapper">
                  <img
                    src={item.poster}
                    alt={item.title || item.name}
                    className="carousel-poster-img"
                    loading="lazy"
                  />
                  <div className="carousel-card-overlay">
                    <div className="play-icon-circle">
                      <Play size={22} fill="white" color="white" />
                    </div>
                  </div>
                  {item.rate && (
                    <div className="carousel-rating-badge">
                      <Star size={12} fill="#FFD700" color="#FFD700" />
                      <span>{item.rate}</span>
                    </div>
                  )}
                </div>

                <div className="carousel-card-info">
                  <h4 className="carousel-card-title">{item.title || item.name}</h4>
                  <div className="carousel-card-meta">
                    {item.year && <span className="carousel-year">{item.year}</span>}
                    {item.type && (
                      <span className="carousel-type-tag">
                        {item.type === 'pelicula' ? 'Película' : item.type === 'serie' ? 'Serie' : item.type}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Botón Derecha */}
        {showRightArrow && !loading && displayedItems.length > 0 && (
          <button 
            className="carousel-arrow carousel-arrow-right" 
            onClick={() => handleScroll('right')}
            aria-label="Siguiente"
          >
            <ChevronRight size={24} color="white" />
          </button>
        )}
      </div>
    </section>
  );
}
