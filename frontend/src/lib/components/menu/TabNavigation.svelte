<script>
    import { MapPinIcon, Navigation, Shapes } from 'lucide-svelte';

    /**
     * Props:
     * - activeTab: Pestaña actualmente seleccionada
     * - onTabChange: Función para cambiar la pestaña activa
     */
    let { activeTab = $bindable(), onTabChange } = $props();

    /**
     * Define las pestañas disponibles con sus íconos y etiquetas
     */
    const tabs = [
        { id: 'points', label: 'Puntos', icon: MapPinIcon },
        { id: 'routes', label: 'Rutas', icon: Navigation },
        { id: 'polygons', label: 'Polígonos', icon: Shapes }
    ];

    function handleTabClick(tabId) {
        activeTab = tabId;
        if (onTabChange) onTabChange(tabId);
    }
</script>

<nav class="tabs">
    {#each tabs as tab}
        <button 
            class:active={activeTab === tab.id} 
            onclick={() => handleTabClick(tab.id)}
        >
            <tab.icon size={18} />
            {tab.label}
        </button>
    {/each}
</nav>

<style>
  .tabs {
    display: flex;
    padding: 0 15px;
    gap: 5px;
    border-bottom: 1px solid #e2e8f0;
    background: #f8fafc;
  }

  .tabs button {
    flex: 1;
    padding: 15px 5px;
    border: none;
    background: none;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .tabs button:hover {
    color: #1e293b;
    background: rgba(0,0,0,0.02);
  }

  .tabs button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }
</style>
