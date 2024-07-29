document.addEventListener("DOMContentLoaded", function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const endpoints = {
        cliente_nombre: "/api/clients",
        item: "/get_items",
        tipo_servicio: "/get_services",
        color_principal: "/get_colors",
        color_secundario: "/get_colors",
        patron_tela: "/get_patterns",
        tamano_objeto: "/get_sizes",
        register_client: "/api/clients/register",
        register_order: "/api/orders/register_order",
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
                <p class="text-danger">Cliente no existente, por favor registra datos del nuevo cliente</p>
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
        const name = document.getElementById('cliente_nombre').value;
        const address = document.getElementById('address').value;
        const phone_number = document.getElementById('phone_number').value;

        // Verificar que name, address, and phone_number no estén vacíos
        if (!name || !address || !phone_number) {
            alert('Por favor, complete todos los campos.');
            return;
        }

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
                document.querySelector('.client-det').remove();
                handleCheckName();
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
    
    // Crea un nuevo campo de item
    function createNewItemField(itemId) {
        const newItemDiv = document.createElement('div');
        newItemDiv.innerHTML = `
            <p class="text-danger">Campos marcados con * son obligatorios</p>
            <div class="item-box border p-3 mb-3">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            ${createFormGroup('item', itemId, 'Item*:', true)}
                            ${createFormGroup('tipo_servicio', itemId, 'Tipo de Servicio*:', true)}
                            ${createFormGroup('color_principal', itemId, 'Color Principal:', true)}
                            ${createFormGroup('color_secundario', itemId, 'Color Secundario:', false)}
                        </div>
                        <div class="col-md-6">
                            ${createFormGroup('patron_tela', itemId, 'Patrón de Tela:', false)}
                            ${createFormGroup('tamano_objeto', itemId, 'Tamaño del Objeto*:', true)}
                            ${createFormGroup('suavizante', itemId, 'Suavizante?:', false, true)}
                            ${createInputGroup('indicaciones', itemId, 'Indicaciones adicionales:', false)}
                        </div>
                    </div>
                    <div class="form-group">
                        <button type="button" class="delete-item btn btn-danger">-</button>
                    </div>
                </div>
            </div>
        `;
        return newItemDiv;
    }

    // Crea un grupo de formulario para los selects
    function createFormGroup(name, itemId, label, isRequired, isSoftener = false) {
        return `
            <div class="form-group">
                <label for="${itemId}-${name}">${label}</label>
                <select id="${itemId}-${name}" name="${name}[]" class="form-control" ${isRequired ? 'required' : ''}>
                    ${isSoftener ? '<option value=false>No</option><option value=true>Si</option>' : ''}
                </select>
            </div>
        `;
    }

    // Crea un grupo de formulario para los inputs
    function createInputGroup(name, itemId, label, isRequired) {
        return `
            <div class="form-group">
                <label for="${itemId}-${name}">${label}</label>
                <input type="text" id="${itemId}-${name}" name="${name}[]" class="form-control" ${isRequired ? 'required' : ''}>
            </div>
        `;
    }

    // Agrega el botón de eliminación al nuevo campo de item
    function addDeleteButton(newItemDiv) {
        const deleteButton = newItemDiv.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            newItemDiv.remove();
        });
    }

    // Agrega el botón de registrar
    function addRegisterButton(itemsContainer) {
        const registerButton = document.getElementById('register-button');
        if (registerButton) {
            registerButton.remove();
        }
        const registerButtonDiv = document.createElement('div');
        registerButtonDiv.innerHTML = `
            <button type="button" class="btn btn-primary" id="register-button">Registrar</button>
        `;
        itemsContainer.appendChild(registerButtonDiv);

        const registerButtonElement = document.getElementById('register-button');
        registerButtonElement.addEventListener('click', registerOrder);
    }

    // Registra el pedido al hacer clic en el botón de registrar
    function registerOrder() {
        const items = document.querySelectorAll('.item-box');
        const orderData = Array.from(items).map(item => {
            const controls = item.querySelectorAll('.form-control, .form-check-input');
            return {
                item_id: controls[0].value || null,
                service_id: controls[1].value || null,
                maincolor_id: controls[2].value || null,
                othercolor_id: controls[3].value || null,
                pattern_id: controls[4].value || null,
                size_id: controls[5].value || null,
                softener: controls[6].value || null,
                indications: controls[7].value || null
            };
        });

        fetch(`${endpoints.register_order}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            },
            body: JSON.stringify({
                client_id: id,
                items: orderData
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Pedido registrado con éxito.');
                window.location.href = 'orders';
            } else {
                alert('Ocurrió un error al registrar el pedido. Por favor, inténtelo de nuevo más tarde.');
            }
        })
        .catch(error => {
            console.error('Error registering new order:', error);
            alert('Ocurrió un error al registrar el pedido. Por favor, inténtelo de nuevo más tarde.');
        });
    }

    // Cargar opciones para los campos de selección
    function loadOptionsForFields(itemId) {
        loadOptions(endpoints.item, `${itemId}-item`);
        loadOptions(endpoints.tipo_servicio, `${itemId}-tipo_servicio`);
        loadOptions(endpoints.color_principal, `${itemId}-color_principal`);
        loadOptions(endpoints.color_secundario, `${itemId}-color_secundario`);
        loadOptions(endpoints.patron_tela, `${itemId}-patron_tela`);
        loadOptions(endpoints.tamano_objeto, `${itemId}-tamano_objeto`);
    }

    // Función principal para agregar un nuevo campo de item
    function addNewItemField() {
        const itemsContainer = document.querySelector('.item');
        const itemId = generateUniqueId();
        const newItemDiv = createNewItemField(itemId);
        
        addDeleteButton(newItemDiv);
        itemsContainer.appendChild(newItemDiv);
        addAddItemButton(itemsContainer);
        addRegisterButton(itemsContainer);
        loadOptionsForFields(itemId);
        
    }

    // Function to add the green button
    function addAddItemButton(itemsContainer) {
        const addItemButton = document.querySelector('#add-item-button');
        if (addItemButton) {
            addItemButton.remove();
        }
        const addItemButtonDiv = document.createElement('div');
        addItemButtonDiv.innerHTML = `
            <button type="button" class="btn btn-secondary" id="add-item-button">Añadir Item</button>
        `;
        itemsContainer.appendChild(addItemButtonDiv);
        const newAddItemButton = document.querySelector('#add-item-button');
        newAddItemButton.addEventListener('click', addNewItemField);
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
            defaultOption.textContent = '--'; // Texto opcional para la opción vacía
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
