# 🌍 GeoManager Pro - Sistema de Gestión Geoespacial Avanzado

GeoManager Pro es una aplicación SIG (Sistema de Información Geográfica) de nivel profesional diseñada para la visualización, creación y gestión de datos georeferenciados. Permite a los usuarios interactuar con mapas dinámicos, trazar rutas complejas y gestionar perímetros urbanos de manera intuitiva.

---

## 🚀 Arquitectura del Proyecto

El sistema está dividido en dos grandes bloques para garantizar escalabilidad y orden:

### 1. Frontend (Svelte + Vite)
- **Tecnología**: Svelte 5 (Runes), Javascript, CSS Vanilla.
- **Mapas**: Leaflet.js con plugins de Clustering.
- **Estética**: Diseño moderno con efectos de Glassmorphism, animaciones suaves y soporte nativo para Modo Oscuro.

### 2. Backend (Node.js + Express)
- **Tecnología**: API RESTful con Express.
- **Almacenamiento**: Persistencia de datos en archivos JSON estructurados.
- **Servicios**: Rutas dedicadas para el CRUD de Puntos, Rutas y Polígonos.

---

## 🛠️ Funcionalidades Principales

### 📍 Gestión de Elementos (CRUD)
- **Puntos de Interés**: Creación de marcadores con categorías dinámicas (Hogar, Educación, Comercio, etc.).
- **Rutas**: Trazado de líneas entre múltiples coordenadas con cálculo automático de distancia.
- **Polígonos**: Definición de áreas cerradas para delimitación de zonas.

### 🎨 Sistema de Categorías Dinámicas
Cada elemento cuenta con un sistema de colores predefinido según su categoría, permitiendo una lectura visual rápida del mapa (ej. Morado para Educación, Verde para Parques).

### ✏️ Dibujo Libre (Modo Lápiz)
Funcionalidad avanzada que permite "pintar" rutas o áreas en el mapa simplemente arrastrando el mouse, eliminando la necesidad de hacer clicks individuales para formas complejas.

### 📍 Geolocalización Inteligente
Detección en tiempo real de la ubicación del usuario mediante la API del navegador, representada con un marcador azul pulsante y sincronización automática con el formulario de creación.

### 🌓 Modo Oscuro (Dark Mode)
Filtros CSS avanzados aplicados sobre los mapas de OpenStreetMap que permiten una visualización nocturna de alta fidelidad, ajustando también los colores de popups y controles.

### 📂 Gestión de Datos (Import/Export)
- **Exportar**: Descarga todo el estado actual del mapa en un archivo `geomanager_json.json`.
- **Importar**: Carga masiva de datos desde archivos externos para poblar la base de datos instantáneamente.

---

## 📦 Instalación y Uso

### Requisitos
- Node.js instalado (v16 o superior).
- Un navegador moderno.

### Ejecución del Backend
```bash
cd backend
npm install
npm start
```

### Ejecución del Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 🌟 Módulos Extra
- **Clustering**: Agrupamiento inteligente de marcadores para evitar la saturación visual cuando hay cientos de puntos.
- **Vista Satelital (Broma)**: Módulo interactivo diseñado para presentaciones que simula una pasarela de pago premium para funciones de satélite.

---

## 📄 Documentación Técnica
Para una explicación más profunda sobre la implementación de cada módulo, consulte el archivo `frontend/documentacion.md`.

---
**Proyecto desarrollado para la materia de Aplicación de Sistemas Georeferenciados.**
