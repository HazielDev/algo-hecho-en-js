<script>
    import { Trash2, Edit3 } from 'lucide-svelte';

    /**
     * Propiedades del componente:
     * - item: Objeto con la información del registro (nombre, descripción, coordenadas, etc.)
     * - activeTab: El tipo de registro actual ('points', 'routes', 'polygons')
     * - onSelect: Función para centrar el mapa en este elemento
     * - onDelete: Función para eliminar este elemento
     * - onEdit: Función para cargar este elemento en el formulario
     */
    let { item, activeTab, onSelect, onDelete, onEdit } = $props();

    // Determina el subtítulo basado en si tiene descripción o número de puntos
    const subtitle = $derived(
        item.description || 
        (item.coordinates ? `${item.coordinates.length} puntos` : '')
    );
</script>

<!-- 
    Contenedor individual de cada registro.
    Se usa la clase 'inactive' si el registro no está marcado como activo (se verá gris).
-->
<div 
    class="list-item" 
    class:inactive={!item.active} 
    onclick={() => onSelect(item)} 
    role="button" 
    tabindex="0"
>
    <div class="item-info">
        <strong>{item.name}</strong>
        <span>{item.active ? 'Activo' : 'Inactivo'} • {subtitle}</span>
    </div>
    <div class="item-actions">
        <!-- Botón de Editar -->
        <button 
            title="Editar" 
            onclick={(e) => {
                e.stopPropagation();
                onEdit(item);
            }}
            class="btn-edit"
        >
            <Edit3 size={16} />
        </button>

        <!-- Botón de Eliminar -->
        <button 
            title="Eliminar" 
            onclick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
            }}
            class="btn-delete"
        >
            <Trash2 size={16} />
        </button>
    </div>
</div>

<style>
  .list-item {
    padding: 12px;
    border-radius: 10px;
    border: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    cursor: pointer;
    background: white;
  }

  .list-item:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    transform: translateY(-1px);
  }

  .item-info {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .item-info strong {
    font-size: 14px;
    color: #1e293b;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .item-info span {
    font-size: 11px;
    color: #94a3b8;
  }

  .list-item.inactive {
    opacity: 0.6;
    background: #f1f5f9;
  }

  .item-actions {
    display: flex;
    gap: 4px;
  }

  .item-actions button {
    background: none;
    border: none;
    cursor: pointer;
    color: #64748b;
    padding: 6px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .item-actions .btn-edit:hover {
    background: #dbeafe;
    color: #2563eb;
  }

  .item-actions .btn-delete:hover {
    background: #fee2e2;
    color: #ef4444;
  }
</style>
