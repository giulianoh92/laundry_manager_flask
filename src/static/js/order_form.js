document.addEventListener("DOMContentLoaded", function () {
    // Cuando el DOM está completamente cargado, se ejecuta esta función anónima

    // Obtener el token CSRF de la meta etiqueta
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

    // Definir los endpoints para cada tipo de autocompletado
    const endpoints = {
        cliente_nombre: "/get_clients",
        item: "/get_items",
        tipo_servicio: "/get_services",
        color_principal: "/get_colors",
        color_secundario: "/get_colors",
        patron_tela: "/get_patterns",
        tamano_objeto: "/get_sizes"
    };

    // Obtener referencia al input de texto y al contenedor de sugerencias
    const input = document.getElementById('cliente_nombre');
    const suggestionBox = document.getElementById('autocomplete-list');

    // Escuchar el evento de entrada (cuando el usuario escribe algo en el input)
    input.addEventListener('input', function () {
        // Obtener el valor actual del input y eliminar espacios en blanco al inicio y final
        const query = this.value.trim();
        
        // Verificar si la consulta tiene al menos un caracter
        if (query.length > 0) {
            // Si la consulta tiene caracteres, llamar a la función para obtener sugerencias
            fetchSuggestions(query);
        } else {
            // Si la consulta está vacía, vaciar el contenedor de sugerencias
            suggestionBox.innerHTML = '';
        }
    });

    // Función asincrónica para obtener sugerencias de la API
    async function fetchSuggestions(query) {
        try {
            // Realizar una solicitud GET a la API usando el endpoint correspondiente y pasando la consulta como parámetro
            const response = await fetch(`${endpoints.cliente_nombre}?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            
            // Verificar si la respuesta HTTP fue exitosa
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Parsear la respuesta JSON
            const data = await response.json();
            
            // Mostrar las sugerencias obtenidas
            showSuggestions(data, query); // Pasamos la consulta actual como parámetro adicional
        } catch (error) {
            // Capturar errores y mostrarlos en la consola del navegador
            console.error('Error fetching suggestions:', error);
        }
    }

    // Función para mostrar las sugerencias filtradas
    function showSuggestions(suggestions, query) {
        // Limpiar el contenedor de sugerencias antes de agregar nuevas sugerencias
        suggestionBox.innerHTML = '';
        
        // Iterar sobre cada sugerencia recibida de la API
        suggestions.forEach(suggestion => {
            // Convertir el nombre de la sugerencia y la consulta actual a minúsculas para comparar
            const suggestionName = suggestion.name.toLowerCase();
            const queryLower = query.toLowerCase();
            
            // Verificar si el nombre de la sugerencia contiene la consulta actual
            if (suggestionName.includes(queryLower)) {
                // Si la sugerencia coincide, crear un elemento div para mostrarla
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = suggestion.name; // Mostrar el nombre de la sugerencia
                
                // Agregar un evento click para seleccionar la sugerencia y llenar el input con su nombre
                div.addEventListener('click', function () {
                    input.value = suggestion.name;
                    suggestionBox.innerHTML = ''; // Vaciar el contenedor de sugerencias después de seleccionar una
                });
                
                // Agregar el div creado al contenedor de sugerencias
                suggestionBox.appendChild(div);
            }
        });
    }

    const addItemButton = document.getElementById('add-item');
    const form = document.getElementById('order_form');
    
    // Agregar evento al botón de agregar item
    addItemButton.addEventListener('click', function () {
        addNewItemField();
    });
    
    // Función para agregar un nuevo campo de item
    function addNewItemField() {
        const itemsContainer = document.querySelector('.item');
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('item');
        
        // Generate a unique ID for the new item
        const itemId = generateUniqueId(); // Implement your own function to generate unique IDs
        
        // HTML for the new item field
        newItemDiv.innerHTML = `
                        <div class="item-box">
                            <div class="form-field">
                                <label for="${itemId}-item">Item:</label>
                                <select id="${itemId}-item" name="item[]" required></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-tipo_servicio">Tipo de Servicio:</label>
                                <select id="${itemId}-tipo_servicio" name="tipo_servicio[]" required></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-color_principal">Color Principal:</label>
                                <select id="${itemId}-color_principal" name="color_principal[]" required></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-color_secundario">Color Secundario:</label>
                                <select id="${itemId}-color_secundario" name="color_secundario[]"></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-patron_tela">Patrón de Tela:</label>
                                <select id="${itemId}-patron_tela" name="patron_tela[]"></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-tamano_objeto">Tamaño del Objeto:</label>
                                <select id="${itemId}-tamano_objeto" name="tamano_objeto[]"></select>
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-suavizante">Suavizante?</label>
                                <input type="checkbox" id="${itemId}-suavizante" name="suavizante[]" value="si">
                            </div>
                            <div class="form-field">
                                <label for="${itemId}-indicaciones">Indicaciones adicionales:</label>
                                <input type="text" id="${itemId}-indicaciones" name="indicaciones[]">
                            </div>
                            <div class="form-field">
                                <button type="button" class="delete-item">-</button>
                            </div>
                        </div>
                        `;
        
        // Button to delete the new item field
        const deleteButton = newItemDiv.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            newItemDiv.remove();
        });
        
        // Add the new item field to the items container
        itemsContainer.appendChild(newItemDiv);
    }
    
    function generateUniqueId() {
        // Implement your own unique ID generation logic here, e.g., using timestamp or random number
        return 'item-' + Date.now(); // Example: generates IDs like 'item-1624612345678'
    }

        const checkNameButton = document.getElementById('check-name');

    checkNameButton.addEventListener('click', function () {
        checkClientName();
    });

    // Función asincrónica para verificar si el nombre del cliente existe
    async function checkClientName() {
        // Obtener el valor del input del nombre del cliente y eliminar espacios en blanco al inicio y final
        const clientName = document.getElementById('cliente_nombre').value.trim();

        // Verificar si el input no está vacío
        if (clientName.length > 0) {
            try {
                // Realizar una solicitud GET a la API para verificar si el cliente existe
                const response = await fetch(`${endpoints.cliente_nombre}?query=${encodeURIComponent(clientName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    }
                });

                // Verificar si la respuesta HTTP fue exitosa
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Parsear la respuesta JSON
                const data = await response.json();

                // Verificar si el cliente existe en los datos obtenidos
                const clientExists = data.some(client => client.name.toLowerCase() === clientName.toLowerCase());

                // Mostrar un mensaje al usuario sobre la existencia del cliente
                if (clientExists) {
                    alert('El cliente existe en la base de datos.');
                } else {
                    alert('El cliente no existe en la base de datos.');
                }
            } catch (error) {
                // Capturar errores y mostrarlos en la consola del navegador
                console.error('Error checking client name:', error);
                alert('Ocurrió un error al verificar el nombre del cliente. Por favor, inténtelo de nuevo más tarde.');
            }
        } else {
            alert('Por favor, ingrese un nombre de cliente.');
        }
    }
});

