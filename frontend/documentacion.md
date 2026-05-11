# 🗺️ Guía de Funcionalidades Avanzadas en Leaflet

Esta documentación detalla los temas investigados e implementados en el proyecto **GeoManager Pro**, enfocándose en mejorar la visualización y el rendimiento del mapa.

---

## 🎨 1. Iconos Personalizados (Custom Markers)

### ¿Qué es?
Leaflet permite reemplazar los marcadores azules estándar por diseños propios. En este proyecto, hemos utilizado la técnica de **`L.divIcon`**.

### ¿Cómo funciona?
A diferencia de `L.icon` (que usa imágenes fijas), `L.divIcon` crea un contenedor HTML que podemos estilizar con CSS. 

**Implementación en el proyecto:**
- **HTML**: Inyectamos un `<svg>` de la librería **Lucide**.
- **CSS**: Usamos transformaciones (`rotate`, `scale`) para crear una forma de pin elegante.
- **Interactividad**: Se agregaron efectos de `:hover` para que el marcador crezca al pasar el mouse.

**Ventaja principal:**
- Al usar SVG y CSS, los íconos nunca se pixelan y puedes cambiar su color o forma instantáneamente sin necesidad de editar archivos de imagen.

---

## 📂 2. Marker Clustering (Agrupamiento de Marcadores)

### ¿Qué es?
Es una técnica de optimización que agrupa múltiples marcadores en un solo "cluster" cuando el zoom es muy bajo.

### ¿Cómo funciona?
Se utiliza el plugin `Leaflet.markercluster`. En lugar de añadir puntos directamente al mapa, se añaden a un **MarkerClusterGroup**.

**Características implementadas:**
- **Agrupación Inteligente**: Si hay 10 puntos en la misma colonia, verás un círculo con el número "10".
- **Spiderfy**: Si haces click en un cluster donde los puntos están exactamente en la misma coordenada, estos se "abren" como patas de araña para permitirte seleccionar cada uno.
- **Rendimiento**: Evita que el navegador se trabe al intentar dibujar cientos de elementos simultáneamente.

---

## 🛠️ 3. Interacción y Captura de Coordenadas

### Captura Dinámica
Se implementó un sistema de comunicación entre el Mapa y el Formulario:
- **Click Izquierdo**: Captura la coordenada y la inyecta directamente en los inputs del formulario.
- **Click Derecho**: Muestra un popup informativo con los datos brutos (`lat`, `lng`).

### Popups Dinámicos
Cada elemento (punto, ruta o polígono) genera su propio popup extrayendo la información en tiempo real desde el backend.

---

**NOTA**: Estas funcionalidades no suelen verse en cursos introductorios y elevan el proyecto a un nivel profesional/comercial.

**IMPORTANTE**: Para el Clustering, se instaló la dependencia `leaflet.markercluster` y se importaron sus estilos específicos para que los grupos tengan el diseño circular estándar.
