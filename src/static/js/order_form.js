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
    let id;
    const form = document.querySelector('order_form');
    const input = document.getElementById('cliente_nombre');
    const suggestionBox = document.getElementById('autocomplete-list');
    const checkNameButton = document.getElementById('check-name');
    const label = document.getElementsByClassName('form-label');
    const legend = document.getElementsByTagName('legend');


    // Event listener para input de cliente_nombre para autocompletado de nombres similares
    input.addEventListener('input', handleInput);

    function handleEnterKey(event) {
        if (event.key === 'Enter') {
          event.preventDefault(); // Optional: prevent the default action if needed
          checkNameButton.click(); // Trigger a click on the button
        }
      }
  
    input.addEventListener('keydown', handleEnterKey);
    checkNameButton.addEventListener('click', handleCheckName);

    // funcion para manejar el input
    function handleInput() {
        const query = input.value.trim();
        if (query.length > 0) {
            fetchSuggestions(query);
        } else {
            suggestionBox.innerHTML = '';
        }
    }

    // Funcion para obtener sugerencias de nombres de clientes registrados
    async function fetchSuggestions(query) {
        try {
            //peticion HTTP POST para traer los nombres de clientes matching (query)
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
            showSuggestions(data, query); // mostrar resultados
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    }

    // Mostrar las sugerencias obtenidas
    function showSuggestions(suggestions, query) {
        suggestionBox.innerHTML = '';
        suggestions.forEach(suggestion => {
            const suggestionName = suggestion.full_name.toLowerCase();
            const queryLower = query.toLowerCase();
            if (suggestionName.includes(queryLower)) {
                const div = document.createElement('div');
                div.classList.add('autocomplete-suggestion');
                div.textContent = suggestion.full_name;
                div.addEventListener('click', function () {
                    input.value = suggestion.full_name;
                    suggestionBox.innerHTML = '';
                });
                suggestionBox.appendChild(div);
            }
        });
    }

    // Función para verificar la existencia del cliente ingresado
    async function handleCheckName() {
        id = await checkClientName();
        if (id == null) {
            addClientRegisterField();
        }else{
            input.disabled = true;
            checkNameButton.disabled = true;
            checkNameButton.style.backgroundColor = '#b2ff59';
            checkNameButton.style.color = '#000000';
            generateOrderForm();
        }
    }

    // Función para agregar un nuevo campo de registro de cliente
    function addClientRegisterField() {
        const itemsContainer = document.querySelector('.client-det');

        // Verificar si ya existe un campo de registro de cliente
        if (!itemsContainer.querySelector('.item')) {
            const newItemDiv = document.createElement('div');
            newItemDiv.classList.add('item');
            newItemDiv.innerHTML = ` 
                <div class="item-box border p-3 mb-3">
                    <div class="form-group">
                        <label for="address">Dirección:</label>
                        <input type="text" id="address" name="address[]" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Número de teléfono:</label>
                        <input type="text" id="phone_number" name="phone_number[]" class="form-control" required>
                    </div>
                    <!-- Botón para registrar el cliente -->
                    <button type="button" class="register-client btn btn-primary">Registrar Cliente</button>
                </div>
            `;
            itemsContainer.appendChild(newItemDiv);
            
            // Inicializar el nuevo botón
            const registerNewClientButton = newItemDiv.querySelector('.register-client');
            registerNewClientButton.addEventListener('click', registerNewClient);
        }
        
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
                let client;
                if (data.length > 0 && data[0].full_name === clientName) {
                    client = data[0];
                }
                if (client) {
                    return client.client_id;
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

    // Función para registrar un nuevo cliente
    function registerNewClient() {
        let name = document.getElementById('cliente_nombre').value;
        let address = document.getElementById('address').value;
        let phone_number = document.getElementById('phone_number').value;
    
        fetch(`${endpoints.register_client}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                full_name: name,
                address: address,
                phone_number: phone_number
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Cliente registrado con éxito.');
                window.location.href = 'home';
            } else {
                alert('Ocurrió un error al registrar el cliente. Por favor, inténtelo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error('Error registering new client:', error);
            alert('Ocurrió un error al registrar el cliente. Por favor, inténtelo de nuevo más tarde.');
        });
    }

    function generateOrderForm() {
        setTimeout(() => {
            input.remove();
            checkNameButton.remove();
            label[0].remove();
            suggestionBox.remove();
            addNewItemField();
        }, 1000);

    }
    
    // Función para agregar un nuevo campo de item
    function addNewItemField() {
        const itemsContainer = document.querySelector('.item');
        const newItemDiv = document.createElement('div'); // Cambio aquí para 'div' en lugar de 'form-group'
        const itemId = generateUniqueId();
        newItemDiv.innerHTML = `
            <div class="item-box border p-3 mb-3">
                <div class="form-group">
                    <label for="${itemId}-item">Item:</label>
                    <select id="${itemId}-item" name="item[]" class="form-control" required></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-tipo_servicio">Tipo de Servicio:</label>
                    <select id="${itemId}-tipo_servicio" name="tipo_servicio[]" class="form-control" required></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-color_principal">Color Principal:</label>
                    <select id="${itemId}-color_principal" name="color_principal[]" class="form-control" required></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-color_secundario">Color Secundario:</label>
                    <select id="${itemId}-color_secundario" name="color_secundario[]" class="form-control"></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-patron_tela">Patrón de Tela:</label>
                    <select id="${itemId}-patron_tela" name="patron_tela[]" class="form-control"></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-tamano_objeto">Tamaño del Objeto:</label>
                    <select id="${itemId}-tamano_objeto" name="tamano_objeto[]" class="form-control" required></select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-suavizante">Suavizante?:</label>
                    <select id="${itemId}-suavizante" name="suavizante[]" class="form-control" values>
                        <option value=false>No</option>
                        <option value=true>Si</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="${itemId}-indicaciones">Indicaciones adicionales:</label>
                    <input type="text" id="${itemId}-indicaciones" name="indicaciones[]" class="form-control">
                </div>
                <div class="form-group">
                    <button type="button" class="delete-item btn btn-danger">-</button>
                </div>
            </div>

        `;
        const deleteButton = newItemDiv.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            newItemDiv.remove();
        });
        itemsContainer.appendChild(newItemDiv);
        const registerButton = document.getElementById('register-button');
        if(registerButton){
            registerButton.remove();
        }
        const registerButtonDiv = document.createElement('div');
        registerButtonDiv.innerHTML = `
        <button type="button" class="btn btn-primary" id="register-button">Registrar</button>
        `;
        itemsContainer.appendChild(registerButtonDiv);
        const registerButtonElement = document.getElementById('register-button');
        let orderData = [];
        orderData.push(id);
        registerButtonElement.addEventListener('click', function () {
            const items = document.querySelectorAll('.item-box');
            items.forEach(item => {
                const control = item.querySelectorAll('.form-control, .form-check-input');
                const elementData = {
                    item_id: control[0].value === '' ? null : control[0].value,
                    service_id: control[1].value === '' ? null : control[1].value,
                    maincolor_id: control[2].value === '' ? null : control[2].value,
                    othercolor_id: control[3].value === '' ? null : control[3].value,
                    pattern_id: control[4].value === '' ? null : control[4].value,
                    size_id: control[5].value === '' ? null : control[5].value,
                    softener: control[6].value === '' ? null : control[6].value,
                    indications: control[7].value === '' ? null : control[7].value
                };
                orderData.push(elementData);
            });
            console.log(orderData);
        });

        const addItemButton = document.querySelector('#add-item-button');
        if (addItemButton){
            addItemButton.remove();
        }
        //

        // Cargar opciones para los campos de selección
        loadOptions(endpoints.item, `${itemId}-item`);
        loadOptions(endpoints.tipo_servicio, `${itemId}-tipo_servicio`);
        loadOptions(endpoints.color_principal, `${itemId}-color_principal`);
        loadOptions(endpoints.color_secundario, `${itemId}-color_secundario`);
        loadOptions(endpoints.patron_tela, `${itemId}-patron_tela`);
        loadOptions(endpoints.tamano_objeto, `${itemId}-tamano_objeto`);

        addAddItemButton();
    }

    // Función para agregar el botón verde
    function addAddItemButton() {
        const itemsContainer = document.querySelector('.item');
        const addButtonDiv = document.createElement('div');
        addButtonDiv.innerHTML = `
            <div class="form-group">
                <button type="button" id="add-item-button" class="btn btn-success">Agregar otro item</button>
            </div>
        `;
        itemsContainer.appendChild(addButtonDiv);

        const addItemButton = addButtonDiv.querySelector('#add-item-button');
        addItemButton.addEventListener('click', addNewItemField);
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
});
