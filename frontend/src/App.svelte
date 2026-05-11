<script>
  /**
   * App.svelte: Componente raíz de la aplicación.
   * Se encarga de la comunicación principal entre el backend y los componentes del mapa y el menú.
   */
  import { onMount } from 'svelte';
  import AsideMenu from './lib/components/AsideMenu.svelte';
  import Map from './lib/components/Map.svelte';
  
  // Servicios para llamadas a la API REST
  import { getPoints } from './services/pointsService';
  import { getPolygons } from './services/polygonsService';
  import { getRoutesLines } from './services/routesLinesService';

  // ESTADOS REACTIVOS (Svelte 5 Runes)
  let points = $state([]);         // Almacena todos los puntos cargados
  let polygons = $state([]);       // Almacena todos los polígonos cargados
  let routesLines = $state([]);    // Almacena todas las rutas cargadas
  let loading = $state(true);      // Controla el estado de carga inicial
  
  // Estado para capturar datos desde el mapa y pasarlos al formulario lateral
  let lastClickedCoords = $state(null);
  let lastDrawnPath = $state(null);

  // Control de la cámara del mapa (donde está mirando el usuario)
  let mapTarget = $state({
    lat: 21.121128451058443,
    lng: -101.68301558244039,
    zoom: 13,
    timestamp: Date.now() // Forzamos actualización incluso si las coordenadas son iguales
  });

  // Estado para la visibilidad del menú lateral
  let isAsideOpen = $state(true);

  /**
   * Maneja el click simple en el mapa para capturar una sola coordenada
   */
  function handleMapClick(lat, lng) {
    lastClickedCoords = { lat, lng, timestamp: Date.now() };
  }

  /**
   * Maneja el dibujo libre (Modo Lápiz) para capturar una ruta completa
   */
  function handleFreehandDraw(path) {
    lastDrawnPath = { coordinates: path, timestamp: Date.now() };
  }

  /**
   * Abre el modal premium y cierra el menú lateral
   */
  function handlePremiumAction() {
    isAsideOpen = false;
  }

  /**
   * Centra la cámara del mapa en un elemento específico (usado al seleccionar de la lista)
   */
  function centerMap(item) {
    mapTarget = { 
      ...item, 
      timestamp: Date.now() 
    };
  }
  /**
   * Obtiene todos los datos desde el servidor simultáneamente
   */
  async function fetchAll() {
    loading = true;
    try {
      const [p, poly, routes] = await Promise.all([
        getPoints(),
        getPolygons(),
        getRoutesLines()
      ]);
      points = p;
      polygons = poly;
      routesLines = routes;
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      loading = false;
    }
  }

  // Ejecución inicial al montar la aplicación
  onMount(() => {
    fetchAll();
  });
</script>

<main>
  <!-- Menú Lateral: Contiene los formularios y las listas de items -->
  <AsideMenu 
    bind:open={isAsideOpen}
    {points} 
    {polygons} 
    {routesLines} 
    {loading}
    mapCoords={lastClickedCoords}
    drawnPath={lastDrawnPath}
    onUpdate={fetchAll}
    onSelect={centerMap}
  />

  <!-- Sección del Mapa: El componente visual de Leaflet -->
  <div class="map-section">
    <Map 
      {points} 
      {polygons} 
      {routesLines} 
      target={mapTarget} 
      onMapClick={handleMapClick}
      onFreehandDraw={handleFreehandDraw}
      onPremiumOpen={handlePremiumAction}
    />
  </div>
</main>

<style>
  :global(body) {
    margin: 0;
    padding: 0;
    font-family: 'Inter', system-ui, -apple-system, sans-serif;
    background: #0f172a;
  }

  main {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    box-sizing: border-box;
    overflow: hidden;
  }

  .map-section {
    width: 100%;
    height: 100dvh;
  }
</style>