# THE HUDDLE – Calculadora de Rutas

## Descripción
“THE HUDDLE” es una herramienta de cálculo de rutas que, dada una malla de terreno con distintos obstáculos y costes de movimiento, encuentra el camino más corto entre dos puntos usando el algoritmo A*. Está implementada con JavaScript (sin bundlers), HTML y CSS puros.

---

## Tecnologías
- **Lenguaje**: JavaScript (ES5/ES6), HTML5, CSS3  
- **Patrón de módulos**: Exposición en `window.*` para evitar configuración de bundlers  
- **Algoritmo**: A* con heurística de distancia Manhattan  

---

## Instalación
1. Clona o descarga este repositorio.  
2. Abre `index.html` en tu navegador favorito.  
3. Ya estás listo para generar mapas y calcular rutas.

---

## Uso
1. Define las dimensiones del mapa (filas × columnas) y haz clic en **Generar Mapa**.  
2. Haz clic en **Seleccionar Inicio** y pulsa sobre la casilla deseada.  
3. Haz clic en **Seleccionar Destino** y elige la casilla de llegada.  
4. Opcionalmente, alterna obstáculos haciendo clic (pasa por libre → edificio → agua → bloqueado → libre).  
5. Haz clic en **Calcular Ruta** para que A* trace el camino óptimo, que se dibuja en color dorado.

---

## Estructura de archivos

- **`index.html`**  
  Interfaz principal y leyenda.

- **`styles.css`**  
  Estilos de la cuadrícula y leyenda.

- **Directorio `src/`**  
  - `map.js`  
    Módulo de generación y manipulación del mapa.  
  - `astar.js`  
    Implementación del algoritmo A*.  
  - `ui.js`  
    Lógica de la interfaz de usuario.



---

## Principales funcionalidades
- **Mapa interactivo**: crea, reinicia y muestra una matriz bidimensional.  
- **Obstáculos dinámicos**: permite ciclar entre 4 tipos de terreno con un clic.  
- **Selección de inicio/destino**: gesto de usuario claro y visual.  
- **Algoritmo A\***: encuentra rutas evitando obstáculos, con coste variable según tipo de terreno.  
- **Leyenda**: explica colores de cada tipo de celda directamente en la página.

---

## Retos y aprendizajes
- **Visualización en HTML/CSS**: la parte que **más me costó** fue conseguir que el grid se adaptara dinámicamente, que las casillas cambiaran de clase sin glitches y que la leyenda quedara clara y responsiva.  
- **Modularidad sin bundler**: exponer las API en `window.*` me ayudó a mantener todo simple, pero tuve que prestar atención a nombres y colisiones globales.  
- **Algoritmo A\***: entender y ajustar la heurística de Manhattan, así como gestionar correctamente los costes `g`, `h` y `f`.

---

## Licencia
MIT © [Gastón Duarte]
