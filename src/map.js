;(function(window) {

    // matriz interna que representa el mapa
    let mapa_matrix = [];

    // numero de filas y columnas actuales del mapa
    let total_rows = 0;
    let total_cols = 0;

    // Inicializa o reinicia el mapa con todas las celdas en 0
    function inicializar_mapa(rows, cols) {

        // Guardamos las nuevas dimensiones
        total_rows = rows;
        total_cols = cols;

        // Creamos la matriz inicializada en 0
        mapa_matrix = Array.from(
            {length: total_rows},
            () => Array.from({length: total_cols}, 
            () => 0)
        );

        // Devolvemos una copia por las dudas
        return getmapa_matrixcopy();

    }

    // Asigna un tipo de terreno a una celda especifica
    function definir_terreno (row_index, column_index, tipo_terreno) {

        // Validamos dentro del tablero
        const row_valid = row_index >= 0 && row_index < total_rows;
        const col_valid = column_index >= 0 && column_index < total_cols;

        // Validamos que el terreno sea uno de los permitidos
        const terreno_valido = [0, 1, 2 , 3].includes(tipo_terreno);

        if (row_valid && col_valid && terreno_valido) {
            mapa_matrix[row_index][column_index]=tipo_terreno;
            return true;
        }

        // Si algo falla que no modifique el mapa
        return false;
    }

    // Devuelve el tipo de terreno almacenado en la celda indicada del mapa, o null si están fuera de rango
    function obtener_tipo_terreno (row_index, column_index) {

        if (row_index >= 0 && row_index < total_rows && column_index >= 0 && column_index < total_cols){
            return mapa_matrix[row_index][column_index];
        }

        return null;
    }

    // Creamos una copia de la matriz
    function getmapa_matrixcopy() {
        return mapa_matrix.map(row => row.slice());
    }

    // Compartimos las funciones a todo el programa para que asi cualquier parte de la misma pueda usarla
    window.modulo_mapa = {
        inicializar_mapa,
        definir_terreno,
        obtener_tipo_terreno,
        getmapa_matrixcopy
    };

})(window);
//prueba