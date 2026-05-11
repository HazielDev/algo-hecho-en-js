<script>
    /**
     * CreateForm.svelte: Formulario unificado para la captura de datos.
     * Soporta Puntos, Rutas y Polígonos mediante lógica condicional y reactividad.
     */
    import { PlusCircle, Plus, Tag, Navigation, AlignLeft } from 'lucide-svelte';

    // PROPS
    let { 
        activeTab,           // Pestaña actual (define qué campos mostrar)
        onSubmit,            // Función para guardar datos en el padre
        onCancel,            // Función para salir del modo edición
        editingItem = null,  // Datos del item si estamos editando
        mapCoords = null,    // Coordenada individual capturada del mapa
        drawnPath = null     // Ruta completa capturada con Modo Lápiz
    } = $props();

    // ESTADOS LOCALES DEL FORMULARIO
    let name = $state('');
    let description = $state('');
    let lat = $state(0);
    let lng = $state(0);
    let category = $state('');
    
    // Estados para Rutas y Polígonos
    let newLat = $state(0);
    let newLng = $state(0);
    let coordinates = $state([]); // Lista de puntos que conforman la línea o área

    /**
     * DICCIONARIO DE CATEGORÍAS UNIFICADAS
     */
    const COMMON_CATEGORIES = [
        { id: 'hogar', label: 'Hogar', color: '#ff4757' },
        { id: 'educacion', label: 'Educación', color: '#6c5ce7' },
        { id: 'comercio', label: 'Comercio', color: '#ffa502' },
        { id: 'deporte', label: 'Deportivo', color: '#ef4444' },
        { id: 'parque', label: 'Parque', color: '#2ed573' },
        { id: 'otro', label: 'Otro', color: '#94a3b8' }
    ];

    /**
     * EFECTO: Reacciona cuando cambia el item a editar (para cargar sus datos en los inputs)
     */
    $effect(() => {
        if (editingItem) {
            name = editingItem.name;
            description = editingItem.description || '';
            lat = editingItem.lat || 0;
            lng = editingItem.lng || 0;
            category = editingItem.category || '';
            coordinates = editingItem.coordinates ? [...editingItem.coordinates] : [];
        } else {
            resetForm();
        }
    });

    /**
     * EFECTO: Detecta cambios de pestaña para limpiar el formulario
     */
    $effect(() => {
        activeTab; // Tracking de dependencia
        resetForm();
    });

    /**
     * EFECTO: Captura el trazo del "Modo Lápiz" desde el mapa
     */
    $effect(() => {
        if (drawnPath && drawnPath.coordinates) {
            coordinates = [...drawnPath.coordinates];
        }
    });

    /**
     * EFECTO: Captura coordenadas individuales por click en mapa
     */
    $effect(() => {
        if (mapCoords) {
            if (activeTab === 'points') {
                lat = mapCoords.lat;
                lng = mapCoords.lng;
            } else {
                newLat = mapCoords.lat;
                newLng = mapCoords.lng;
            }
        }
    });

    /**
     * Agrega un punto manual a la lista de coordenadas (Rutas/Polígonos)
     */
    function addCoord() {
        if (newLat === 0 && newLng === 0) return alert('Por favor ingresa coordenadas válidas');
        coordinates = [...coordinates, { lat: newLat, lng: newLng }];
        newLat = 0;
        newLng = 0;
    }

    /**
     * Limpia todas las variables del formulario
     */
    function resetForm() {
        name = '';
        description = '';
        lat = 0;
        lng = 0;
        newLat = 0;
        newLng = 0;
        category = '';
        coordinates = [];
    }

    /**
     * Procesa el envío del formulario realizando validaciones previas
     */
    async function handleInternalSubmit() {
        if (!name) return alert('El nombre es obligatorio');
        
        // Validación: Categoría obligatoria salvo para rutas
        if (activeTab !== 'routes' && !category) {
            return alert('Debes seleccionar una categoría obligatoriamente');
        }

        // Estructuración de datos según el tipo de elemento
        const data = activeTab === 'points' 
            ? { name, description, lat, lng, category }
            : activeTab === 'routes'
                ? { name, coordinates } // Rutas NO llevan categoría por regla de negocio
                : { name, coordinates, category }; // Polígonos SÍ llevan categoría

        const success = await onSubmit(data, coordinates.length);
        if (success) resetForm();
    }
</script>

<section class="form-section">
    <div class="section-header">
        <PlusCircle size={20} />
        <h2>{editingItem ? 'Editar' : 'Crear'} {activeTab === 'points' ? 'Punto' : activeTab === 'routes' ? 'Ruta' : 'Polígono'}</h2>
    </div>
    
    <div class="mock-form">
        <input type="text" placeholder="Nombre del elemento" bind:value={name} />

        {#if activeTab !== 'routes'}
            <!-- Selector de Categoría (Solo Puntos y Polígonos) -->
            <div class="input-group">
                <label for="category"><Tag size={12} style="display:inline; margin-right: 4px;" /> Categoría</label>
                <select id="category" bind:value={category}>
                    <option value="" disabled selected>Selecciona una categoría...</option>
                    {#each COMMON_CATEGORIES as cat}
                        <option value={cat.id}>{cat.label}</option>
                    {/each}
                </select>
            </div>
        {/if}

        {#if activeTab === 'points'}
            <!-- Campos específicos para puntos individuales -->
            <div class="input-group">
                <label for="desc"><AlignLeft size={12} style="display:inline; margin-right: 4px;" /> Descripción</label>
                <textarea id="desc" placeholder="Descripción del punto..." bind:value={description}></textarea>
            </div>
            <div class="coords-row">
                <div class="input-group">
                    <label for="lat"><Navigation size={12} style="display:inline; margin-right: 4px;" /> Latitud</label>
                    <input id="lat" type="number" placeholder="0.0000" bind:value={lat} step="0.0001" />
                </div>
                <div class="input-group">
                    <label for="lng"><Navigation size={12} style="display:inline; margin-right: 4px;" /> Longitud</label>
                    <input id="lng" type="number" placeholder="0.0000" bind:value={lng} step="0.0001" />
                </div>
            </div>
        {:else}
            <!-- Campos específicos para Rutas y Polígonos (Multi-puntos) -->
            <div class="coords-preview">
                <p class="coords-title">Agregar coordenadas (mín. {activeTab === 'routes' ? '2' : '3'})</p>
                <div class="coords-row">
                    <div class="input-group">
                        <label for="newLat"><Navigation size={12} style="display:inline; margin-right: 4px;" /> Lat</label>
                        <input id="newLat" type="number" placeholder="0.0000" bind:value={newLat} step="0.0001" />
                    </div>
                    <div class="input-group">
                        <label for="newLng"><Navigation size={12} style="display:inline; margin-right: 4px;" /> Lng</label>
                        <input id="newLng" type="number" placeholder="0.0000" bind:value={newLng} step="0.0001" />
                    </div>
                    <button class="btn-add-circle" onclick={addCoord} title="Añadir punto a la lista">
                        <Plus size={20} />
                    </button>
                </div>

                <!-- Previsualización de puntos acumulados -->
                <div class="coords-list">
                    {#if coordinates.length === 0}
                        <p class="empty-list-text">Aún no hay puntos agregados.</p>
                    {/if}
                    {#each coordinates as coord, i}
                        <div class="coord-tag">
                            {coord.lat.toFixed(4)}, {coord.lng.toFixed(4)}
                            <button class="btn-remove-coord" onclick={() => coordinates = coordinates.filter((_, idx) => idx !== i)}>×</button>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}

        <!-- Botonera de Envío y Cancelación -->
        <div class="btn-row">
            <button class="btn-submit" onclick={handleInternalSubmit}>
                {editingItem ? 'Actualizar Elemento' : 'Guardar Elemento'}
            </button>
            
            <button class="btn-cancel" onclick={() => { resetForm(); if (onCancel) onCancel(); }} title="Limpiar formulario">
                <Plus size={20} style="transform: rotate(45deg);" />
            </button>
        </div>
    </div>
</section>

<style>
  /* Estilos omitidos para brevedad, permanecen iguales */
  .section-header { display: flex; align-items: center; gap: 10px; margin-bottom: 15px; color: #1e293b; }
  h2 { font-size: 16px; font-weight: 700; margin: 0; }
  .coords-title { font-size: 12px; font-weight: 700; color: #475569; margin: 0 0 10px 4px; }
  .mock-form { background: #f8fafc; padding: 20px; border-radius: 16px; display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; border: 1px solid #e2e8f0; }
  input, textarea, select { padding: 12px; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 14px; width: 100%; box-sizing: border-box; }
  .coords-row { display: flex; gap: 10px; align-items: flex-end; }
  .input-group { display: flex; flex-direction: column; gap: 6px; flex: 1; }
  .input-group label { font-size: 10px; font-weight: 800; color: #94a3b8; text-transform: uppercase; padding-left: 4px; }
  .btn-add-circle { background: #3b82f6; color: white; border: none; width: 42px; height: 42px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
  .coords-list { margin-top: 15px; max-height: 200px; overflow-y: auto; display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 10px; background: rgba(255, 255, 255, 0.5); border-radius: 12px; border: 1px solid #e2e8f0; }
  .empty-list-text { grid-column: span 2; color: #94a3b8; font-size: 12px; text-align: center; padding: 20px 0; margin: 0; }
  .coord-tag { background: #e2e8f0; padding: 8px 10px; border-radius: 8px; font-size: 11px; display: flex; align-items: center; justify-content: space-between; gap: 6px; }
  .btn-remove-coord { background: #cbd5e1; border: none; cursor: pointer; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; }
  .btn-row { display: flex; gap: 10px; margin-top: 5px; }
  .btn-submit { flex: 1; background: #3b82f6; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; cursor: pointer; }
  .btn-cancel { background: #f1f5f9; color: #64748b; border: none; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
</style>
