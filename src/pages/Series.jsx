import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiService from '../services/api';
import Carousel from '../components/Carousel';
import Pagination from '../components/Pagination';

function Series() {
  const navigate = useNavigate();
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchSeries = async () => {
      setLoading(true);
      const data = await apiService.getTrending('series', page);
      setSeries(data);
      setLoading(false);
    };
    fetchSeries();
  }, [page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSeriesClick = (serie) => {
    navigate(`/serie/${serie.id}/${serie.slug}`);
  };

  // Dividir los resultados en 4 grupos de 6 series
  const carousel1 = series.slice(0, 6);
  const carousel2 = series.slice(6, 12);
  const carousel3 = series.slice(12, 18);
  const carousel4 = series.slice(18, 24);

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '3rem' }}>
      <header style={{ padding: '0 5%', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Series de TV</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Las mejores producciones episódicas organizadas en categorías exclusivas.</p>
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
        {/* Carrusel 1: Series Populares */}
        <Carousel
          title="Series Populares"
          items={carousel1}
          loading={loading}
          maxItems={6}
          onItemClick={handleSeriesClick}
        />

        {/* Carrusel 2: Estrenos de Series */}
        <Carousel
          title="Estrenos de Series"
          items={carousel2}
          loading={loading}
          maxItems={6}
          onItemClick={handleSeriesClick}
        />

        {/* Carrusel 3: Series Top de la Semana */}
        <Carousel
          title="Series Top de la Semana"
          items={carousel3}
          loading={loading}
          maxItems={6}
          onItemClick={handleSeriesClick}
        />

        {/* Carrusel 4: Recomendadas para Ti */}
        <Carousel
          title="Recomendadas para Ti"
          items={carousel4}
          loading={loading}
          maxItems={6}
          onItemClick={handleSeriesClick}
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

export default Series;
