<script lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

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
  let layers: L.LayerGroup = L.layerGroup(); // Grupo de capas para limpiar/dibujar fácilmente

  /**
   * Efecto de inicialización del mapa (Se ejecuta una vez al montar)
   */
  $effect(() => {
    if (!mapContainer) return;

    // Crear la instancia de Leaflet
    mapInstance = L.map(mapContainer).setView(center, zoom);

    // Agregar capa de OpenStreetMap (el mapa base)
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(mapInstance);

    // Inicializar el grupo de capas donde dibujaremos nuestros objetos
    layers.addTo(mapInstance);

    /**
     * Click Normal (Izquierdo):
     * Captura las coordenadas y las manda al componente padre (AsideMenu)
     */
    mapInstance.on('click', (e: any) => {
        const { lat, lng } = e.latlng;
        if (onMapClick) onMapClick(lat, lng);
    });

    /**
     * Funcionalidad de Click Derecho:
     * Muestra un popup con las coordenadas del punto clickeado.
     */
    mapInstance.on('contextmenu', (e: any) => {
      const { lat, lng } = e.latlng;
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`<b>Coordenadas:</b><br>Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}`)
        .openOn(mapInstance);
    });

    // Pequeño delay para asegurar que Leaflet calcule bien el tamaño del contenedor
    setTimeout(() => {
      if (mapInstance) mapInstance.invalidateSize();
    }, 200);

    // Cleanup: Destruir el mapa al desmontar el componente
    return () => {
      if (mapInstance) {
        mapInstance.remove();
        mapInstance = null;
      }
    };
  });

  /**
   * Efecto de Re-centrado reactivo:
   * Cuando el prop 'target' cambia desde el padre, movemos la cámara.
   */
  $effect(() => {
    if (mapInstance && target) {
      mapInstance.setView([target.lat, target.lng], target.zoom, { animate: true });
    }
  });

  /**
   * Efecto de Renderizado de Capas:
   * Se ejecuta cada vez que las listas de datos (points, polygons, etc.) cambian.
   */
  $effect(() => {
    if (!mapInstance) return;
    
    // Limpiar capas anteriores antes de redibujar
    layers.clearLayers();

    // 1. Dibujar Puntos (solo los activos)
    points.filter(p => p.active).forEach(point => {
      L.marker([point.lat, point.lng])
        .bindPopup(`
            <b>${point.name}</b><br>
            ${point.description}<br>
            <hr style="margin: 5px 0">
            <small><b>Lat:</b> ${point.lat.toFixed(5)}<br><b>Lng:</b> ${point.lng.toFixed(5)}</small>
        `)
        .addTo(layers);
    });

    // 2. Dibujar Rutas (Líneas poligonales)
    routesLines.filter(r => r.active).forEach(route => {
      L.polyline(route.coordinates.map(c => [c.lat, c.lng]), { 
        color: '#3b82f6', 
        weight: 5,
        opacity: 0.8
      })
      .bindPopup(`<b>Ruta:</b> ${route.name}`)
      .addTo(layers);
    });

    // 3. Dibujar Polígonos (Áreas cerradas)
    polygons.filter(p => p.active).forEach(poly => {
      L.polygon(poly.coordinates.map(c => [c.lat, c.lng]), { 
        color: '#ef4444', 
        fillColor: '#ef4444', 
        fillOpacity: 0.3,
        weight: 2
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
    background: #f1f5f9; /* Color de fondo mientras cargan los tiles */
  }

  /* Estilos para los popups de Leaflet */
  :global(.leaflet-popup-content-wrapper) {
    border-radius: 12px;
    padding: 5px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  }

  :global(.leaflet-popup-content) {
    font-family: 'Inter', sans-serif;
    font-size: 13px;
    line-height: 1.5;
  }
</style>
