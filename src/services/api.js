import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

const wrapWithProxy = (url) => {
    if (!url) return url;
    try {
        const urlObj = new URL(url);
        const hParam = urlObj.searchParams.get('h');
        if (hParam) {
            // Usamos nuestro servidor de Node en el puerto 3001
            return `${API_BASE_URL}/stream?h=${encodeURIComponent(hParam)}`;
        }
    } catch (e) {
        const match = url.match(/[?&]h=([^&]+)/);
        if (match) {
            return `${API_BASE_URL}/stream?h=${encodeURIComponent(match[1])}`;
        }
    }
    return url;
};

const apiService = {
    getTrending: async (type = 'peliculas', page = 1) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'trending', type, page }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => {
                const fullSlug = item.url?.slug || item.slug || '';
                const isSerie = fullSlug.startsWith('series/');
                const cleanedSlug = fullSlug.replace(/^series\//, '').replace(/^movies\//, '');
                
                return {
                    id: item.TMDbId || item.id,
                    title: item.titles?.name || 'Sin título',
                    poster: item.images?.poster,
                    year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                    slug: cleanedSlug,
                    type: isSerie ? 'serie' : 'pelicula',
                    tmdbId: item.TMDbId || item.id
                };
            });
        } catch (error) {
            console.error('Error fetching trending:', error);
            return [];
        }
    },

    search: async (q) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'search', q }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => {
                const fullSlug = item.url?.slug || item.slug || '';
                const isSerie = fullSlug.startsWith('series/');
                const cleanedSlug = fullSlug.replace(/^series\//, '').replace(/^movies\//, '');
                
                return {
                    id: item.TMDbId || item.id,
                    title: item.titles?.name || 'Sin título',
                    poster: item.images?.poster,
                    year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                    slug: cleanedSlug,
                    type: isSerie ? 'serie' : 'pelicula',
                    tmdbId: item.TMDbId || item.id
                };
            });
        } catch (error) {
            console.error('Error searching:', error);
            return [];
        }
    },

    getDetails: async (id, slug, isSerie = false) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'details', id, slug, isSerie: isSerie.toString() }
            });
            
            const data = isSerie ? response.data.pageProps.thisSerie : response.data.pageProps.thisMovie;
            
            if (!data) return null;

            // Envolvemos los videos en el proxy
            if (data.videos) {
                Object.keys(data.videos).forEach(lang => {
                    data.videos[lang] = data.videos[lang].map(v => ({
                        ...v,
                        result: wrapWithProxy(v.result)
                    }));
                });
            }

            return {
                ...data,
                title: data.titles?.name,
                poster: data.images?.poster,
                year: data.releaseDate ? data.releaseDate.substring(0, 4) : ''
            };
        } catch (error) {
            console.error('Error fetching details:', error);
            return null;
        }
    },

    getEpisode: async (id, slug, s, e) => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'episode', id, slug, s, e }
            });
            const data = response.data.pageProps;

            // Envolvemos los videos del episodio en el proxy
            if (data?.episode?.videos) {
                Object.keys(data.episode.videos).forEach(lang => {
                    data.episode.videos[lang] = data.episode.videos[lang].map(v => ({
                        ...v,
                        result: wrapWithProxy(v.result)
                    }));
                });
            }

            return data;
        } catch (error) {
            console.error('Error fetching episode:', error);
            return null;
        }
    },

    getRecentEpisodes: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'episodes' }
            });
            const rawData = response.data.pageProps.episodes || [];
            return rawData.map(item => {
                // El slug viene como series/ID/NAME/seasons/S/episodes/E
                const slugParts = item.url.slug.split('/');
                const seriesId = slugParts[1];
                const seriesSlug = slugParts[2];
                const season = slugParts[4];
                const episode = slugParts[6];

                return {
                    id: item.TMDbId,
                    title: item.title,
                    image: item.image,
                    seriesId,
                    seriesSlug,
                    season,
                    episode,
                    fullSlug: item.url.slug
                };
            });
        } catch (error) {
            console.error('Error fetching recent episodes:', error);
            return [];
        }
    },

    getDailyTrending: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'trending_daily' }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => ({
                id: item.TMDbId || item.id,
                title: item.titles?.name || 'Sin título',
                backdrop: item.images?.backdrop,
                poster: item.images?.poster,
                overview: item.overview,
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                slug: (item.url?.slug || item.slug || '').replace(/^movies\//, '').replace(/^series\//, ''),
                type: (item.url?.slug || item.slug || '').startsWith('series/') ? 'serie' : 'pelicula'
            }));
        } catch (error) {
            console.error('Error fetching daily trending:', error);
            return [];
        }
    },

    getEstrenos: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'estrenos' }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => ({
                id: item.TMDbId || item.id,
                title: item.titles?.name || 'Sin título',
                poster: item.images?.poster,
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                slug: (item.url?.slug || item.slug || '').replace(/^movies\//, '').replace(/^series\//, ''),
                type: 'pelicula'
            }));
        } catch (error) {
            console.error('Error fetching estrenos:', error);
            return [];
        }
    },

    getSeriesEstrenos: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'series_estrenos' }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => ({
                id: item.TMDbId || item.id,
                title: item.titles?.name || 'Sin título',
                poster: item.images?.poster,
                backdrop: item.images?.backdrop,
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                slug: (item.url?.slug || item.slug || '').replace(/^series\//, '').replace(/^movies\//, ''),
                type: 'serie'
            }));
        } catch (error) {
            console.error('Error fetching series estrenos:', error);
            return [];
        }
    },

    getSeriesTop: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'series_top' }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => ({
                id: item.TMDbId || item.id,
                title: item.titles?.name || 'Sin título',
                poster: item.images?.poster,
                rate: item.rate?.average,
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                slug: (item.url?.slug || item.slug || '').replace(/^series\//, '').replace(/^movies\//, ''),
                type: 'serie'
            }));
        } catch (error) {
            console.error('Error fetching series top:', error);
            return [];
        }
    },

    getInfantil: async () => {
        try {
            const response = await axios.get(API_BASE_URL, {
                params: { action: 'infantil' }
            });
            const rawData = response.data.pageProps.movies || [];
            return rawData.map(item => ({
                id: item.TMDbId || item.id,
                title: item.titles?.name || 'Sin título',
                poster: item.images?.poster,
                year: item.releaseDate ? item.releaseDate.substring(0, 4) : '',
                slug: (item.url?.slug || item.slug || '').replace(/^movies\//, '').replace(/^series\//, ''),
                type: (item.url?.slug || item.slug || '').startsWith('series/') ? 'serie' : 'pelicula'
            }));
        } catch (error) {
            console.error('Error fetching infantil:', error);
            return [];
        }
    }
};

export default apiService;
