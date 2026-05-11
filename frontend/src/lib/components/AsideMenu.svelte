<script>
    /**
     * AsideMenu.svelte: Controlador del menú lateral derecho.
     * Gestiona el estado de las pestañas, la edición de elementos y las funciones de importación/exportación.
     */
    import { MapPinIcon, Menu, XIcon, Download, Upload } from 'lucide-svelte';
    
    // Sub-componentes del menú
    import TabNavigation from './menu/TabNavigation.svelte';
    import CreateForm from './menu/CreateForm.svelte';
    import SavedItemsList from './menu/SavedItemsList.svelte';

    // Servicios de comunicación con la API
    import { createPoint, deletePoint, updatePoint } from '../../services/pointsService';
    import { createPolygon, deletePolygon, updatePolygon } from '../../services/polygonsService';
    import { createRouteLine, deleteRouteLine, updateRouteLine } from '../../services/routesLinesService';

    // PROPS (Entradas de datos del componente)
    let { 
        open = $bindable(true),   // Controla si el menú está visible u oculto
        points = [],              // Datos de puntos desde App.svelte
        polygons = [],            // Datos de polígonos
        routesLines = [],         // Datos de rutas
        loading = false,          // Estado de carga del backend
        mapCoords = null,         // Coordenadas recibidas por click en mapa
        drawnPath = null,         // Ruta recibida por dibujo libre
        onUpdate,                 // Función callback para refrescar datos
        onSelect                  // Función callback para centrar mapa
    } = $props();

    /**
     * EXPORTAR A JSON: Genera un archivo descargable con el estado actual del mapa.
     */
    function downloadJSON() {
        const dataToExport = { points, routesLines, polygons };
        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'geomanager_json.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    /**
     * IMPORTAR JSON: Lee un archivo del usuario e inserta cada elemento en el backend.
     */
    async function handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                let count = 0;

                // Procesamiento secuencial de cada tipo de dato
                if (importedData.points) {
                    for (const p of importedData.points) { await createPoint(p); count++; }
                }
                if (importedData.routesLines) {
                    for (const r of importedData.routesLines) { await createRouteLine(r); count++; }
                }
                if (importedData.polygons) {
                    for (const poly of importedData.polygons) { await createPolygon(poly); count++; }
                }

                alert(`¡Éxito! Se importaron ${count} elementos.`);
                if (onUpdate) await onUpdate(); // Refrescar listas después de importar
            } catch (err) {
                alert("Error al procesar el JSON: " + err.message);
            }
        };
        reader.readAsText(file);
    }

    // ESTADO LOCAL DEL MENÚ
    let activeTab = $state('points');  // Pestaña seleccionada (points, routes, polygons)
    let editingItem = $state(null);    // Objeto que se está editando actualmente (null = modo creación)

    /**
     * GUARDAR: Maneja tanto la creación (POST) como la actualización (PATCH)
     */
    async function handleSave(data, coordinatesLength) {
        try {
            if (editingItem) {
                // Modo EDICIÓN
                if (activeTab === 'points') await updatePoint(editingItem.id, data);
                else if (activeTab === 'routes') await updateRouteLine(editingItem.id, data);
                else if (activeTab === 'polygons') await updatePolygon(editingItem.id, data);
                alert('¡Actualizado con éxito!');
            } else {
                // Modo CREACIÓN
                if (activeTab === 'points') await createPoint(data);
                else if (activeTab === 'routes') {
                    if (coordinatesLength < 2) return alert('Una ruta ocupa mínimo 2 puntos');
                    await createRouteLine(data);
                } else if (activeTab === 'polygons') {
                    if (coordinatesLength < 3) return alert('Un polígono ocupa mínimo 3 puntos');
                    await createPolygon(data);
                }
                alert('¡Guardado con éxito!');
            }
            
            editingItem = null; // Resetear modo edición
            if (onUpdate) await onUpdate();
            return true; 
        } catch (error) {
            alert('Error al procesar: ' + error.message);
            return false;
        }
    }

    /**
     * Activa el modo edición para un elemento específico
     */
    function handleEditItem(item) {
        editingItem = item;
    }

    /**
     * BORRADO: Elimina un registro del backend previo aviso al usuario
     */
    async function handleDelete(id) {
        if (!confirm('¿Seguro que lo quieres borrar?')) return;
        try {
            if (activeTab === 'points') await deletePoint(id);
            else if (activeTab === 'routes') await deleteRouteLine(id);
            else if (activeTab === 'polygons') await deletePolygon(id);
            if (onUpdate) await onUpdate();
        } catch (error) {
            alert('No se pudo borrar: ' + error.message);
        }
    }

    /**
     * Centrar mapa en el elemento seleccionado
     */
    function handleSelectItem(item) {
        if (!onSelect) return;
        onSelect(item);
    }

    // LISTA DERIVADA: Se actualiza automáticamente cuando cambia la pestaña o los datos
    const currentItems = $derived(
        activeTab === 'points' ? points : 
        activeTab === 'routes' ? routesLines : 
        polygons
    );
</script>

{#if open}
    <aside>
        <div class="top-header">
            <div class="brand">
                <MapPinIcon class="brand-icon" />
                <h1>GeoManager</h1>
            </div>

            <!-- Botones de Acción Global -->
            <div class="header-actions">
                <input type="file" id="import-json" accept=".json" style="display: none;" onchange={handleImport} />
                <button class="btn-download" onclick={() => document.getElementById('import-json').click()} title="Importar JSON">
                    <Upload size={18} />
                </button>
                <button class="btn-download" onclick={downloadJSON} title="Exportar JSON">
                    <Download size={18} />
                </button>
                <button class="btn-close" onclick={()=>{open=false;}} title="Cerrar menú">
                    <XIcon size={20} />
                </button>
            </div>
        </div>

        <!-- Selector de Pestañas -->
        <TabNavigation bind:activeTab onTabChange={() => editingItem = null} />

        <div class="content-scroll">
            <!-- Formulario de Entrada de Datos -->
            <CreateForm 
                {activeTab} 
                onSubmit={handleSave}
                onCancel={() => editingItem = null}
                {editingItem}
                {mapCoords}
                {drawnPath}
            />

            <!-- Listado de Elementos Guardados -->
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
    <button class="btn-open" onclick={()=>{open=true;}} title="Abrir GeoManager">
        <Menu />
    </button>
{/if}

<style>
  /* Los estilos permanecen iguales para mantener la estética premium */
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

  .top-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid #f1f5f9;
  }

  .brand { display: flex; align-items: center; gap: 12px; }
  .header-actions { display: flex; align-items: center; gap: 8px; }

  .btn-download {
    background: #f1f5f9;
    border: none;
    color: #64748b;
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .btn-download:hover { background: #3b82f6; color: white; transform: translateY(-2px); }
  .btn-close { background: none; border: none; cursor: pointer; color: #94a3b8; padding: 5px; }
  .btn-close:hover { color: #ef4444; }

  :global(.brand-icon) { color: #ef4444; filter: drop-shadow(0 2px 4px rgba(239, 68, 68, 0.3)); }
  h1 { font-size: 22px; font-weight: 800; margin: 0; color: #1e293b; letter-spacing: -0.5px; }

  .content-scroll { flex: 1; overflow-y: auto; padding: 20px; }

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