import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Star, Calendar, Tv, Play, Info, ChevronRight, ChevronDown, ChevronUp, Clock, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../services/api';

function SeriesDetail() {
  const { id, "*": slug } = useParams();
  const [series, setSeries] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSeason, setActiveSeason] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isChangingSeason, setIsChangingSeason] = useState(false);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [episodeData, setEpisodeData] = useState(null);
  const [loadingEpisode, setLoadingEpisode] = useState(false);
  const [activeServerUrl, setActiveServerUrl] = useState(null);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [isExpandedView, setIsExpandedView] = useState(false);
  const [isAutoclickDone, setIsAutoclickDone] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data === 'autoclick-finished') {
        setIsAutoclickDone(true);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleEpisodeClick = async (episode, epNumber) => {
    setSelectedEpisode(episode);
    setLoadingEpisode(true);
    setEpisodeData(null);
    setActiveServerUrl(null);
    setIsAutoclickDone(false); // Reiniciar telón
    
    // Scroll suave hacia arriba para ver el reproductor
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const sNumber = activeSeason?.seasonNumber || activeSeason?.number;
      const data = await apiService.getEpisode(id, slug, sNumber, epNumber);
      setEpisodeData(data);
      
      if (data?.episode?.videos) {
        const languages = Object.keys(data.episode.videos).filter(lang => data.episode.videos[lang]?.length > 0);
        if (languages.length > 0) {
          const firstLang = languages[0];
          setActiveLanguage(firstLang);
          if (data.episode.videos[firstLang].length > 0) {
            setActiveServerUrl(data.episode.videos[firstLang][0].result);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching episode data", error);
    } finally {
      setLoadingEpisode(false);
      // Seguridad: Forzar retirada de imagen tras 7 segundos
      setTimeout(() => {
        setIsAutoclickDone(true);
      }, 7000);
    }
  };

  const handleSeasonChange = (season) => {
    const sNumber = season.seasonNumber || season.number;
    const activeSNumber = activeSeason?.seasonNumber || activeSeason?.number;
    
    if (sNumber === activeSNumber && activeSeason) return;
    
    setIsChangingSeason(true);
    setIsDropdownOpen(false);
    
    setTimeout(() => {
      setActiveSeason(season);
      setIsChangingSeason(false);
    }, 500);
  };

  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const data = await apiService.getDetails(id, slug, true);
        setSeries(data);
        if (data?.seasons?.length > 0) {
          setActiveSeason(data.seasons[0]);
        }
      } catch (error) {
        console.error("Error loading series details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, slug]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return (
    <div className="loading-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="spinner"></div>
    </div>
  );
  
  if (!series) return (
    <div style={{ paddingTop: '100px', textAlign: 'center' }}>
      <h2>No se encontró la serie.</h2>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-main)', color: 'var(--text-primary)', paddingBottom: '5rem' }}>
      
      {/* Backdrop / Player Section */}
      <div style={{
        position: 'relative',
        height: '55vh',
        width: '100%',
        backgroundColor: '#000',
        backgroundImage: selectedEpisode && activeServerUrl ? 'none' : `url(${series.images?.backdrop})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        overflow: 'hidden'
      }}>
        {selectedEpisode && activeServerUrl && (
          <iframe 
            src={activeServerUrl} 
            style={{ 
              width: '100%', 
              height: '100%', 
              border: 'none',
              opacity: isAutoclickDone ? 1 : 0,
              transition: 'opacity 0.8s ease'
            }} 
            allowFullScreen
          ></iframe>
        )}

        {/* Telón para Series */}
        {(!selectedEpisode || !isAutoclickDone) && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${series.images?.backdrop})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
            zIndex: 1
          }}>
             <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, var(--bg-main) 5%, transparent 50%), linear-gradient(to right, var(--bg-main) 0%, transparent 50%)',
              opacity: isExpandedView ? 0 : 1,
              transition: 'opacity 0.6s ease'
            }} />

            {/* Cargador Premium mientras ocurre el auto-clic */}
            {selectedEpisode && activeServerUrl && !isAutoclickDone && (
              <div className="loader-container">
                <div className="spinner"></div>
                <p className="loader-text">Preparando episodio...</p>
                <span style={{ fontSize: '0.8rem', opacity: 0.5, marginTop: '-0.5rem' }}>Bypass de publicidad activo</span>
              </div>
            )}
          </div>
        )}

        {/* Overlay dinámico para modo cine / Ocultar controles */}
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

        {loadingEpisode && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 5 }}>
            <div className="spinner" style={{ width: '50px', height: '50px' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Cargando episodio...</p>
          </div>
        )}
      </div>

      {/* Main Content Area - Glass Panel Edge to Edge */}
      <div style={{ 
        marginTop: isExpandedView ? '-2vh' : '-25vh', 
        position: 'relative', 
        zIndex: 10,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <div className="glass" style={{ 
          width: '100%', 
          borderRadius: '0',
          backdropFilter: 'blur(45px)',
          WebkitBackdropFilter: 'blur(45px)',
          backgroundImage: 'linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.9) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '4rem 5%',
          display: 'flex',
          flexDirection: 'column',
          gap: '3rem'
        }}>
          
          {/* Top Info Row */}
          <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            {/* Poster (Hiddes on mobile) */}
            <div className="movie-poster" style={{ 
              width: '240px', 
              aspectRatio: '2/3', 
              borderRadius: 'var(--radius-md)', 
              overflow: 'hidden', 
              flexShrink: 0,
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <img src={series.images?.poster} alt={series.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>

            {/* Title and Sinopsis */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', gap: '2rem' }}>
                <div>
                  <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: '800', marginBottom: '0.5rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                    {series.title}
                  </h1>
                  <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    <span style={{ color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Star size={18} fill="currentColor" /> {series.rate?.average || 'N/A'}
                    </span>
                    <span>{series.year}</span>
                    <span>{series.seasons?.length} Temporadas</span>
                  </div>
                </div>

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

              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', maxWidth: '1000px' }}>
                {series.overview || "No hay sinopsis disponible."}
              </p>

              {/* Server Selection (If an episode is selected) */}
              {selectedEpisode && (
                <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Reproduciendo: T{activeSeason?.seasonNumber || activeSeason?.number} • E{selectedEpisode.number}
                      </p>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>{selectedEpisode.title || `Capítulo ${selectedEpisode.number}`}</h3>
                    </div>

                    {/* Language Selector */}
                    {episodeData?.episode?.videos && (
                      <div style={{ display: 'flex', gap: '0.3rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '0.3rem', borderRadius: '8px' }}>
                        {Object.keys(episodeData.episode.videos).map(lang => {
                          const videos = episodeData.episode.videos[lang] || [];
                          if (videos.length === 0) return null;
                          const languageNames = { 'latino': 'Latino', 'spanish': 'Castellano', 'english': 'Inglés' };
                          const isActive = activeLanguage === lang;
                          return (
                            <button 
                              key={lang}
                              onClick={() => setActiveLanguage(lang)}
                              style={{
                                padding: '0.4rem 0.8rem',
                                borderRadius: '6px',
                                border: 'none',
                                backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '0.85rem',
                                fontWeight: 'bold'
                              }}
                            >
                              {languageNames[lang] || lang}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Servers List */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.8rem' }}>
                    {activeLanguage && episodeData?.episode?.videos?.[activeLanguage]?.map((video, idx) => {
                      const isSelected = activeServerUrl === video.result;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setIsAutoclickDone(false); // Reiniciar telón al cambiar servidor
                            setActiveServerUrl(video.result);
                            
                            // Seguridad al cambiar de servidor
                            setTimeout(() => {
                              setIsAutoclickDone(true);
                            }, 7000);
                          }}
                          style={{
                            padding: '0.7rem 1.2rem',
                            borderRadius: 'var(--radius-sm)',
                            border: isSelected ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: isSelected ? 'rgba(229, 9, 20, 0.15)' : 'rgba(255,255,255,0.05)',
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

          {/* Episode Selector Section */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: '700' }}>Temporadas y Episodios</h2>
              
              {/* Season Dropdown */}
              <div style={{ position: 'relative' }} ref={dropdownRef}>
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
                  className="glass" 
                  style={{ 
                    padding: '0.8rem 1.5rem', 
                    borderRadius: 'var(--radius-md)', 
                    color: 'white', 
                    fontWeight: '700', 
                    fontSize: '1rem', 
                    cursor: 'pointer', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    minWidth: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <Tv size={18} color="var(--accent-primary)" />
                    <span>Temporada {activeSeason?.seasonNumber || activeSeason?.number}</span>
                  </div>
                  <ChevronRight size={20} style={{ transform: isDropdownOpen ? 'rotate(-90deg)' : 'rotate(90deg)', transition: '0.3s' }} />
                </button>

                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="glass"
                      style={{ 
                        position: 'absolute', 
                        bottom: 'calc(100% + 10px)', 
                        left: 0, 
                        right: 0, 
                        zIndex: 100, 
                        borderRadius: 'var(--radius-md)', 
                        padding: '0.5rem',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.15)'
                      }}
                    >
                      {series.seasons?.map((season, idx) => {
                        const sNumber = season.seasonNumber || season.number || (idx + 1);
                        const isActive = sNumber === (activeSeason?.seasonNumber || activeSeason?.number);
                        return (
                          <div 
                            key={idx}
                            onClick={() => handleSeasonChange(season)}
                            style={{ 
                              padding: '0.8rem 1rem', 
                              borderRadius: 'var(--radius-sm)', 
                              cursor: 'pointer',
                              backgroundColor: isActive ? 'var(--accent-primary)' : 'transparent',
                              color: 'white',
                              fontWeight: isActive ? 'bold' : 'normal',
                              marginBottom: '2px'
                            }}
                          >
                            Temporada {sNumber}
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Episodes Grid */}
            <div style={{ position: 'relative', minHeight: '300px' }}>
              <AnimatePresence mode="wait">
                {isChangingSeason ? (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px' }}>
                    <div className="spinner"></div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key={activeSeason?.id || activeSeason?.number}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', 
                      gap: '1.5rem' 
                    }}
                  >
                    {activeSeason?.episodes?.map((episode, idx) => {
                      const epNumber = episode.number || (idx + 1);
                      const isSelected = selectedEpisode?.number === epNumber;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleEpisodeClick(episode, epNumber)}
                          style={{
                            borderRadius: 'var(--radius-md)',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: 'rgba(255,255,255,0.03)',
                            transition: '0.3s'
                          }}
                        >
                          <div style={{ position: 'relative', aspectRatio: '16/9' }}>
                            <img src={episode.image || series.images?.backdrop} alt={episode.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isSelected ? 0.5 : 0.8 }} />
                            <div style={{ position: 'absolute', inset: 0, background: isSelected ? 'rgba(229, 9, 20, 0.2)' : 'rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <Play size={32} fill="white" style={{ opacity: isSelected ? 1 : 0 }} />
                            </div>
                            <div style={{ position: 'absolute', bottom: '0.5rem', left: '0.5rem', background: 'rgba(0,0,0,0.7)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                              EP {epNumber}
                            </div>
                          </div>
                          <div style={{ padding: '1rem' }}>
                            <h4 style={{ fontSize: '0.9rem', fontWeight: '600', color: isSelected ? 'var(--accent-primary)' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {episode.title || `Episodio ${epNumber}`}
                            </h4>
                          </div>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .movie-poster {
            display: none !important;
          }
          .glass {
            padding: 2rem 5% !important;
          }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
      `}} />
    </div>
  );
}

export default SeriesDetail;
