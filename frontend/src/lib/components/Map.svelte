<script lang="ts">
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  /** @type {{ center?: [number, number], zoom?: number }} */
  let { center = [20.6597, -103.3496], zoom = 13 } = $props();

  let mapContainer: any;
  let mapInstance: any = null;

  $effect(() => {
    if (!mapContainer) return;

    mapInstance = L.map(mapContainer).setView(center, zoom);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(mapInstance);

    // Fix tile rendering after mount
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
</script>

<div class="map-wrapper">
  <div class="map-container" bind:this={mapContainer}></div>
</div>

<style>
  .map-wrapper {
    position: relative;
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
  }
</style>
