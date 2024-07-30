document.addEventListener("DOMContentLoaded", function () {
    const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
    const endpoints = {
        client_name: "/api/clients",
        item: "/api/items",
        service: "/api/services",
        color: "/api/colors",
        pattern: "/api/patterns",
        size: "/api/sizes",
        register_client: "/api/clients/register",
        register_order: "/api/orders/register_order",
    };
    let id;
    const form = document.querySelector('order_form');
    const input = document.getElementById('client_name');
    const suggestionBox = document.getElementById('autocomplete-list');
    const checkNameButton = document.getElementById('check-name');
    const label = document.getElementsByClassName('form-label');
    const legend = document.getElementsByTagName('legend');



    input.addEventListener('input', handleInput);

    function handleEnterKey(event) {
        if (event.key === 'Enter') {
          event.preventDefault(); 
          checkNameButton.click(); 
        }
      }
  
    input.addEventListener('keydown', handleEnterKey);
    checkNameButton.addEventListener('click', handleCheckName);

    function handleInput() {
        const query = input.value.trim();
        if (query.length > 0) {
            fetchSuggestions(query);
        } else {
            suggestionBox.innerHTML = '';
        }
    }

    async function fetchSuggestions(query) {
        try {
            const response = await fetch(`${endpoints.client_name}?query=${encodeURIComponent(query)}`, {
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

    function addClientRegisterField() {
        const itemsContainer = document.querySelector('.client-det');

        if (!itemsContainer.querySelector('.item')) {
            const newItemDiv = document.createElement('div');
            newItemDiv.classList.add('item');
            newItemDiv.innerHTML = ` 
                <p class="text-danger">Client does not exist, please register the new client's information</p>
                <div class="item-box border p-3 mb-3">
                    <div class="form-group">
                        <label for="address">Address:</label>
                        <input type="text" id="address" name="address[]" class="form-control" required>
                    </div>
                    <div class="form-group">
                        <label for="phone_number">Phone number:</label>
                        <input type="text" id="phone_number" name="phone_number[]" class="form-control" required>
                    </div>
                    <!-- Botón para registrar el cliente -->
                    <button type="button" class="register-client btn btn-primary">Register Client</button>
                </div>
            `;
            itemsContainer.appendChild(newItemDiv);
            
            const registerNewClientButton = newItemDiv.querySelector('.register-client');
            registerNewClientButton.addEventListener('click', registerNewClient);
        }
    }

    async function checkClientName() {
        const clientName = input.value.trim();
        if (clientName.length > 0) {
            try {
                const response = await fetch(`${endpoints.client_name}?query=${encodeURIComponent(clientName)}`, {
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
                alert('An error occurred while verifying the client name. Please try again later.');
            }
        } else {
            alert('Please enter a client name.');
            return -1;
        }
    }

    function registerNewClient() {
        const name = document.getElementById('client_name').value;
        const address = document.getElementById('address').value;
        const phone_number = document.getElementById('phone_number').value;

        if (!name || !address || !phone_number) {
            alert('Please complete all fields');
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
                alert('Client successfully registered.');
                document.querySelector('.client-det').remove();
                handleCheckName();
            } else {
                alert('An error occurred while registering the client. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error registering new client:', error);
            alert('An error occurred while registering the client. Please try again later.');
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
            <p class="text-danger">Fields marked with * are required</p>
            <div class="item-box border p-3 mb-3">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            ${createFormGroup('item', itemId, 'Item*:', true)}
                            ${createFormGroup('service', itemId, 'Service*:', true)}
                            ${createFormGroup('main_color', itemId, 'Main Color:', true)}
                            ${createFormGroup('other_color', itemId, 'Other Color:', false)}
                        </div>
                        <div class="col-md-6">
                            ${createFormGroup('pattern', itemId, 'Pattern:', false)}
                            ${createFormGroup('size', itemId, 'Size*:', true)}
                            ${createFormGroup('softener', itemId, 'Softener?:', false, true)}
                            ${createInputGroup('indications', itemId, 'Additional indications:', false)}
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

    function createInputGroup(name, itemId, label, isRequired) {
        return `
            <div class="form-group">
                <label for="${itemId}-${name}">${label}</label>
                <input type="text" id="${itemId}-${name}" name="${name}[]" class="form-control" ${isRequired ? 'required' : ''}>
            </div>
        `;
    }

    function addDeleteButton(newItemDiv) {
        const deleteButton = newItemDiv.querySelector('.delete-item');
        deleteButton.addEventListener('click', function () {
            newItemDiv.remove();
        });
    }

    function addRegisterButton(itemsContainer) {
        const registerButton = document.getElementById('register-button');
        if (registerButton) {
            registerButton.remove();
        }
        const registerButtonDiv = document.createElement('div');
        registerButtonDiv.innerHTML = `
            <button type="button" class="btn btn-primary" id="register-button">Register</button>
        `;
        itemsContainer.appendChild(registerButtonDiv);

        const registerButtonElement = document.getElementById('register-button');
        registerButtonElement.addEventListener('click', registerOrder);
    }

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
                alert('Order successfully registered.');
                window.location.href = 'orders';
            } else {
                alert('An error occurred while registering the order. Please try again later.');
            }
        })
        .catch(error => {
            console.error('Error registering new order:', error);
            alert('An error occurred while registering the order. Please try again later.');
        });
    }

    function loadOptionsForFields(itemId) {
        loadOptions(endpoints.item, `${itemId}-item`);
        loadOptions(endpoints.service, `${itemId}-service`);
        loadOptions(endpoints.color, `${itemId}-main_color`);
        loadOptions(endpoints.color, `${itemId}-other_color`);
        loadOptions(endpoints.pattern, `${itemId}-pattern`);
        loadOptions(endpoints.size, `${itemId}-size`);
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


    function addAddItemButton(itemsContainer) {
        const addItemButton = document.querySelector('#add-item-button');
        if (addItemButton) {
            addItemButton.remove();
        }
        const addItemButtonDiv = document.createElement('div');
        addItemButtonDiv.innerHTML = `
            <button type="button" class="btn btn-secondary" id="add-item-button">Add Item</button>
        `;
        itemsContainer.appendChild(addItemButtonDiv);
        const newAddItemButton = document.querySelector('#add-item-button');
        newAddItemButton.addEventListener('click', addNewItemField);
    }

    async function loadOptions(endpoint, selectId) {
        try {
            const response = await fetch(endpoint);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const select = document.getElementById(selectId);

            select.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = '--'; 
            select.appendChild(defaultOption);
 
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

    function generateUniqueId() {
        return 'item-' + Date.now();
    }
});
