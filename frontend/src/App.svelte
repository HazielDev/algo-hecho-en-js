<script>
  import AsideMenu from './lib/components/AsideMenu.svelte';
  import Map from './lib/components/Map.svelte';
</script>

<main>
  <AsideMenu />
  <div class="map-section">
    <Map />
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