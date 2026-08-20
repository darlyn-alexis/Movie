import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Carousel from '../components/Carousel';
import Pagination from '../components/Pagination';

function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      const data = await apiService.getTrending('peliculas', page);
      setMovies(data);
      setLoading(false);
    };
    fetchMovies();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMovieClick = (movie) => {
    navigate(`/pelicula/${movie.id}/${movie.slug}`);
  };

  // Dividir los resultados en 4 grupos de 6 películas
  const carousel1 = movies.slice(0, 6);
  const carousel2 = movies.slice(6, 12);
  const carousel3 = movies.slice(12, 18);
  const carousel4 = movies.slice(18, 24);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '3rem' }}>
      <header style={{ padding: '0 5%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Películas</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Cinematografía de alto nivel organizadas en categorías exclusivas.</p>
        </div>
        <span style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          background: 'rgba(255,255,255,0.05)',
          padding: '6px 14px',
          borderRadius: '12px',
          border: '1px solid var(--border-glass)'
        }}>
          Página {page}
        </span>
      </header>

      <main>
        {/* Carrusel 1: Películas Populares */}
        <Carousel
          title="Películas Populares"
          items={carousel1}
          loading={loading}
          maxItems={6}
          onItemClick={handleMovieClick}
        />

        {/* Carrusel 2: Estrenos Destacados */}
        <Carousel
          title="Estrenos Destacados"
          items={carousel2}
          loading={loading}
          maxItems={6}
          onItemClick={handleMovieClick}
        />

        {/* Carrusel 3: Tendencias de la Semana */}
        <Carousel
          title="Tendencias de la Semana"
          items={carousel3}
          loading={loading}
          maxItems={6}
          onItemClick={handleMovieClick}
        />

        {/* Carrusel 4: Recomendadas para Ti */}
        <Carousel
          title="Recomendadas para Ti"
          items={carousel4}
          loading={loading}
          maxItems={6}
          onItemClick={handleMovieClick}
        />

        {/* Control de Paginación */}
        {!loading && (
          <div style={{ padding: '0 5%' }}>
            <Pagination 
              currentPage={page} 
              onPageChange={handlePageChange} 
            />
          </div>
        )}
      </main>
    </div>
  );
}

export default Movies;
