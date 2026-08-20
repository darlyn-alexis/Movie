const express = require('express');
const cors = require('cors');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Configuración global de axios
const apiClient = axios.create({
    timeout: 15000, // 15 segundos de timeout
    headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
});

// Ruta raíz para confirmar que el servidor está activo
app.get('/', (req, res) => {
    res.send('🎬 Servidor de API de CINEMA+ activo. Usa /api para consultas.');
});

const CACHE_FILE = path.join(__dirname, 'build_id.txt');
const SOURCE_URL = "https://www.poseidonhd2.co/";

let currentBuildId = "QMBs2RX9w8khM_kG-1j6B";

// Función para obtener el Build ID
async function getBuildId(forceRefresh = false) {
    try {
        const now = Date.now();
        
        if (!forceRefresh && fs.existsSync(CACHE_FILE)) {
            const stats = fs.statSync(CACHE_FILE);
            const age = (now - stats.mtimeMs) / 1000;
            if (age < 86400) {
                return fs.readFileSync(CACHE_FILE, 'utf8').trim();
            }
        }

        console.log("Fetching new Build ID from Poseidon...");
        const response = await apiClient.get(SOURCE_URL);

        const html = response.data;
        const match = html.match(/"buildId":"([^"]+)"/);
        
        if (match && match[1]) {
            const newId = match[1];
            fs.writeFileSync(CACHE_FILE, newId);
            return newId;
        }
        
        return currentBuildId;
    } catch (error) {
        console.error("Error fetching Build ID:", error.message);
        if (fs.existsSync(CACHE_FILE)) {
            return fs.readFileSync(CACHE_FILE, 'utf8').trim();
        }
        return currentBuildId;
    }
}

// Endpoint de la API principal (Búsqueda, Tendencias, Detalles)
app.get('/api', async (req, res) => {
    const { action, id, slug, q, type, page, isSerie, s, e } = req.query;
    
    if (!action) {
        return res.status(400).json({ error: "Missing action" });
    }

    try {
        let buildId = await getBuildId();
        let url = "";
        const name = slug ? slug.split('/').pop() : "";

        switch (action) {
            case 'search':
                url = `${SOURCE_URL}_next/data/${buildId}/es/search.json?q=${encodeURIComponent(q)}`;
                break;
            
            case 'trending':
                const contentType = type || 'peliculas';
                const pageNum = page || 1;
                if (pageNum > 1) {
                    url = `${SOURCE_URL}_next/data/${buildId}/es/${contentType}/page/${pageNum}.json?page=${pageNum}`;
                } else {
                    url = `${SOURCE_URL}_next/data/${buildId}/es/${contentType}.json`;
                }
                break;

            case 'details':
                if (isSerie === 'true') {
                    url = `${SOURCE_URL}_next/data/${buildId}/es/serie/${slug}.json?tmdb=${id}&serie=${name}`;
                } else {
                    url = `${SOURCE_URL}_next/data/${buildId}/es/pelicula/${slug}.json?tmdb=${id}&movie=${name}`;
                }
                break;

            case 'episode':
                url = `${SOURCE_URL}_next/data/${buildId}/es/serie/${slug}/temporada/${s}/episodio/${e}.json?tmdb=${id}&serie=${name}&season=${s}&episode=${e}`;
                break;

            case 'episodes':
                url = `${SOURCE_URL}_next/data/${buildId}/es/episodios.json`;
                break;

            case 'trending_daily':
                url = `${SOURCE_URL}_next/data/${buildId}/es/peliculas/tendencias/dia.json`;
                break;

            case 'estrenos':
                url = `${SOURCE_URL}_next/data/${buildId}/es/peliculas/estrenos.json`;
                break;

            case 'series_estrenos':
                url = `${SOURCE_URL}_next/data/${buildId}/es/series/estrenos.json`;
                break;

            case 'series_top':
                url = `${SOURCE_URL}_next/data/${buildId}/es/series/tendencias/semana.json`;
                break;

            case 'infantil':
                const randomPage = Math.floor(Math.random() * 78) + 1;
                url = `${SOURCE_URL}_next/data/${buildId}/es/genero/familia/page/${randomPage}.json?slug=familia&slug=page&slug=${randomPage}`;
                break;

            default:
                return res.status(400).json({ error: "Invalid action" });
        }

        console.log(`Proxying request to: ${url}`);
        
        try {
            const response = await apiClient.get(url);
            res.json(response.data);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("⚠️ 404 detectado, reintentando con nuevo Build ID...");
                const newBuildId = await getBuildId(true);
                const newUrl = url.replace(buildId, newBuildId);
                
                const retryResponse = await apiClient.get(newUrl);
                res.json(retryResponse.data);
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("Proxy Error:", error.message);
        res.status(500).json({ 
            error: "Error en el servidor proxy", 
            message: error.message
        });
    }
});

// Endpoint para procesar el streaming (Auto-clic y limpieza)
app.get('/api/stream', async (req, res) => {
    const { h } = req.query;
    if (!h) return res.status(400).send("Falta el parámetro h");

    const targetUrl = `https://player.poseidonhd2.co/player.php?h=${h}`;
    const baseUrl = 'https://player.poseidonhd2.co/';

    try {
        const response = await apiClient.get(targetUrl, {
            headers: { 'Referer': 'https://www.poseidonhd2.co/' }
        });

        let html = response.data;

        // Inyectamos el script de auto-clic y señal de finalización
        const autoClickScript = `
        <style>
            #auto-click-marker {
                position: fixed; top: 50%; left: 50%; width: 50px; height: 50px;
                background: rgba(229, 9, 20, 0.3); border: 2px solid #e50914;
                border-radius: 50%; z-index: 999999; pointer-events: none;
                transform: translate(-50%, -50%); display: none;
                animation: pulse 1s infinite alternate;
            }
            @keyframes pulse { from { scale: 0.8; opacity: 0.4; } to { scale: 1.2; opacity: 0.8; } }
        </style>
        <script>
            window.open = function() { return null; };
            document.addEventListener('DOMContentLoaded', () => {
                const marker = document.createElement('div');
                marker.id = 'auto-click-marker';
                document.body.appendChild(marker);

                setTimeout(() => {
                    marker.style.display = 'block';
                    const x = window.innerWidth / 2;
                    const y = window.innerHeight / 2;
                    let attempts = 0;

                    const interval = setInterval(() => {
                        const el = document.elementFromPoint(x, y);
                        if (el) {
                            ['mousedown', 'mouseup', 'click'].forEach(t => {
                                el.dispatchEvent(new MouseEvent(t, { bubbles: true, clientX: x, clientY: y }));
                            });
                        }
                        attempts++;
                        if (attempts > 6) {
                            clearInterval(interval);
                            marker.remove();
                            // ENVIAR SEÑAL A REACT PARA RETIRAR EL TELÓN
                            window.parent.postMessage('autoclick-finished', '*');
                        }
                    }, 500);
                }, 1000);
            });
        </script>`;

        // Inyección del base URL y el script
        html = html.replace('<head>', `<head><base href="${baseUrl}">`);
        if (html.includes('</head>')) {
            html = html.replace('</head>', `${autoClickScript}</head>`);
        } else {
            html += autoClickScript;
        }

        res.send(html);
    } catch (error) {
        console.error("Stream Error:", error.message);
        res.status(500).send("Error cargando el reproductor: " + error.message);
    }
});

// Servir archivos estáticos del frontend React en producción (Render)
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.use((req, res, next) => {
        if (!req.path.startsWith('/api') && req.method === 'GET') {
            return res.sendFile(path.join(distPath, 'index.html'));
        }
        next();
    });
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
