import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Star, Calendar, Clock, Tv, ChevronDown, ChevronUp } from 'lucide-react';
import apiService from '../services/api';

function MovieDetail() {
  const { id, "*": slug } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeServerUrl, setActiveServerUrl] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isAutoclickDone, setIsAutoclickDone] = useState(false);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'autoclick-finished') {
        console.log("Auto-clic completado, retirando telón...");
        setIsAutoclickDone(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDetails(id, slug, false);
        setMovie(data);
        // Pre-seleccionar el primer idioma disponible
        if (data?.videos) {
          const langs = Object.keys(data.videos).filter(l => data.videos[l]?.length > 0);
          if (langs.length > 0) setActiveLanguage(langs[0]);
        }
      } catch (error) {
        console.error("Error fetching movie details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, slug]);

  const handlePlayClick = () => {
    setIsPlaying(true);
    // Si hay un idioma activo y tiene videos, seleccionar el primero
    if (activeLanguage && movie.videos[activeLanguage]?.length > 0) {
      setActiveServerUrl(movie.videos[activeLanguage][0].result);
    }
  };

  if (loading) return (
    <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!movie) return (
    <div style={{ paddingTop: '100px', textAlign: 'center' }}>
      <h2>No se encontró la película.</h2>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)' }}>
      {/* Backdrop Hero / Player Section */}
      <div style={{
        position: 'relative',
        height: '50vh',
        width: '100%',
        backgroundColor: '#000',
        backgroundImage: isPlaying ? 'none' : `url(${movie.images?.backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        {/* El iframe siempre está ahí si se está reproduciendo, pero lo tapamos con el backdrop */}
        {isPlaying && activeServerUrl && (
          <iframe
            src={activeServerUrl}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              opacity: isAutoclickDone ? 1 : 0, // Oculto hasta que termine el auto-clic
              transition: 'opacity 0.8s ease'
            }}
            allowFullScreen
          ></iframe>
        )}

        {/* Backdrop / Telón: Se muestra si no se está reproduciendo O si el auto-clic aún no termina */}
        {(!isPlaying || !isAutoclickDone) && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${movie.images?.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: 1
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(to top, var(--bg-main) 5%, transparent 50%), linear-gradient(to right, var(--bg-main) 0%, transparent 50%)',
              opacity: isExpandedView ? 0 : 1,
              transition: 'opacity 0.6s ease'
            }} />

            {/* Cargador Premium mientras ocurre el auto-clic */}
            {isPlaying && !isAutoclickDone && (
              <div className="loader-container">
                <div className="spinner"></div>
                <p className="loader-text">Sincronizando con el servidor...</p>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '-0.5rem' }}>Eliminando publicidad y preparando stream</span>
              </div>
            )}
          </div>
        )}

        {/* Overlay para cuando se está reproduciendo pero no hay servidor seleccionado */}
        {isPlaying && !activeServerUrl && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', zIndex: 3 }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Selecciona un servidor abajo para comenzar la reproducción</p>
          </div>
        )}

        {/* Gradiente inferior para ocultar controles del reproductor */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '28%',
          background: 'linear-gradient(to top, var(--bg-main) 10%, rgba(0,0,0,0.8) 40%, transparent 100%)',
          opacity: isExpandedView ? 0 : 1,
          transition: 'opacity 0.6s ease',
          pointerEvents: 'none',
          zIndex: 2
        }} />
      </div>

      {/* Content Area - Edge to Edge Glass Panel with Gradual Blur Mask */}
      <div style={{
        marginTop: isExpandedView ? '-2vh' : '-25vh',
        position: 'relative',
        zIndex: 10,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' // Animación suave premium
      }}>
        <div className="glass" style={{
          width: '100%',
          borderRadius: '0',
          backdropFilter: 'blur(50px)',
          WebkitBackdropFilter: 'blur(50px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 100%)',
          borderLeft: 'none',
          borderRight: 'none',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 30px 60px rgba(0,0,0,0.6)',
          padding: '4rem 5%',
          display: 'flex',
          gap: '4rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start'
        }}>
          {/* Poster */}
          <div className="movie-poster" style={{
            width: '260px',
            aspectRatio: '2/3',
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '0 15px 30px rgba(0,0,0,0.5)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <img src={movie.poster} alt={movie.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Info & Actions */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem', marginBottom: '1.2rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: 0 }}>
                {movie.title}
              </h1>
              <button
                onClick={() => setIsExpandedView(!isExpandedView)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0.4rem',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease, opacity 0.3s ease',
                  opacity: 0.85
                }}
                title={isExpandedView ? "Ver detalles" : "Despejar pantalla"}
              >
                {isExpandedView ? <ChevronUp size={28} /> : <ChevronDown size={28} />}
              </button>
            </div>

            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '1.05rem', fontWeight: '500' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={20} color="var(--accent-primary)" /> {movie.year}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-secondary)' }}><Star size={20} fill="currentColor" /> {movie.rate?.average || 'N/A'}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={20} color="var(--accent-primary)" /> {movie.runtime} min</span>
            </div>

            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.85)', maxWidth: '1000px' }}>
              {movie.overview}
            </p>

            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Panel de Servidores Directo */}
              {movie.videos && (
                <div className="glass" style={{ display: 'flex', flexDirection: 'column', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(255,255,255,0.03)', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <h3 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Play size={16} fill="currentColor" /> Servidores Disponibles
                    </h3>

                    {/* Selector de Idiomas */}
                    <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.3rem', borderRadius: '8px' }}>
                      {Object.keys(movie.videos).map(lang => {
                        const videos = movie.videos[lang] || [];
                        if (videos.length === 0) return null;
                        const languageNames = { 'latino': 'Latino', 'spanish': 'Español', 'english': 'Inglés' };
                        return (
                          <button
                            key={lang}
                            onClick={() => setActiveLanguage(lang)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              borderRadius: '6px',
                              border: 'none',
                              backgroundColor: activeLanguage === lang ? 'var(--accent-primary)' : 'transparent',
                              color: 'white',
                              cursor: 'pointer',
                              fontSize: '0.85rem',
                              fontWeight: 'bold',
                              transition: '0.3s'
                            }}
                          >
                            {languageNames[lang] || lang}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Lista de Servidores */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {activeLanguage && movie.videos[activeLanguage]?.map((video, idx) => {
                      const isSelected = activeServerUrl === video.result;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsAutoclickDone(false);
                            setActiveServerUrl(video.result);
                            setIsPlaying(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });

                            // Seguridad: Forzar la retirada de la imagen tras 7 segundos
                            setTimeout(() => {
                              setIsAutoclickDone(true);
                            }, 7000);
                          }}
                          style={{
                            padding: '0.6rem 1.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: isSelected ? 'rgba(229, 9, 20, 0.1)' : 'rgba(255,255,255,0.05)',
                            color: isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            transition: '0.3s'
                          }}
                        >
                          <Tv size={16} />
                          {video.cyberlocker} <span style={{ opacity: 0.5, fontSize: '0.75rem' }}>({video.quality})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          .movie-poster {
            display: none !important;
          }
          .glass {
            padding: 2rem !important;
          }
        }
      `}} />
    </div>
  );
}

export default MovieDetail;
