<script lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  // IMPORTACIÓN DE CLUSTERING (TEMA NUEVO)
  import 'leaflet.markercluster';
  import 'leaflet.markercluster/dist/MarkerCluster.css';
  import 'leaflet.markercluster/dist/MarkerCluster.Default.css';

  /**
   * Props recibidas:
   * - center: Coordenadas iniciales [lat, lng]
   * - zoom: Nivel de zoom inicial
   * - points, polygons, routesLines: Listas de elementos a dibujar
   * - target: Objeto {lat, lng, zoom} usado para re-centrar el mapa desde el menú
   * - onMapClick: Función callback que se activa al hacer click en el mapa
   */
  let { 
    center = [21.121128451058443, -101.68301558244039], 
    zoom = 13,
    points = [],
    polygons = [],
    routesLines = [],
    target = null,
    onMapClick
  } = $props();

  let mapContainer: any;
  let mapInstance: any = null;
  let layers: L.LayerGroup = L.layerGroup(); 
  
  // Grupo para el agrupamiento de marcadores (Clustering)
  let markerClusterGroup: any = null;

  /**
   * TEMA NUEVO: ICONOS PERSONALIZADOS (L.divIcon)
   */
  const customMarkerIcon = L.divIcon({
    html: `
      <div class="custom-pin">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-icon lucide-circle"><circle cx="12" cy="12" r="10"/></svg>
      </div>
    `,
    className: 'custom-div-icon', 
    iconSize: [32, 32],           
    iconAnchor: [16, 32],         
    popupAnchor: [0, -32]         
  });

  /**
   * Efecto de inicialización del mapa (Se ejecuta una vez al montar)
   */
  $effect(() => {
    if (!mapContainer) return;

    mapInstance = L.map(mapContainer).setView(center, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    // Inicializamos el grupo de clusters
    markerClusterGroup = (L as any).markerClusterGroup({
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true
    });
    mapInstance.addLayer(markerClusterGroup);

    layers.addTo(mapInstance);

    // Captura de clicks para el formulario
    mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (onMapClick) onMapClick(lat, lng);
    });

    // Click derecho para info rápida
    mapInstance.on('contextmenu', (e: any) => {
      const { lat, lng } = e.latlng;
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<b>Coordenadas:</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
        .openOn(mapInstance);
    });

    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);

    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  });

  /**
   * Efecto de Re-centrado reactivo
   */
  $effect(() => {
    if (mapInstance && target) {
      mapInstance.setView([target.lat, target.lng], target.zoom, { animate: true });
    }
  });

  /**
   * Efecto de Renderizado de Capas
   */
  $effect(() => {
    if (!mapInstance || !markerClusterGroup) return;
    
    // Limpiar tanto el grupo de capas normales como el de clusters
    layers.clearLayers();
    markerClusterGroup.clearLayers();

    // 1. Dibujar Puntos (Usando el CLUSTERING)
    points.filter(p => p.active).forEach(point => {
      const marker = L.marker([point.lat, point.lng], { icon: customMarkerIcon })
        .bindPopup(`
            <div class="popup-content">
              <strong>${point.name}</strong>
              <p>${point.description}</p>
              <div class="popup-coords">
                ${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}
              </div>
            </div>
        `);
      
      // Agregamos el marcador al grupo de CLUSTERS en lugar de directamente al mapa
      markerClusterGroup.addLayer(marker);
    });

    // 2. Dibujar Rutas
    routesLines.filter(r => r.active).forEach(route => {
      L.polyline(route.coordinates.map(c => [c.lat, c.lng]), { 
        color: '#3b82f6', 
        weight: 6,
        opacity: 0.7,
        lineJoin: 'round'
      })
      .bindPopup(`<b>Ruta:</b> ${route.name}`)
      .addTo(layers);
    });

    // 3. Dibujar Polígonos
    polygons.filter(p => p.active).forEach(poly => {
      L.polygon(poly.coordinates.map(c => [c.lat, c.lng]), { 
        color: '#f43f5e', 
        fillColor: '#f43f5e', 
        fillOpacity: 0.2,
        weight: 3
      })
      .bindPopup(`<b>Polígono:</b> ${poly.name}`)
      .addTo(layers);
    });
  });
</script>

<!-- Contenedor del mapa -->
<div class="map-wrapper">
  <div bind:this={mapContainer} class="map-container"></div>
</div>

<style>
  .map-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  }

  .map-container {
    width: 100%;
    height: 100%;
    min-height: 400px;
    z-index: 1;
    background: #f1f5f9;
  }

  /**
   * ESTILOS PARA EL ÍCONO PERSONALIZADO
   */
  :global(.custom-pin) {
    background: #3b82f6; 
    width: 32px;
    height: 32px;
    border-radius: 50% 50% 50% 0; 
    transform: rotate(-45deg);    
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;                 
    border: 2px solid white;      
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    transition: all 0.2s;
  }

  :global(.custom-pin svg) {
    transform: rotate(45deg); 
  }

  :global(.custom-pin:hover) {
    background: #1d4ed8;
    transform: rotate(-45deg) scale(1.1); 
  }

  /* Estilos mejorados para los popups */
  :global(.popup-content) {
    padding: 5px;
    min-width: 120px;
  }

  :global(.popup-content strong) {
    display: block;
    font-size: 14px;
    color: #1e293b;
    margin-bottom: 4px;
  }

  :global(.popup-content p) {
    margin: 0;
    color: #64748b;
    font-size: 12px;
  }

  :global(.popup-coords) {
    margin-top: 8px;
    padding-top: 8px;
    border-top: 1px solid #e2e8f0;
    font-family: monospace;
    font-size: 11px;
    color: #94a3b8;
  }

  :global(.leaflet-popup-content-wrapper) {
    border-radius: 12px;
    padding: 0;
    overflow: hidden;
  }
</style>
