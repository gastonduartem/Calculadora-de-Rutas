;(function(window){

    // Creamos una clase que representa el nodo de busqueda con informacion completa
    class Nodo_a_estrella {
        
        constructor(indice_fila, indice_columna, costo_acumulado, estimacion_costo, nodo_anterior = null) {
          this.indice_fila      = indice_fila;
          this.indice_columna   = indice_columna;
          this.costo_acumulado  = costo_acumulado;                   // g
          this.estimacion_costo = estimacion_costo;                  // h
          this.costo_estimado   = costo_acumulado + estimacion_costo; // f = g + h
          this.nodo_anterior    = nodo_anterior;                     // vínculo al padre
        }
    }

    function distancia_manhattan (fila_a, columna_a, fila_b, columna_b){
        return Math.abs(fila_a-fila_b) + Math.abs(columna_a-columna_b);
    }

    // Busca la ruta mas corta en una matriz de terreno usando el algoritmo A*
    function buscar_ruta (matriz_de_terreno, coordenadas_inicio, coordenadas_final) {

        const numero_filas = matriz_de_terreno.length;
        const numero_columnas = matriz_de_terreno[0]?.length || 0;

        // Verificamos que este dentro del mapa
        function dentro_del_mapa (fila, columna) {
            return fila >= 0 && fila < numero_filas && columna >= 0 && columna < numero_columnas;
        }

        // Validamos que inicio y final sean validos y que no esten en celdas intransitables
        const valor_inicio = matriz_de_terreno[coordenadas_inicio.fila]?.[coordenadas_inicio.columna];
        const valor_final = matriz_de_terreno[coordenadas_final.fila]?.[coordenadas_final.columna];

        if (!dentro_del_mapa(coordenadas_inicio.fila,coordenadas_inicio.columna) || !dentro_del_mapa(coordenadas_final.fila,coordenadas_final.columna) || [1,3].includes(valor_inicio) || [1,3].includes(valor_final)) {
            return [];
        }

        // Estructura de nodos abiertos y nodos cerrados (ya visitados)
        const lista_nodos_abiertos = [];
        const conjunto_nodos_cerrados = new Set();

        // Creamos nodo inicial y añadimos a la lista abierta
        const nodo_inicial = new Nodo_a_estrella (coordenadas_inicio.fila,coordenadas_inicio.columna,0,distancia_manhattan(coordenadas_inicio.fila,coordenadas_inicio.columna,coordenadas_final.fila,coordenadas_final.columna), null);

        lista_nodos_abiertos.push(nodo_inicial);

        function extraer_nodo_menor_costo_estimado() {
            let mejor = 0
            for (let i = 1; i < lista_nodos_abiertos.length; ++i) {
                const nodo_actual = lista_nodos_abiertos[i];
                const nodo_mejor = lista_nodos_abiertos[mejor];
                if (nodo_actual.costo_estimado < nodo_mejor.costo_estimado || (nodo_actual.costo_estimado == nodo_mejor.costo_estimado && nodo_actual.estimacion_costo < nodo_mejor.estimacion_costo)) {
                    mejor = i;
                }
            }

            return lista_nodos_abiertos.splice(mejor, 1)[0];
        }

        // Reconstruimos el camino
        function reconstruir_camino(nodo_final) {
            const ruta = [];
            let nodo_actual = nodo_final;
            while (nodo_actual) {
                ruta.unshift({fila: nodo_actual.indice_fila, columna: nodo_actual.indice_columna});
                nodo_actual = nodo_actual.nodo_anterior;
            }
            return ruta;
        }

        // Vectores de movimiento
        const direciones = [
            {dir_fila: -1, dir_col: 0},
            {dir_fila: +1, dir_col: 0},
            {dir_fila: 0, dir_col: -1},
            {dir_fila: 0, dir_col: +1}
        ];

        // Ciclo principal de A*
        while (lista_nodos_abiertos.length > 0) {

            // Seleccionamos el nodo más prometedor, lo identificamos con una clave y lo registramos como ya explorado
            const nodo_actual = extraer_nodo_menor_costo_estimado();
            const clave_actual = `${nodo_actual.indice_fila}, ${nodo_actual.indice_columna}`;
            conjunto_nodos_cerrados.add(clave_actual);

            // Si alcanzamos el final, devolvemos el camino completo
            if (nodo_actual.indice_fila === coordenadas_final.fila && nodo_actual.indice_columna === coordenadas_final.columna) {
                return reconstruir_camino(nodo_actual);
            }

            // Explorar cada direccion posible
            for (const {dir_fila, dir_col} of direciones) {
                const fila_vecina = nodo_actual.indice_fila + dir_fila;
                const columna_vecina = nodo_actual.indice_columna + dir_col;
                if (!dentro_del_mapa(fila_vecina, columna_vecina)) continue;

                const tipo_terreno_vecino = matriz_de_terreno[fila_vecina][columna_vecina];
                // Ignoramos celdas intransitables (1=edificio, 3=bloqueado)
                if (tipo_terreno_vecino === 1 || tipo_terreno_vecino === 3) continue;

                // Determinar coste de movimiento: libre =1, agua=2
                const coste_movimiento = tipo_terreno_vecino === 2 ? 2 : 1;
                const coste_tentativo = nodo_actual.costo_acumulado + coste_movimiento;

                const clave_vecina = `${fila_vecina},${columna_vecina}`;
                if (conjunto_nodos_cerrados.has(clave_vecina)) continue;

                // Buscamos si ya existe en la lista abierta
                let nodo_vecino = lista_nodos_abiertos.find(nodo => nodo.indice_fila === fila_vecina && nodo.indice_columna === columna_vecina);

                if (!nodo_vecino) {
                    // Si no existe, creamos y añadimos
                    nodo_vecino = new Nodo_a_estrella (fila_vecina, columna_vecina, coste_tentativo, distancia_manhattan(fila_vecina, columna_vecina, coordenadas_final.fila, coordenadas_final.columna), nodo_actual);
                    lista_nodos_abiertos.push(nodo_vecino);
                } else if (coste_tentativo < nodo_vecino.costo_acumulado) {
                    // Si encontramos un camino mas barato, actualizar costes y padre
                    nodo_vecino.costo_acumulado = coste_tentativo;
                    nodo_vecino.costo_estimado = coste_tentativo + nodo_vecino.estimacion_costo;
                    nodo_vecino.nodo_anterior = nodo_actual;
                }

            }
        }

    return [];

    }

    window.astar_module = {
        buscar_ruta

    };
})(window);
