<?php
// proxy.php - El guardaespaldas de tu stream para CINEMA+
error_reporting(0);

$isMovie = isset($_GET['h']);
$isTv = isset($_GET['tv']);

if (!$isMovie && !$isTv) {
    die("Error: No se proporcionó un ID de streaming.");
}

if ($isMovie) {
    $targetUrl = "https://player.poseidonhd2.co/player.php?h=" . $_GET['h'];
    $referer = 'https://www.poseidonhd2.co/';
    $baseUrl = 'https://player.poseidonhd2.co/';
} else {
    $targetUrl = "https://la14hd.com/vivo/canales.php?stream=" . $_GET['tv'];
    $referer = 'https://la14hd.com/';
    $baseUrl = 'https://la14hd.com/vivo/';
}

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $targetUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_REFERER, $referer);
curl_setopt($ch, CURLOPT_TIMEOUT, 20);
curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

$html = curl_exec($ch);
curl_close($ch);

if (!$html) {
    die("Error: No se pudo obtener el contenido del stream.");
}

// Inyectamos el Bloqueador y el Auto-Clicker
$adBlocker = "
<style>
    #auto-click-marker {
        position: fixed;
        width: 50px;
        height: 50px;
        background: rgba(56, 189, 248, 0.4);
        border: 3px solid #38bdf8;
        border-radius: 50%;
        z-index: 9999999;
        pointer-events: none;
        transform: translate(-50%, -50%);
        display: none;
        animation: pulse-blue 0.8s infinite alternate;
    }
    @keyframes pulse-blue {
        from { transform: translate(-50%, -50%) scale(0.8); opacity: 0.5; }
        to { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
    }
</style>
<script>
    // Bloqueo de popups agresivo
    window.open = function() { return null; };
    window.onbeforeunload = null;

    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            const marker = document.createElement('div');
            marker.id = 'auto-click-marker';
            document.body.appendChild(marker);

            const x = window.innerWidth / 2;
            const y = window.innerHeight / 2;

            marker.style.left = x + 'px';
            marker.style.top = y + 'px';
            marker.style.display = 'block';

            let attempts = 0;
            const clickInterval = setInterval(() => {
                const el = document.elementFromPoint(x, y);
                if (el) {
                    ['mousedown', 'mouseup', 'click'].forEach(type => {
                        const ev = new MouseEvent(type, {
                            view: window, bubbles: true, cancelable: true, clientX: x, clientY: y
                        });
                        el.dispatchEvent(ev);
                    });
                }
                attempts++;
                if (attempts > 6) {
                    clearInterval(clickInterval);
                    marker.style.opacity = '0';
                    // Avisar al padre (React) que ya terminamos
                    window.parent.postMessage('autoclick-finished', '*');
                    setTimeout(() => marker.remove(), 500);
                }
            }, 500);
        }, 1500); // 1.5 segundos para que cargue el reproductor interno
    });
</script>";

// Ajustamos las rutas base para que carguen los scripts originales del reproductor
$html = str_ireplace('<head>', "<head><base href=\"$baseUrl\">", $html);

if (stripos($html, '</head>') !== false) {
    $html = str_ireplace('</head>', $adBlocker . "</head>", $html);
} else {
    $html .= $adBlocker;
}

echo $html;
?>
