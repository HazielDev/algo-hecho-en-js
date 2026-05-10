<script>
  import { onMount } from 'svelte';
  import AsideMenu from './lib/components/AsideMenu.svelte';
  import Map from './lib/components/Map.svelte';
  import { getPoints } from './services/pointsService';
  import { getPolygons } from './services/polygonsService';
  import { getRoutesLines } from './services/routesLinesService';

  let points = $state([]);
  let polygons = $state([]);
  let routesLines = $state([]);
  let loading = $state(true);

  // State to control where the map is looking
  let mapTarget = $state({
    lat: 21.121128451058443,
    lng: -101.68301558244039,
    zoom: 13,
    timestamp: Date.now() // To force update even if coordinates are same
  });

  function centerMap(lat, lng, zoom = 16) {
    mapTarget = { lat, lng, zoom, timestamp: Date.now() };
  }
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

  onMount(() => {
    fetchAll();
  });
</script>

<main>
  <AsideMenu 
    {points} 
    {polygons} 
    {routesLines} 
    {loading}
    onUpdate={fetchAll}
    onSelect={centerMap}
  />
  <div class="map-section">
    <Map {points} {polygons} {routesLines} target={mapTarget} />
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