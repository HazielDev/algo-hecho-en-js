<script>
    import { List } from 'lucide-svelte';
    import SavedItem from './SavedItem.svelte';

    /**
     * Props:
     * - items: La lista completa de registros (puntos, rutas o polígonos)
     * - activeTab: Pestaña actual
     * - loading: Estado de carga
     * - onSelect: Función al hacer click en un item
     * - onDelete: Función al borrar un item
     * - onEdit: Función para editar un item
     */
    let { items = [], activeTab, loading = false, onSelect, onDelete, onEdit } = $props();
</script>

<section class="list-section">
    <!-- Encabezado de la sección -->
    <div class="section-header">
        <List size={20} />
        <h2>Registros Guardados</h2>
    </div>

    <!-- Contenedor de la lista dinámica -->
    <div class="mock-list">
        {#if loading}
            <p class="status-text">Cargando datos del servidor...</p>
        {:else if items.length === 0}
            <p class="status-text">No hay registros guardados aún.</p>
        {:else}
            {#each items as item (item.id)}
                <SavedItem 
                    {item} 
                    {activeTab} 
                    {onSelect} 
                    {onDelete} 
                    {onEdit}
                />
            {/each}
        {/if}
    </div>
</section>

<style>
  .list-section {
    margin-top: 20px;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 15px;
    color: #1e293b;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    margin: 0;
  }

  .mock-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .status-text {
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
    padding: 30px 10px;
    background: #f8fafc;
    border-radius: 12px;
    border: 1px dashed #e2e8f0;
  }
</style>
