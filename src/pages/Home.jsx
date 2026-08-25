import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info } from 'lucide-react';
import heroBg from '../assets/hero-bg.png';
import apiService from '../services/api';
import Carousel from '../components/Carousel';

function Home() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [estrenos, setEstrenos] = useState([]);
  const [seriesEstrenos, setSeriesEstrenos] = useState([]);
  const [seriesTop, setSeriesTop] = useState([]);
  const [infantil, setInfantil] = useState([]);
  const [heroMovies, setHeroMovies] = useState([]);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [trendingData, recentEpisodes, dailyTrending, estrenosData, seriesEstrenosData, seriesTopData, infantilData] = await Promise.all([
          apiService.getTrending('peliculas', 1),
          apiService.getRecentEpisodes(),
          apiService.getDailyTrending(),
          apiService.getEstrenos(),
          apiService.getSeriesEstrenos(),
          apiService.getSeriesTop(),
          apiService.getInfantil()
        ]);
        setMovies(trendingData);
        setEpisodes(recentEpisodes);
        const topHero = dailyTrending.slice(0, 5);
        setHeroMovies(topHero);
        
        // Precargar imágenes del hero en la memoria caché del navegador
        topHero.forEach((movie) => {
          const imgUrl = movie.backdrop || movie.poster;
          if (imgUrl) {
            const img = new Image();
            img.src = imgUrl;
          }
        });

        setEstrenos(estrenosData);
        setSeriesEstrenos(seriesEstrenosData);
        setSeriesTop(seriesTopData);
        setInfantil(infantilData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Intervalo para cambiar el banner cada 7 segundos
  useEffect(() => {
    if (heroMovies.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroMovies.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [heroMovies]);

  const currentHero = heroMovies[currentHeroIndex] || {
    title: 'Explora Mundos Infinitos',
    overview: 'Descubre las mejores historias, desde los clásicos atemporales hasta los últimos lanzamientos mundiales. Todo en un solo lugar.',
    backdrop: heroBg
  };

  return (
    <>
      {/* Hero Section */}
      <header className="hero-header" style={{
        position: 'relative',
        minHeight: '440px',
        height: '55vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 5%',
        overflow: 'hidden'
      }}>
        {/* Banners apilados persistentemente en el DOM (cero peticiones adicionales a internet en bucle) */}
        {heroMovies.length > 0 ? (
          heroMovies.map((movie, idx) => {
            const isActive = idx === currentHeroIndex;
            return (
              <motion.img
                key={movie.id || idx}
                src={movie.backdrop || movie.poster || heroBg}
                alt={movie.title || 'Banner principal'}
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.9, ease: 'easeInOut' }}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  zIndex: isActive ? -1 : -2,
                  pointerEvents: 'none'
                }}
              />
            );
          })
        ) : (
          <img
            src={heroBg}
            alt="Banner por defecto"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              zIndex: -1
            }}
          />
        )}

        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to right, rgba(10,10,12,1) 0%, rgba(10,10,12,0.6) 40%, rgba(10,10,12,0) 100%), linear-gradient(to bottom, transparent 60%, rgba(10,10,12,1) 100%)',
          zIndex: -1
        }} />

        <motion.div
          key={`content-${currentHero.id || 'default'}`}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ maxWidth: '600px' }}
        >
          <span style={{
            color: 'var(--accent-primary)',
            fontWeight: '600',
            letterSpacing: '2px',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            {currentHero.id ? 'Tendencia Hoy' : 'ESTRENO EXCLUSIVO'}
          </span>
          <h2 className="hero-title" style={{ fontSize: '3.5rem', margin: '1rem 0', lineHeight: '1.1' }}>
            {currentHero.title}
          </h2>
          <p className="hero-text" style={{
            color: 'var(--text-secondary)',
            fontSize: '1.1rem',
            marginBottom: '2rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {currentHero.overview}
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="btn-primary"
              onClick={() => currentHero.id && navigate(`/${currentHero.type}/${currentHero.id}/${currentHero.slug}`)}
            >
              <Play size={20} fill="white" /> Reproducir
            </button>
          </div>

          {/* Indicadores de Slide */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.8rem' }}>
            {heroMovies.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentHeroIndex(idx)}
                style={{
                  width: idx === currentHeroIndex ? '30px' : '10px',
                  height: '6px',
                  borderRadius: '3px',
                  backgroundColor: idx === currentHeroIndex ? 'var(--accent-primary)' : 'rgba(255,255,255,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>
        </motion.div>
      </header>

      <main>
        {/* Series Encantadoras Section */}
        <section className="first-home-section" style={{ padding: '1rem 0 2rem 0' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', padding: '0 5%' }}>Series</h3>
          <div className="horizontal-scroll">
            {loading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="encantadora-card glass" style={{ opacity: 0.3 }} />
              ))
            ) : (
              seriesEstrenos.map((serie) => (
                <motion.div
                  key={serie.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/serie/${serie.id}/${serie.slug}`)}
                  className="encantadora-card"
                >
                  <img src={serie.backdrop} alt="" className="encantadora-backdrop" />
                  <div className="encantadora-content">
                    <img src={serie.poster} alt={serie.title} className="encantadora-poster" />
                    <div className="encantadora-info">
                      <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.3rem', color: 'white' }}>{serie.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{serie.year}</p>
                      <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.7rem', background: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>NUEVO</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Estrenos Section */}
        <section style={{ padding: '2rem 0' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', padding: '0 5%' }}>Estrenos</h3>
          <div className="horizontal-scroll">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass" style={{ flex: '0 0 160px', aspectRatio: '2/3', borderRadius: 'var(--radius-md)', opacity: 0.3 }} />
              ))
            ) : (
              estrenos.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/pelicula/${movie.id}/${movie.slug}`)}
                  className="glass"
                  style={{
                    flex: '0 0 160px',
                    aspectRatio: '2/3',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={movie.poster}
                    alt={movie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Episodes Section */}
        <section style={{ padding: '2rem 0' }}>
          <h3 style={{ marginBottom: '1rem', fontSize: '1.5rem', padding: '0 5%' }}>Últimos Episodios</h3>
          <div className="horizontal-scroll">
            {loading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="episode-card glass" style={{ opacity: 0.3 }} />
              ))
            ) : (
              episodes.map((ep) => (
                <motion.div
                  key={`${ep.seriesId}-${ep.season}-${ep.episode}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => navigate(`/serie/${ep.seriesId}/${ep.seriesSlug}/temporada/${ep.season}/episodio/${ep.episode}`)}
                  className="episode-card glass"
                >
                  <img
                    src={ep.image}
                    alt={ep.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div className="episode-overlay">
                    <p style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: '600' }}>
                      S{ep.season} E{ep.episode}
                    </p>
                    <p style={{ fontWeight: '500', fontSize: '0.95rem', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {ep.title}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Series Top Section */}
        <section style={{ padding: '2rem 0' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', padding: '0 5%' }}>Series Top</h3>
          <div className="horizontal-scroll">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass" style={{ flex: '0 0 160px', aspectRatio: '2/3', borderRadius: 'var(--radius-md)', opacity: 0.3 }} />
              ))
            ) : (
              seriesTop.map((serie) => (
                <motion.div
                  key={serie.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/serie/${serie.id}/${serie.slug}`)}
                  className="glass"
                  style={{
                    flex: '0 0 160px',
                    aspectRatio: '2/3',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={serie.poster}
                    alt={serie.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                  <div style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.6)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '3px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <span style={{ color: '#FFD700', fontSize: '0.8rem' }}>★</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{serie.rate || 'N/A'}</span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Infantil Section */}
        <section style={{ padding: '2rem 0' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', padding: '0 5%' }}>Infantil</h3>
          <div className="horizontal-scroll">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass" style={{ flex: '0 0 160px', aspectRatio: '2/3', borderRadius: 'var(--radius-md)', opacity: 0.3 }} />
              ))
            ) : (
              infantil.map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate(`/${item.type}/${item.id}/${item.slug}`)}
                  className="glass"
                  style={{
                    flex: '0 0 160px',
                    aspectRatio: '2/3',
                    borderRadius: 'var(--radius-md)',
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer'
                  }}
                >
                  <img
                    src={item.poster}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    loading="lazy"
                  />
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Trending Section - Horizontal Sliding Carousel (12 resultados) */}
        <Carousel
          title="Tendencias"
          items={movies}
          loading={loading}
          maxItems={12}
          onItemClick={(movie) => navigate(`/${movie.type}/${movie.id}/${movie.slug}`)}
        />
      </main>
    </>
  );
}

export default Home;
