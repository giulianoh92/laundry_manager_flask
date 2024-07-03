document.addEventListener("DOMContentLoaded", function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const endpoints = {
        cliente_nombre: "/get_clients",
        item: "/get_items",
        tipo_servicio: "/get_services",
        color_principal: "/get_colors",
        color_secundario: "/get_colors",
        patron_tela: "/get_patterns",
        tamano_objeto: "/get_sizes",
        register_client: "/register_client",
    };

    // Obtener referencia a elementos del DOM

    const input = document.getElementById('cliente_nombre');
    const suggestionBox = document.getElementById('autocomplete-list');
    const form = document.getElementById('order_form');

    // Initialize existing buttons
    initializeButtons();

    // Event listener for input of cliente_nombre for autocomplete
    input.addEventListener('input', handleInput);

    // Function to handle input event
    function handleInput() {
        const query = input.value.trim();
        if (query.length > 0) {
            fetchSuggestions(query);
        } else {
            suggestionBox.innerHTML = '';
        }
    }

    // Function to fetch suggestions asynchronously
    async function fetchSuggestions(query) {
        try {
            const response = await fetch(`${endpoints.cliente_nombre}?query=${encodeURIComponent(query)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            showSuggestions(data, query);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    // Function to show filtered suggestions
    function showSuggestions(suggestions, query) {
        suggestionBox.innerHTML = '';
        suggestions.forEach(suggestion => {
            const suggestionName = suggestion.name.toLowerCase();
            const queryLower = query.toLowerCase();
            if (suggestionName.includes(queryLower)) {
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = suggestion.name;
                div.addEventListener('click', function () {
                    input.value = suggestion.name;
                    suggestionBox.innerHTML = '';
                });
                suggestionBox.appendChild(div);
            }
        });
    }

    // Function to initialize existing buttons and listeners
    function initializeButtons() {
        const addItemButton = document.getElementById('add-item');
        const checkNameButton = document.getElementById('check-name');
        addItemButton.addEventListener('click', addNewItemField);
        checkNameButton.addEventListener('click', handleCheckName);
    }

    // Función para agregar un nuevo campo de item
    function addNewItemField() {
        const itemsContainer = document.querySelector('.item');
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('item');
        const itemId = generateUniqueId();
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
        const deleteButton = newItemDiv.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            newItemDiv.remove();
        });
        itemsContainer.appendChild(newItemDiv);
        loadOptions(endpoints.item, `${itemId}-item`);
        loadOptions(endpoints.tipo_servicio, `${itemId}-tipo_servicio`);
        loadOptions(endpoints.color_principal, `${itemId}-color_principal`);
        loadOptions(endpoints.color_secundario, `${itemId}-color_secundario`);
        loadOptions(endpoints.patron_tela, `${itemId}-patron_tela`);
        loadOptions(endpoints.tamano_objeto, `${itemId}-tamano_objeto`);
    }

    // Función para cargar opciones en un select desde un endpoint
    async function loadOptions(endpoint, selectId) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const select = document.getElementById(selectId);
            
            // Limpiar opciones actuales del select
            select.innerHTML = '';
            
            // Agregar opción vacía como elemento inicial
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Seleccione una opción'; // Texto opcional para la opción vacía
            select.appendChild(defaultOption);
            
            // Agregar las opciones recibidas del endpoint
            data.forEach(option => {
                const optionElement = document.createElement('option');
                optionElement.value = option.id;
                optionElement.textContent = option.name || option.description;
                select.appendChild(optionElement);
            });
        } catch (error) {
            console.error(`Error loading options from ${endpoint}:`, error);
        }
    }

    // Function to generate a unique ID
    function generateUniqueId() {
        return 'item-' + Date.now();
    }

    // Function to handle checking client name
    async function handleCheckName() {
        let id = await checkClientName();
        console.log('Client ID:', id);
        if (id == null) {
            addClientRegisterField();
        }
    }

    // Función para agregar un nuevo campo de registro de cliente
    function addClientRegisterField() {
        const itemsContainer = document.querySelector('.client-det');
        const newItemDiv = document.createElement('div');
        newItemDiv.classList.add('item');
        const itemId = generateUniqueId();
        newItemDiv.innerHTML = `
            <div class="item-box">
                <div class="form-field">
                    <label for="${itemId}-address">Dirección:</label>
                    <input type="text" id="${itemId}-address" name="address[]">
                </div>
                <div class="form-field">
                    <label for="${itemId}-phone_number">Número de teléfono:</label>
                    <input type="text" id="${itemId}-phone_number" name="phone_number[]">
                </div>
   
                <!-- Botón para registrar el cliente -->
                <button id="register-client">Registrar Cliente</button>
            </div>
        `;
        itemsContainer.appendChild(newItemDiv);

        // Initialize the new button
        const registerNewClientButton = newItemDiv.querySelector('#register-client');
        registerNewClientButton.addEventListener('click', registerNewClient);
    }

    // Función para registrar un nuevo cliente
    function registerNewClient() {
        let name = document.getElementById('cliente_nombre').value;
        let address = document.getElementById('address').value;
        let phone_number = document.getElementById('phone_number').value;
        //`${endpoints.register_client}`
        console.log(endpoints.register_client)
        console.log(name, address, phone_number)
        /*
        fetch('/register_client', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                name: name,
                address: address,
                phone_number: phone_number
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                alert('Cliente registrado correctamente');
                //window.location.href = '/clients';
            } else {
                alert('Error al registrar cliente: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error al registrar cliente:', error);
        });
        */
    }

    // Función asincrónica para verificar si el nombre del cliente existe
    async function checkClientName() {
        const clientName = input.value.trim();
        if (clientName.length > 0) {
            try {
                const response = await fetch(`${endpoints.cliente_nombre}?query=${encodeURIComponent(clientName)}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': csrfToken
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const client = data.find(client => client.name.toLowerCase() === clientName.toLowerCase());
                if (client) {
                    return client.id;
                } else {
                    return null;
                }
            } catch (error) {
                console.error('Error checking client name:', error);
                alert('Ocurrió un error al verificar el nombre del cliente. Por favor, inténtelo de nuevo más tarde.');
            }
        } else {
            alert('Por favor, ingrese un nombre de cliente.');
            return -1;
        }
    }
});
