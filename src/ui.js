;(function(window) {


    // Estado interno

    // Matriz actual de terreno
    let matriz_de_terreno_actual = [];
    // Coordenadas de inicio
    let coordenadas_punto_inicio = null;
    // Coordenadas del final
    let coordenadas_punto_final = null;
    // Modo de sleccion en curso
    let modo_seleccion_actual = null;

    const contenedor_grid_mapa = document.getElementById('mapContainer')

    function manejarGenerarMapa() {
      // 1) Leer dimensiones de los inputs
      const filas    = parseInt(inputFilas.value, 10);
      const columnas = parseInt(inputColumnas.value, 10);
    
      // 2) Resetear selecciones
      coordenadas_punto_inicio  = null;
      coordenadas_punto_final   = null;
      modo_seleccion_actual     = null;
    
      // 3) (Re)generar mapa y pintarlo
      matriz_de_terreno_actual = modulo_mapa.inicializar_mapa(filas, columnas);
      dibujar_mapa(matriz_de_terreno_actual);
    }
        

    const inputFilas         = document.getElementById('inputRowCount');
    const inputColumnas      = document.getElementById('inputColCount');
    const botonGenerarMapa   = document.getElementById('buttonGenerateMap');
    const botonSelectInicio  = document.getElementById('buttonSelectStart');
    const botonSelectDestino = document.getElementById('buttonSelectEnd');
    const botonCalcularRuta  = document.getElementById('buttonFindPath');

    botonGenerarMapa.addEventListener('click', manejarGenerarMapa);
    botonSelectInicio.addEventListener('click',  () => modo_seleccion_actual = 'inicio');
    botonSelectDestino.addEventListener('click', () => modo_seleccion_actual = 'final');
    botonCalcularRuta.addEventListener('click', manejar_calcular_ruta);


    // Renderiza el mapa
    // Dibuja en el contenedor un grid de div.celda segun la matriz recibida
    // Aplicar el CSS correspondiente

    function dibujar_mapa(matriz_de_terreno) {

        //Limpiamos contenido previo
        contenedor_grid_mapa.innerHTML = '';

        // Configurar columnas del grid: tantas columnas como logitud de fila
        contenedor_grid_mapa.style.gridTemplateColumns = `repeat(${matriz_de_terreno[0].length}, 30px)`;

        //Recorremos cada fila y cada columna
        matriz_de_terreno.forEach((fila_array, indice_fila) => {
            fila_array.forEach((valor_terreno, indice_columna) => {
                // Creamos el div que representa la celda
                const elemento_celda = document.createElement('div');
                elemento_celda.classList.add('cell');

                // Asignar la clase de estilo segun el valor de terreno
                switch (valor_terreno) {
                    case 0: elemento_celda.classList.add('cell-free'); break;
                    case 1: elemento_celda.classList.add('cell-obstacle'); break;
                    case 2: elemento_celda.classList.add('cell-water'); break;
                    case 3: elemento_celda.classList.add('cell-blocked'); break;
                }

                // Si esta posicion coincid con el inicio, marcarla
                if (coordenadas_punto_inicio && indice_fila   === coordenadas_punto_inicio.fila && indice_columna=== coordenadas_punto_inicio.columna
                ) {
                    elemento_celda.classList.add('cell-start');
                }
  

                // Si esta posicion coincide con el destino, marcarla
                if (coordenadas_punto_final && indice_fila === coordenadas_punto_final.fila && indice_columna === coordenadas_punto_final.columna) {
                    elemento_celda.classList.add('cell-end');
                }

                // Guardar sus coordenadas en atributos data-* para el handler de click
                elemento_celda.dataset.fila = indice_fila;
                elemento_celda.dataset.columna = indice_columna;

                // Asociar el evento click a la celda
                elemento_celda.addEventListener('click', manejar_click_en_celda);

                // Añadir la celda al contenedor del mapa
                contenedor_grid_mapa.appendChild(elemento_celda)
            });
            
        });
    }

    // Manejar clicks en cada celda

    function manejar_click_en_celda(evento) {

        const fila    = parseInt(evento.currentTarget.dataset.fila, 10);
        const columna = parseInt(evento.currentTarget.dataset.columna, 10);
            
        // Sólo en modo edición (modo_seleccion_actual === null)
        if (!modo_seleccion_actual) {
          const tipoActual = modulo_mapa.obtener_tipo_terreno(fila, columna);
        
          // Nuevo tipo = (tipoActual + 1) módulo 4 → 0,1,2,3,0,1…
          const nuevoTipo = (tipoActual + 1) % 4;
        
          modulo_mapa.definir_terreno(fila, columna, nuevoTipo);
          matriz_de_terreno_actual = modulo_mapa.copiar_mapa_matriz();
          dibujar_mapa(matriz_de_terreno_actual);
          return;
        }

        // Modo seleccion de inicio
        if (modo_seleccion_actual === 'inicio') {
            coordenadas_punto_inicio = {fila, columna};

            // Salimos del modo seleccion
            modo_seleccion_actual = null;
            dibujar_mapa(matriz_de_terreno_actual);
            return;
        }

        // Modo seleccion de final
        if (modo_seleccion_actual === 'final') {
            coordenadas_punto_final = {fila, columna};

            // Salimos del modo seleccion
            modo_seleccion_actual = null;
            dibujar_mapa(matriz_de_terreno_actual);
            return;
        }

        // Modo de edicion de obstaculo: leer tipo actual y alternar
        const tipo_actual = modulo_mapa.obtener_tipo_terreno(fila_clickeada, columna_clicekada);

        // Si era obstaculo (1), lo liberamos (0); si no, lo bloqueamos (1)
        const nuevo_tipo = (tipo_actual === 1 ? 0 : 1);
        modulo_mapa.definir_terreno(fila_clickeada, columna_clicekada, nuevo_tipo);

        // Actualizar matriz local y redibujar
        matriz_de_terreno_actual = modulo_mapa.copiar_mapa_matriz();
        dibujar_mapa(matriz_de_terreno_actual);
    }

    // Calcular y dibujar ruta
    function manejar_calcular_ruta(){

        // Solo continuar si hay inicio y final definidos
        if (!coordenadas_punto_inicio || !coordenadas_punto_final){
            return;
        }

        //Quitar marcas previas de ruta
        document.querySelectorAll('.cell-path').forEach(elemento => {
        elemento.classList.remove('cell-path');
        });

        // Obtener lista de coordenas del camino optimo
        const ruta_encontrada = astar_module.buscar_ruta(matriz_de_terreno_actual, coordenadas_punto_inicio, coordenadas_punto_final);

        // Pintar cada paso de la ruta con la clase cell-path
        ruta_encontrada.forEach(({fila, columna}) => {
            const selector_celda = `.cell[data-fila="${fila}"][data-columna="${columna}"]`;
            const elemento_camino =  document.querySelector(selector_celda);
            if (elemento_camino) {
                elemento_camino.classList.add('cell-path');
            }
        });
    }

    manejarGenerarMapa();

})(window);