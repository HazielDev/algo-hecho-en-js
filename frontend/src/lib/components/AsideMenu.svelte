<script>
    import { MapPinIcon, Menu, XIcon } from 'lucide-svelte';
    
    // Importación de componentes locales (Refactorización)
    import TabNavigation from './menu/TabNavigation.svelte';
    import CreateForm from './menu/CreateForm.svelte';
    import SavedItemsList from './menu/SavedItemsList.svelte';

    // Importación de servicios para interactuar con el backend
    import { createPoint, deletePoint, updatePoint } from '../../services/pointsService';
    import { createPolygon, deletePolygon, updatePolygon } from '../../services/polygonsService';
    import { createRouteLine, deleteRouteLine, updateRouteLine } from '../../services/routesLinesService';

    /**
     * Props recibidas desde App.svelte:
     * - open: Estado del menú (abierto/cerrado)
     * - points, polygons, routesLines: Datos traídos del backend
     * - loading: Indica si el backend está respondiendo
     * - onUpdate: Función para refrescar los datos generales
     * - onSelect: Función para centrar el mapa en un punto
     */
    let { 
        open = $bindable(true), 
        points = [], 
        polygons = [], 
        routesLines = [], 
        loading = false,
        mapCoords = null,
        onUpdate,
        onSelect
    } = $props();

    // Estado reactivo para controlar qué pestaña está activa
    let activeTab = $state('points'); 
    
    // Estado para saber si estamos editando un elemento existente
    let editingItem = $state(null);

    /**
     * Maneja el guardado de nuevos registros o actualización de existentes.
     * Esta función se pasa al componente 'CreateForm'.
     */
    async function handleSave(data, coordinatesLength) {
        try {
            if (editingItem) {
                // Modo EDICIÓN (PATCH)
                if (activeTab === 'points') await updatePoint(editingItem.id, data);
                else if (activeTab === 'routes') await updateRouteLine(editingItem.id, data);
                else if (activeTab === 'polygons') await updatePolygon(editingItem.id, data);
                alert('¡Actualizado con éxito!');
            } else {
                // Modo CREACIÓN (POST)
                if (activeTab === 'points') {
                    await createPoint(data);
                } else if (activeTab === 'routes') {
                    if (coordinatesLength < 2) return alert('Una ruta ocupa mínimo 2 puntos');
                    await createRouteLine(data);
                } else if (activeTab === 'polygons') {
                    if (coordinatesLength < 3) return alert('Un polígono ocupa mínimo 3 puntos para que cierre');
                    await createPolygon(data);
                }
                alert('¡Guardado con éxito!');
            }
            
            // Limpia el estado de edición y refresca la lista
            editingItem = null;
            if (onUpdate) await onUpdate();
            return true; 
        } catch (error) {
            alert('Error al procesar: ' + error.message);
            return false;
        }
    }

    /**
     * Inicia el modo de edición para un elemento.
     */
    function handleEditItem(item) {
        editingItem = item;
    }

    /**
     * Maneja la eliminación de registros.
     * Esta función se pasa al componente 'SavedItemsList'.
     */
    async function handleDelete(id) {
        if (!confirm('¿Seguro que lo quieres borrar?')) return;
        
        try {
            if (activeTab === 'points') await deletePoint(id);
            else if (activeTab === 'routes') await deleteRouteLine(id);
            else if (activeTab === 'polygons') await deletePolygon(id);
            
            // Refresca la lista global
            if (onUpdate) await onUpdate();
        } catch (error) {
            alert('No se pudo borrar: ' + error.message);
        }
    }

    /**
     * Maneja la selección de un registro para centrar el mapa.
     */
    function handleSelectItem(item) {
        if (!onSelect) return;
        
        if (activeTab === 'points') {
            onSelect(item.lat, item.lng);
        } else {
            // Para rutas y polígonos, centramos en la primera coordenada disponible
            const first = item.coordinates[0];
            if (first) onSelect(first.lat, first.lng);
        }
    }

    /**
     * Obtiene la lista de items que corresponde a la pestaña activa
     */
    const currentItems = $derived(
        activeTab === 'points' ? points : 
        activeTab === 'routes' ? routesLines : 
        polygons
    );
</script>

{#if open}
    <!-- Menú Lateral -->
    <aside>
        <!-- Botón para cerrar el menú -->
        <button class="btn-close" onclick={()=>{open=false;}} title="Cerrar menú">
            <XIcon />
        </button>
        
        <!-- Logotipo y Nombre -->
        <div class="brand">
            <MapPinIcon class="brand-icon" />
            <h1>GeoManager</h1>
        </div>

        <!-- Navegación por pestañas (Puntos, Rutas, Polígonos) -->
        <TabNavigation bind:activeTab onTabChange={() => editingItem = null} />

        <!-- Area de contenido con scroll -->
        <div class="content-scroll">
            <!-- Formulario para crear o EDITAR registros -->
            <CreateForm 
                {activeTab} 
                onSubmit={handleSave}
                {editingItem}
                {mapCoords}
            />

            <!-- Lista de registros guardados -->
            <SavedItemsList 
                items={currentItems} 
                {activeTab} 
                {loading} 
                onSelect={handleSelectItem} 
                onDelete={handleDelete}
                onEdit={handleEditItem}
            />
        </div>
    </aside>
{:else}
    <!-- Botón flotante para reabrir el menú si está cerrado -->
    <button class="btn-open" onclick={()=>{open=true;}} title="Abrir GeoManager">
        <Menu />
    </button>
{/if}

<style>
  aside {
    position: absolute;
    top: 10px;
    right: 10px;
    bottom: 10px;
    width: 420px;
    z-index: 9999;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    box-shadow: -10px 0 30px rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    animation: slide-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .brand {
    padding: 30px 20px 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  :global(.brand-icon) {
    color: #ef4444;
    filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3));
  }

  h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0;
    color: #1e293b;
    letter-spacing: -0.5px;
  }

  .tabs {
    display: flex;
    padding: 0 15px;
    gap: 5px;
    border-bottom: 1px solid #e2e8f0;
  }

  .tabs button {
    flex: 1;
    padding: 12px 5px;
    border: none;
    background: none;
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    border-bottom: 3px solid transparent;
    transition: all 0.2s;
  }

  .tabs button.active {
    color: #3b82f6;
    border-bottom-color: #3b82f6;
  }

  .content-scroll {
    flex: 1;
    overflow-y: auto;
    padding: 20px;
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

  .mock-form {
    background: #f8fafc;
    padding: 15px;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-bottom: 30px;
    border: 1px solid #e2e8f0;
  }

   input, textarea {
    padding: 10px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 14px;
    background: white;
    width: 100%;
    box-sizing: border-box;
  }

  .coords-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

   .input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
    min-width: 0;
  }

  .input-group label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    padding-left: 4px;
  }

  .btn-add-circle {
    background: #3b82f6;
    color: white;
    border: none;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .btn-add-circle:hover {
    background: #2563eb;
    transform: scale(1.05);
  }

  .coords-list {
    margin-top: 10px;
    max-height: 120px;
    overflow-y: auto;
    padding-right: 5px;
  }

  .btn-submit {
    background: #1e293b;
    color: white;
    border: none;
    padding: 12px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 5px;
  }

  .search-box {
    position: relative;
    margin-bottom: 15px;
  }

  .search-box :global(svg) {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
  }

  .search-box input {
    width: 100%;
    padding-left: 35px;
    background: #f1f5f9;
    border: none;
    box-sizing: border-box;
  }

  .mock-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .list-item {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background 0.2s;
    cursor: pointer;
  }

  .list-item:hover {
    background: #f8fafc;
  }

  .item-info {
    display: flex;
    flex-direction: column;
  }

  .item-info strong {
    font-size: 14px;
    color: #1e293b;
  }

  .item-info span {
    font-size: 11px;
    color: #94a3b8;
  }

  .list-item.inactive {
    opacity: 0.5;
    background: #f1f5f9;
  }

  .loading-text, .empty-text {
    text-align: center;
    color: #94a3b8;
    font-size: 14px;
    padding: 20px;
  }

  .btn-remove-coord {
    background: none;
    border: none;
    color: #ef4444;
    cursor: pointer;
    font-weight: bold;
    margin-left: 5px;
    padding: 0 4px;
  }

  .item-actions button {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;
  }

  .item-actions button:hover {
    background: #fee2e2;
    color: #ef4444;
  }

  .btn-close {
    position: absolute;
    right: 15px;
    top: 15px;
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
  }

  .btn-open {
    position: absolute;
    top: 20px;
    right: 20px;
    height: 50px;
    width: 50px;
    background: white;
    z-index: 999;
    border: none;
    border-radius: 15px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    cursor: pointer;
  }

  @keyframes slide-in {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
</style>