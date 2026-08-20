import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/api';

function Search() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query) {
      const performSearch = async () => {
        setLoading(true);
        const data = await apiService.search(query);
        setResults(data);
        setLoading(false);
      };
      performSearch();
    }
  }, [query]);

  return (
    <div style={{ paddingTop: '100px', paddingLeft: '5%', paddingRight: '5%', minHeight: '100vh' }}>
      <header style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
          Resultados para: <span style={{ color: 'var(--accent-primary)' }}>{query}</span>
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          {loading ? 'Buscando...' : `${results.length} resultados encontrados`}
        </p>
      </header>

      <main>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
          gap: '1.2rem'
        }}>
          {loading ? (
            [1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass" style={{ aspectRatio: '2/3', borderRadius: 'var(--radius-md)', opacity: 0.3 }} />
            ))
          ) : (
            results.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/${item.type}/${item.id}/${item.slug}`)}
                className="glass"
                style={{ 
                  aspectRatio: '2/3', 
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'pointer'
                }}
              >
                {item.poster ? (
                  <img 
                    src={item.poster} 
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ 
                    width: '100%', 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-muted)'
                  }}>
                    No Image
                  </div>
                )}
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  padding: '1rem',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-end'
                }}>
                  <p style={{ fontWeight: '500', fontSize: '0.7rem', color: 'rgba(255,255,255,0.7)' }}>"TMDbId": "{item.tmdbId}"</p>
                  <span style={{ 
                    fontSize: '0.7rem', 
                    background: item.type === 'serie' ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {item.type === 'serie' ? 'Serie' : 'Peli'}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {!loading && results.length === 0 && query && (
          <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-secondary)' }}>
            <h3>No se encontraron resultados para "{query}"</h3>
            <p>Intenta con otros términos o verifica la ortografía.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Search;
