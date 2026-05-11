<script lang="ts">
  /**
   * Map.svelte: El corazón visual de la aplicación.
   * Integra Leaflet.js para renderizar el mapa, manejar el dibujo libre, 
   * el modo oscuro, el clustering y la geolocalización.
   */
  import L from 'leaflet';
  import { LocateFixed, Moon, Sun, Pencil, Globe, X } from 'lucide-svelte';
  import 'leaflet/dist/leaflet.css';
  import 'leaflet.markercluster';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

  // PROPS
  let { 
    center = [21.121128451058443, -101.68301558244039], 
    zoom = 13,
    points = [],
    polygons = [],
    routesLines = [],
    target = null,       // Punto específico para centrar el mapa (desde la lista)
    onMapClick,          // Callback para enviar coordenadas simples al padre
    onFreehandDraw,      // Callback para enviar trazos del modo lápiz
    onPremiumOpen        // Callback para cerrar menús externos al abrir premium
  } = $props();

  // REFERENCIAS Y CAPAS DE LEAFLET
  let mapContainer: any;
  let mapInstance: any = null;
  let layers: L.LayerGroup = L.layerGroup(); 
  let markerClusterGroup: any = null;
  let userLocationLayer: L.LayerGroup = L.layerGroup(); 
  let drawingLayer: L.LayerGroup = L.layerGroup(); 

  // ESTADOS DE INTERFAZ DEL MAPA
  let isPencilMode = $state(false);      // ¿Está activo el modo dibujo?
  let isDrawing = false;                 // ¿El usuario está arrastrando el mouse actualmente?
  let drawingPoints: any[] = [];         // Puntos acumulados durante el dibujo libre
  let tempPolyline: L.Polyline | null = null; // Línea visual temporal del dibujo
  let isDarkMode = $state(false);        // ¿Está activo el modo noche?
  let showPremiumModal = $state(false);  // Control del modal de broma

  /**
   * DICCIONARIOS DE ESTILO (Sincronizados con el backend)
   */
  const categoryColors: any = {
    'hogar': '#ff4757',
    'comercio': '#ffa502',
    'educacion': '#6c5ce7',
    'deporte': '#ef4444',
    'parque': '#2ed573',
    'otro': '#94a3b8',
    'general': '#747d8c'
  };

  const categoryLabels: any = {
    'hogar': 'Hogar',
    'comercio': 'Comercio',
    'educacion': 'Educación',
    'deporte': 'Deportivo',
    'parque': 'Parque',
    'otro': 'Otro',
    'general': 'General'
  };

  /**
   * EFECTO: Inicialización del mapa Leaflet
   */
  $effect(() => {
    if (mapContainer && !mapInstance) {
      mapInstance = L.map(mapContainer).setView(center, zoom);
      
      // Capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance);

      markerClusterGroup = (L as any).markerClusterGroup();
      mapInstance.addLayer(markerClusterGroup);
      layers.addTo(mapInstance);
      userLocationLayer.addTo(mapInstance);
      drawingLayer.addTo(mapInstance);

      /**
       * EVENTOS DE MOUSE PARA DIBUJO LIBRE
       */
      mapInstance.on('mousedown', (e: any) => {
        if (!isPencilMode) return;
        isDrawing = true;
        drawingPoints = [{ lat: e.latlng.lat, lng: e.latlng.lng }];
        mapInstance.dragging.disable(); // Bloquear arrastre para poder dibujar
        if (tempPolyline) drawingLayer.removeLayer(tempPolyline);
        tempPolyline = L.polyline(drawingPoints, { color: '#3b82f6', weight: 4, dashArray: '5, 10' }).addTo(drawingLayer);
      });

      mapInstance.on('mousemove', (e: any) => {
        if (!isPencilMode || !isDrawing) return;
        const newPoint = { lat: e.latlng.lat, lng: e.latlng.lng };
        drawingPoints.push(newPoint);
        if (tempPolyline) tempPolyline.setLatLngs(drawingPoints.map(p => [p.lat, p.lng]));
      });

      mapInstance.on('mouseup', () => {
        if (!isPencilMode || !isDrawing) return;
        isDrawing = false;
        mapInstance.dragging.enable();
        if (drawingPoints.length > 2 && onFreehandDraw) onFreehandDraw(drawingPoints);
        setTimeout(() => { drawingLayer.clearLayers(); tempPolyline = null; }, 500);
      });

      // Evento de click normal para capturar un solo punto
      mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (onMapClick) onMapClick(lat, lng);
      });

      // Evento de click derecho: Popup informativo de coordenadas
      mapInstance.on('contextmenu', (e: any) => {
        const { lat, lng } = e.latlng;
        L.popup()
          .setLatLng([lat, lng])
          .setContent(`
            <div style="text-align: center; font-family: sans-serif;">
              <b style="color: #3b82f6;">Coordenadas</b><br/>
              <span style="font-size: 11px; color: #64748b;">${lat.toFixed(6)}, ${lng.toFixed(6)}</span>
            </div>
          `)
          .openOn(mapInstance);
      });
    }
  });

  /**
   * Función para geolocalizar al usuario real
   */
  function locateUser() {
    if (!navigator.geolocation) return alert('No soportado');
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      mapInstance.flyTo([latitude, longitude], 17);
      userLocationLayer.clearLayers();
      const pulseIcon = L.divIcon({
        html: '<div class="user-location-pulse"></div>',
        className: 'user-location-icon', iconSize: [20, 20], iconAnchor: [10, 10]
      });
      L.marker([latitude, longitude], { icon: pulseIcon }).bindPopup('<b>Estás aquí</b>').addTo(userLocationLayer);
      if (onMapClick) onMapClick(latitude, longitude);
    });
  }

  /**
   * Cálculo de distancias para las etiquetas de las rutas
   */
  function calculateDistance(coords: any[]) {
    if (coords.length < 2) return '';
    let totalDist = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      totalDist += L.latLng(coords[i].lat, coords[i].lng).distanceTo(L.latLng(coords[i + 1].lat, coords[i + 1].lng));
    }
    return totalDist > 1000 ? (totalDist / 1000).toFixed(2) + ' km' : Math.round(totalDist) + ' m';
  }

  /**
   * EFECTO: Renderizado dinámico de elementos al cambiar los datos
   */
  $effect(() => {
    if (mapInstance && markerClusterGroup) {
      markerClusterGroup.clearLayers();
      layers.clearLayers();
      // Dibujar Puntos con Clustering
      points.filter(p => p.active !== false).forEach((p: any) => {
        const color = categoryColors[p.category] || categoryColors.general;
        const icon = L.divIcon({
          html: `
            <div class="marker-pin-container">
              <div class="marker-pin" style="background-color: ${color};"></div>
              <div class="marker-icon-inner">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>
              </div>
            </div>
          `,
          className: 'custom-div-icon', iconSize: [30, 30], iconAnchor: [15, 30]
        });
        L.marker([p.lat, p.lng], { icon })
          .bindPopup(`
            <div class="popup-content">
              <div class="popup-header">
                <h3>${p.name}</h3>
                <span class="category-badge" style="background: ${color}">${categoryLabels[p.category] || 'General'}</span>
              </div>
              <div class="popup-body">
                <p>${p.description || 'Sin descripción'}</p>
              </div>
            </div>
          `)
          .addTo(markerClusterGroup);
      });

      // Dibujar Rutas
      routesLines.filter(r => r.active !== false).forEach((r: any) => {
        const distLabel = calculateDistance(r.coordinates);
        L.polyline(r.coordinates.map((c: any) => [c.lat, c.lng]), { color: '#3b82f6', weight: 4, opacity: 0.8 })
          .bindPopup(`
            <div class="popup-content">
              <div class="popup-header">
                <h3>${r.name}</h3>
                <span class="category-badge" style="background: #3b82f6">Ruta</span>
              </div>
              <div class="popup-body">
                <p><strong>Distancia:</strong> ${distLabel}</p>
              </div>
            </div>
          `)
          .addTo(layers);
      });

      // Dibujar Polígonos
      polygons.filter(poly => poly.active !== false).forEach((poly: any) => {
        const color = categoryColors[poly.category] || categoryColors.general;
        L.polygon(poly.coordinates.map((c: any) => [c.lat, c.lng]), { fillColor: color, fillOpacity: 0.3, color: color, weight: 2 })
          .bindPopup(`
            <div class="popup-content">
              <div class="popup-header">
                <h3>${poly.name}</h3>
                <span class="category-badge" style="background: ${color}">${categoryLabels[poly.category] || 'General'}</span>
              </div>
              <div class="popup-body">
                <p>Área delimitada de interés.</p>
              </div>
            </div>
          `)
          .addTo(layers);
      });
    }
  });

  /**
   * EFECTO: Centrar mapa cuando se recibe un target (click en lista)
   */
  $effect(() => {
    if (mapInstance && target) {
      if (target.lat && target.lng) {
        mapInstance.flyTo([target.lat, target.lng], target.zoom || 16);
      } else if (target.coordinates && target.coordinates.length > 0) {
        const bounds = L.latLngBounds(target.coordinates.map((c: any) => [c.lat, c.lng]));
        mapInstance.fitBounds(bounds, { padding: [50, 50], duration: 1 });
      }
    }
  });
</script>

<div class="map-wrapper" class:dark-mode={isDarkMode}>
  <div bind:this={mapContainer} class="map-container"></div>
  
  <!-- Controles flotantes -->
  <div class="map-controls">
    <button class="control-btn premium-btn" onclick={() => { showPremiumModal = true; if(onPremiumOpen) onPremiumOpen(); }} title="Vista Satelital (Premium)">
      <Globe size={20} />
    </button>
    <button class="control-btn" onclick={() => isDarkMode = !isDarkMode} title="Cambiar tema">
      {#if isDarkMode} <Sun size={20} /> {:else} <Moon size={20} /> {/if}
    </button>
    <button class="control-btn" class:active={isPencilMode} onclick={() => isPencilMode = !isPencilMode} title="Modo Lápiz">
      <Pencil size={20} />
    </button>
    <button class="control-btn" onclick={locateUser} title="Mi ubicación">
      <LocateFixed size={20} />
    </button>
  </div>

  <!-- Modal Premium -->
  {#if showPremiumModal}
    <div class="premium-overlay">
      <div class="premium-modal">
        <button class="close-modal" onclick={() => showPremiumModal = false} aria-label="Cerrar modal"><X size={20} /></button>
        
        <div class="gold-badge">GOLD</div>
        <h2>GeoManager <span class="gold-text">Premium</span></h2>
        <p class="premium-subtitle">Desbloquea la potencia máxima de visualización</p>

        <div class="premium-features">
          <div class="feature-item">
            <Globe size={16} />
            <span>Mapas Satelitales HD (Resolución 4K)</span>
          </div>
          <div class="feature-item">
            <div class="hexagon-icon">⬢</div>
            <span>Capas de Tráfico en Tiempo Real</span>
          </div>
        </div>

        <div class="card-form">
          <div class="input-group-premium">
            <label for="card-num">NÚMERO DE TARJETA</label>
            <input id="card-num" type="text" placeholder="0000 0000 0000 0000" />
          </div>
          <div class="card-row-premium">
            <div class="input-group-premium">
              <label for="card-exp">VENCIMIENTO</label>
              <input id="card-exp" type="text" placeholder="MM/YY" />
            </div>
            <div class="input-group-premium">
              <label for="card-cvv">CVV</label>
              <input id="card-cvv" type="text" placeholder="***" />
            </div>
          </div>
        </div>

        <button class="btn-activate" onclick={() => alert('¡Suscripción Activada! (Demo)')}>
          Activar Suscripción - $9.99/mes
        </button>
        <p class="terms-text">Al activar, aceptas los términos de GeoManager Pro.</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .map-wrapper { position: relative; width: 100%; height: 100%; }
  .map-container { width: 100%; height: 100%; background: #f8fafc; }
  .map-controls { position: absolute; bottom: 25px; left: 25px; z-index: 1000; display: flex; flex-direction: column; gap: 10px; }
  .control-btn { background: white; border: none; width: 45px; height: 45px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #475569; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.15); transition: all 0.2s; }
  .control-btn:hover { transform: scale(1.1); color: #3b82f6; }
  .control-btn.active { background: #3b82f6; color: white; }
  
  .dark-mode :global(.leaflet-tile-pane) { filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%); }
  .dark-mode :global(.leaflet-marker-icon), .dark-mode :global(.leaflet-popup-content-wrapper) { filter: invert(100%) hue-rotate(-180deg); }
  
  /* Pin Marker Styles */
  :global(.marker-pin-container) { position: relative; width: 30px; height: 30px; transition: all 0.2s; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  :global(.marker-pin-container:hover) { transform: scale(1.15) translateY(-5px); z-index: 1000; }
  :global(.marker-pin) { 
    width: 30px; height: 30px; border-radius: 50% 50% 50% 0; 
    position: absolute; transform: rotate(-45deg); 
    box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    border: 2px solid white;
    background-image: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.2), transparent);
  }
  :global(.marker-icon-inner) { 
    position: relative; 
    z-index: 10; 
    display: flex; align-items: center; justify-content: center; 
    pointer-events: none;
    width: 14px; height: 14px;
  }

  /* Popup Design */
  :global(.leaflet-popup-content-wrapper) { border-radius: 16px; padding: 0; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.2); border: none; }
  :global(.leaflet-popup-content) { margin: 0; width: 220px !important; }
  :global(.popup-content) { font-family: 'Inter', sans-serif; }
  :global(.popup-header) { background: #f8fafc; padding: 15px; border-bottom: 1px solid #f1f5f9; }
  :global(.popup-header h3) { margin: 0 0 8px 0; font-size: 16px; font-weight: 800; color: #1e293b; letter-spacing: -0.5px; }
  :global(.category-badge) { font-size: 10px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; color: white; display: inline-block; }
  :global(.popup-body) { padding: 15px; background: white; }
  :global(.popup-body p) { margin: 0; font-size: 13px; color: #475569; line-height: 1.5; }

  .premium-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(15, 23, 42, 0.8); backdrop-filter: blur(12px); z-index: 1100; display: flex; align-items: center; justify-content: center; animation: fade-in 0.3s ease-out; }
  .premium-modal { background: #0f172a; width: 420px; border-radius: 32px; padding: 40px; position: relative; color: white; text-align: center; border: 1px solid rgba(251, 191, 36, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
  .close-modal { position: absolute; top: 20px; right: 20px; background: none; border: none; color: #94a3b8; cursor: pointer; }
  
  .gold-badge { background: #fbbf24; color: #78350f; font-size: 10px; font-weight: 900; padding: 4px 12px; border-radius: 20px; display: inline-block; margin-bottom: 15px; }
  h2 { font-size: 28px; margin: 0; letter-spacing: -1px; }
  .gold-text { color: #fbbf24; }
  .premium-subtitle { color: #94a3b8; font-size: 14px; margin: 10px 0 30px; }

  .premium-features { background: rgba(255, 255, 255, 0.05); border-radius: 20px; padding: 20px; display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
  .feature-item { display: flex; align-items: center; gap: 12px; font-size: 13px; color: #e2e8f0; text-align: left; }
  .hexagon-icon { color: #fbbf24; font-size: 18px; }

  .card-form { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
  .input-group-premium { display: flex; flex-direction: column; gap: 8px; text-align: left; flex: 1; }
  .input-group-premium label { font-size: 10px; font-weight: 800; color: #64748b; letter-spacing: 1px; }
  .input-group-premium input { background: #1e293b; border: 1px solid #334155; padding: 14px; border-radius: 12px; color: white; font-size: 14px; width: 100%; box-sizing: border-box; }
  .card-row-premium { display: flex; gap: 15px; }

  .btn-activate { width: 100%; background: #fbbf24; color: #78350f; border: none; padding: 18px; border-radius: 14px; font-size: 16px; font-weight: 800; cursor: pointer; transition: all 0.2s; }
  .btn-activate:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(251, 191, 36, 0.3); }
  .terms-text { font-size: 10px; color: #475569; margin-top: 15px; }

  @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
</style>


