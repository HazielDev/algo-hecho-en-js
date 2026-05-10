<script>
    import { PlusCircle, Plus } from 'lucide-svelte';

    /**
     * Props:
     * - activeTab: 'points', 'routes' o 'polygons'
     * - onSubmit: Función para guardar el nuevo registro
     * - editingItem: Objeto si estamos editando, null si estamos creando
     * - mapCoords: Coordenadas capturadas desde el mapa {lat, lng}
     */
    let { activeTab, onSubmit, editingItem = null, mapCoords = null } = $props();

    // Estado local para los campos del formulario
    let name = $state('');
    let description = $state('');
    let lat = $state(0);
    let lng = $state(0);
    
    // Estado para entradas manuales de coordenadas (Rutas y Polígonos)
    let newLat = $state(0);
    let newLng = $state(0);
    let coordinates = $state([]); 

    /**
     * Efecto que reacciona cuando cambia el item a editar.
     * Llena el formulario con los datos del registro seleccionado.
     */
    $effect(() => {
        if (editingItem) {
            name = editingItem.name;
            description = editingItem.description || '';
            lat = editingItem.lat || 0;
            lng = editingItem.lng || 0;
            coordinates = editingItem.coordinates ? [...editingItem.coordinates] : [];
        } else {
            resetForm();
        }
    });

    /**
     * Efecto que reacciona a los clicks en el mapa para capturar coordenadas
     */
    $effect(() => {
        if (mapCoords) {
            if (activeTab === 'points') {
                // Si es un punto, actualizamos la lat/lng principal
                lat = mapCoords.lat;
                lng = mapCoords.lng;
            } else {
                // Si es ruta o polígono, llenamos los campos de 'Nuevo Punto' 
                // para que el usuario revise y le de al botón de '+'
                newLat = mapCoords.lat;
                newLng = mapCoords.lng;
            }
        }
    });

    /**
     * Agrega un par de coordenadas a la lista temporal
     */
    function addCoord() {
        if (newLat === 0 && newLng === 0) return alert('Por favor ingresa coordenadas válidas');
        coordinates = [...coordinates, { lat: newLat, lng: newLng }];
        newLat = 0;
        newLng = 0;
    }

    /**
     * Limpia el formulario después de guardar con éxito
     */
    function resetForm() {
        name = '';
        description = '';
        lat = 0;
        lng = 0;
        coordinates = [];
    }

    /**
     * Maneja el envío del formulario delegando al componente padre
     */
    async function handleInternalSubmit() {
        // Validación básica
        if (!name) return alert('El nombre es obligatorio');

        // Construcción del objeto de datos según el tipo
        const data = activeTab === 'points' 
            ? { name, description, lat, lng }
            : { name, coordinates };

        // Llamada a la función del padre y limpieza si tiene éxito
        const success = await onSubmit(data, coordinates.length);
        if (success) resetForm();
    }
</script>

<section class="form-section">
    <!-- Título dinámico -->
    <div class="section-header">
        <PlusCircle size={20} />
        <h2>{editingItem ? 'Editar' : 'Crear'} {activeTab === 'points' ? 'Punto' : activeTab === 'routes' ? 'Ruta' : 'Polígono'}</h2>
    </div>
    
    <div class="mock-form">
        <!-- Campo Nombre (Común para todos) -->
        <input type="text" placeholder="Nombre del elemento" bind:value={name} />

        {#if activeTab === 'points'}
            <!-- Campos específicos para Puntos -->
            <textarea placeholder="Descripción del punto..." bind:value={description}></textarea>
            <div class="coords-row">
                <div class="input-group">
                    <label for="lat">Latitud</label>
                    <input id="lat" type="number" placeholder="0.0000" bind:value={lat} step="0.0001" />
                </div>
                <div class="input-group">
                    <label for="lng">Longitud</label>
                    <input id="lng" type="number" placeholder="0.0000" bind:value={lng} step="0.0001" />
                </div>
            </div>
        {:else}
            <!-- Campos específicos para Rutas y Polígonos -->
            <div class="coords-preview">
                <p>Agregar coordenadas (mín. {activeTab === 'routes' ? '2' : '3'})</p>
                <div class="coords-row">
                    <div class="input-group">
                        <label for="newLat">Lat</label>
                        <input id="newLat" type="number" placeholder="0.0000" bind:value={newLat} step="0.0001" />
                    </div>
                    <div class="input-group">
                        <label for="newLng">Lng</label>
                        <input id="newLng" type="number" placeholder="0.0000" bind:value={newLng} step="0.0001" />
                    </div>
                    <button class="btn-add-circle" onclick={addCoord} title="Añadir punto a la lista">
                        <Plus size={20} />
                    </button>
                </div>

                <!-- Lista de coordenadas agregadas -->
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

        <button class="btn-submit" onclick={handleInternalSubmit}>
            {editingItem ? 'Actualizar Elemento' : 'Guardar Elemento'}
        </button>
    </div>
</section>

<style>
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
    padding: 20px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-bottom: 30px;
    border: 1px solid #e2e8f0;
    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
  }

  input, textarea {
    padding: 12px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 14px;
    background: white;
    width: 100%;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  input:focus, textarea:focus {
    outline: none;
    border-color: #3b82f6;
  }

  .coords-row {
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }

  .input-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
    min-width: 0;
  }

  .input-group label {
    font-size: 10px;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    padding-left: 4px;
  }

  .btn-add-circle {
    background: #3b82f6;
    color: white;
    border: none;
    width: 42px;
    height: 42px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .btn-add-circle:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
  }

  .coords-preview p {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    margin: 0 0 10px 0;
  }

  .coords-list {
    margin-top: 15px;
    max-height: 200px;
    overflow-y: auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 12px;
    border: 1px solid #e2e8f0;
  }

  .empty-list-text {
    grid-column: span 2;
    width: 100%;
    text-align: center;
    font-size: 12px;
    color: #94a3b8;
    margin: 0;
    padding: 20px 0;
    font-style: italic;
  }

  .coord-tag {
    background: #e2e8f0;
    color: #475569;
    padding: 8px 10px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 6px;
    border: 1px solid #cbd5e1;
  }

  .btn-remove-coord {
    background: #cbd5e1;
    border: none;
    color: #475569;
    cursor: pointer;
    font-weight: bold;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    padding: 0;
  }

  .btn-remove-coord:hover {
    background: #ef4444;
    color: white;
  }

  .btn-submit {
    background: #1e293b;
    color: white;
    border: none;
    padding: 14px;
    border-radius: 12px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 5px;
  }

  .btn-submit:hover {
    background: #0f172a;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }
</style>
